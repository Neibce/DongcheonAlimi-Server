const multer = require('multer');
const pool = require('./db.connect');
const quiz = require('./quiz');
const tools = require('./tools');

const MANAGE_TOKEN = '{YOUR_TOKEN}';

function getList(id, type, manageToken, callback){
    if(isNaN(parseInt(id)))
        return callback(2);

    let query = 'SELECT INTERNAL_ID, TITLE, UPLOADER, UPLOAD_DATE FROM T_BOARD WHERE TYPE=? AND DELETED = 0';

    let qList = [type];
    if(id != -1){
        query += ' AND INTERNAL_ID < ?';
        qList.push(id);
    }
    query += ' ORDER BY INTERNAL_ID DESC LIMIT ?;';
    qList.push(10);

    pool.query(query, qList,
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            else{
                let dataMapped = data.map(row => ({id: row.INTERNAL_ID, title: row.TITLE, uploader: row.UPLOADER, createdAt: row.UPLOAD_DATE}));
                if(typeof data === 'undefined' || typeof dataMapped === 'undefined')
                    return callback(20);

                getLastId(type, function(resultCode, lastId){
                    if(resultCode != 0)
                        return callback(resultCode);

                    let isLastList;
                    if(dataMapped.length == 0)
                        isLastList = true;
                    else
                        isLastList = dataMapped[dataMapped.length - 1].id == lastId;

                    return callback(0, dataMapped, isLastList);
                });
            }
        });
}

function createPost(req, res, callback){
    if(isNaN(parseInt(req.query.type)))
        return callback(2);

    quiz.checkQuizCorrect(req.query.fcmToken, function(resultCode, isCorrect){
        if(resultCode != 0)
            return callback(3);

        if(!isCorrect)
            return callback(30);

        const uploadImg = multer({ dest: './uploads/image/', limits: { fileSize: 10 * 1024 * 1024 } }).array('image', 2);
        uploadImg(req, res, function (err) {
            if(err){
                console.log(err);
                return callback(3);
            }

            if(req.query.type == 0 && req.body.manageToken != MANAGE_TOKEN) {
                return callback(4);
            }

            if(req.body.title.length == 0 || req.body.body.length <= 15){
                return callback(2);
            }

            let uploader = req.body.uploader;
            if(req.query.type == 0)
                uploader = '학생부';
            else if(req.query.type == 1)
                uploader = '익명';

            let deviceModel = '';
            if(typeof req.body.deviceModel !== 'undefined')
                deviceModel = req.body.deviceModel;
    
            let query = 'INSERT INTO T_BOARD (TYPE, TITLE, BODY, UPLOADER, USER_FCM_TOKEN, USER_IP_ADDRESS, USER_DEVICE_MODEL';
            let values = [req.query.type, req.body.title, req.body.body, uploader, req.query.fcmToken, tools.getClientIpAddress(req), deviceModel ];

            switch(req.files.length){
            case 0:
                query += ') VALUES(?, ?, ?, ?, ?, ?, ?);';
                break;
            case 1:
                query += ', ATTACHED_IMAGE_1) VALUES(?, ?, ?, ?, ?, ?, ?, ?);';
                values.push(req.files[0].filename);
                break;
            case 2:
                query += ', ATTACHED_IMAGE_1, ATTACHED_IMAGE_2) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);';
                values.push(req.files[0].filename);
                values.push(req.files[1].filename);
                break;
            }

            query += 'INSERT INTO T_BOARD_VIEWS (POST_ID, VIEWS) VALUES(LAST_INSERT_ID(), 0);';

            pool.query(query, values,
                function(err, data){
                    if (err){
                        console.log(err);
                        return callback(3);
                    }

                    callback(0);

                    let message = {};
                    if(req.query.type == 1){
                        message = {
                            notification: {
                                title: '새로운 공지사항이 등록되었습니다.',
                                body: '제목: ' + req.body.title
                            },
                            topic: 'noticePostNotification'
                        };
                    }else if(req.query.type == 0){
                        message = {
                            notification: {
                                title: '새로운 건의사항이 등록되었습니다.',
                                body: '제목: ' + req.body.title
                            },
                            topic: 'suggestionPostNotification'
                        };
                    }

                    tools.fcmAdmin.messaging().send(message)
                        .then((response) => {
                            console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                    
                    return;
                });
        });
    });
}

function deletePost(fcmToken, manageToken, id, callback){
    let query = 'UPDATE T_BOARD SET DELETED = 1 WHERE USER_FCM_TOKEN = ? AND INTERNAL_ID = ?;';
    let values = [fcmToken, id];
    
    if(manageToken == MANAGE_TOKEN){
        query = 'UPDATE T_BOARD SET DELETED = 1 WHERE INTERNAL_ID = ?;';
        values = [id];
    }

    pool.query(query, values,
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            else{
                if(typeof data === 'undefined' || typeof data['changedRows'] === 'undefined')
                    return callback(3);

                if(data['changedRows'] == 1)
                    return callback(0);
                else
                    return callback(20);
            }
        });
}

function getLastId(type, callback){
    if(isNaN(parseInt(type)))
        return callback(2);

    pool.query('SELECT * FROM T_BOARD WHERE TYPE=? AND DELETED = 0 ORDER BY INTERNAL_ID LIMIT 1;', [type],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            else{
                if(typeof data === 'undefined')
                    return callback(20);

                let lastId = -1;
                if(typeof data[0] !== 'undefined')
                    lastId = data[0]['INTERNAL_ID'];

                return callback(0, lastId);
            }
        });
}

function getBody(fcmToken, id, callback){
    if(isNaN(parseInt(id)))
        return callback(2);

    pool.query('SELECT BODY, USER_FCM_TOKEN, ATTACHED_IMAGE_1, ATTACHED_IMAGE_2 FROM T_BOARD WHERE INTERNAL_ID=? AND DELETED = 0;'+
    'SELECT * FROM T_BOARD_VIEWS WHERE POST_ID=?;' +
    'UPDATE T_BOARD_VIEWS set VIEWS=VIEWS+1 WHERE POST_ID = ?;', [id, id, id],
    function(err, data){
        if (err){
            console.log(err);
            return callback(3);
        }
        else{
            if(typeof data === 'undefined' || typeof data[0] === 'undefined' || typeof data[0][0] === 'undefined' || typeof data[0][0]['BODY'] === 'undefined'
                || typeof data[1][0] === 'undefined' || typeof data[1][0]['VIEWS'] === 'undefined')
                return callback(20);
                
            return callback(0, data[0][0]['BODY'], data[1][0]['VIEWS'], fcmToken == data[0][0]['USER_FCM_TOKEN'], data[0][0]['ATTACHED_IMAGE_1'], data[0][0]['ATTACHED_IMAGE_2']);
        }
    });
}

module.exports = {
    getList : getList,
    getBody : getBody,
    deletePost: deletePost,
    createPost : createPost
};