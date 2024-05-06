const pool = require('./db.connect');
const tools = require('./tools');

function checkQuizCorrect(fcmToken, callback){
    pool.query('SELECT COUNT(*) FROM T_QUIZ_STATUS WHERE USER_FCM_TOKEN = ? AND STATUS = 1 AND EXPIRATION_DATE >= CURRENT_DATE();'+
        'UPDATE T_QUIZ_STATUS SET STATUS = 2 WHERE USER_FCM_TOKEN = ? AND STATUS = 1 AND EXPIRATION_DATE >= CURRENT_DATE();',
    [fcmToken, fcmToken],
    function(err, data){
        if (err){
            console.log(err);
            return callback(3);
        }

        if(typeof data[0] === 'undefined')
            return callback(3);

        return callback(0, data[0][0]['COUNT(*)']);
    });
}

function checkQuizAlreadyExist(fcmToken, callback){
    pool.query('SELECT COUNT(*) FROM T_QUIZ_STATUS WHERE USER_FCM_TOKEN=? AND STATUS=0 AND EXPIRATION_DATE >= CURRENT_DATE();', [fcmToken],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }

            if(typeof data[0] === 'undefined')
                return callback(3);

            return callback(0, data[0]['COUNT(*)']);
        });
}

function createQuiz(fcmToken, callback){
    pool.query('INSERT INTO T_QUIZ_STATUS (USER_FCM_TOKEN, QUIZ_NUMBER, EXPIRATION_DATE) VALUES(?, (SELECT INTERNAL_ID FROM T_QUIZZES ORDER BY RAND() LIMIT 1), DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY));', [fcmToken],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }

            return callback(0);
        });
}

function getQuizInfo(fcmToken, callback){
    pool.query('SELECT QUESTION, OPTION1, OPTION2, OPTION3, OPTION4, OPTION5 FROM T_QUIZZES WHERE INTERNAL_ID IN (SELECT QUIZ_NUMBER FROM T_QUIZ_STATUS WHERE USER_FCM_TOKEN=? AND STATUS=0 AND EXPIRATION_DATE >= CURRENT_DATE());', [fcmToken],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }

            if(typeof data[0] === 'undefined')
                return callback(3);

            return callback(0, false, data[0]);
        });
}

function getQuiz(fcmToken, callback){
    tools.checkFcmTokenVaild(fcmToken, function(fcmResultcode){
        if(fcmResultcode != 0)
            return callback(fcmResultcode);
            
        checkQuizAlreadyExist(fcmToken, function(checkQuizExistResultCode, isExist){
            if(checkQuizExistResultCode != 0)
                return callback(checkQuizExistResultCode);

            if(isExist){
                getTryCount(fcmToken, function(getTryCountResultCode, tryCount){
                    if(getTryCountResultCode != 0)
                        return callback(getTryCountResultCode);

                    if(tryCount >= 2)
                        return callback(0, true);

                    getQuizInfo(fcmToken, callback);
                });
            }else {
                createQuiz(fcmToken, function(createQuizResultCode){
                    if(createQuizResultCode != 0)
                        return callback(createQuizResultCode);
                    
                    getQuizInfo(fcmToken, callback);
                });
            }
        });
    });
}

function getTryCount(fcmToken, callback){
    pool.query('SELECT TRY_COUNT FROM T_QUIZ_STATUS WHERE USER_FCM_TOKEN=? AND STATUS=0 AND EXPIRATION_DATE >= CURRENT_DATE();',
        [fcmToken],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }

            if(typeof data[0] === 'undefined')
                return callback(21);

            callback(0, data[0]['TRY_COUNT']);
        });
}

function changeQuiz(fcmToken, callback){
    pool.query('UPDATE T_QUIZ_STATUS SET QUIZ_NUMBER=(SELECT INTERNAL_ID FROM T_QUIZZES WHERE INTERNAL_ID NOT IN (SELECT QUIZ_NUMBER FROM (SELECT * FROM T_QUIZ_STATUS) AS w1 WHERE USER_FCM_TOKEN=? AND STATUS=0 AND EXPIRATION_DATE >= CURRENT_DATE()) ORDER BY RAND() LIMIT 1);',
        [fcmToken],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            
            return callback(0);
        });
}

function updateQuestionStatus(fcmToken, statusNumber, callback){
    pool.query('UPDATE T_QUIZ_STATUS SET STATUS = ? WHERE USER_FCM_TOKEN = ? AND EXPIRATION_DATE >= CURRENT_DATE();',
        [statusNumber, fcmToken],
        function(err, data) {
            if (err){
                console.log(err);
                return callback(3);
            }
            
            return callback(0);
        });
}

function checkAnswerCorrect(fcmToken, answerNumber, callback){
    //답 체크(try++), 틀림 - 문제 바꿈 - 새 문제 반환, 맞음 - 상태 바꿈 - 맞음 반환
    getTryCount(fcmToken, function (resultCode, tryCount) {
        if(resultCode != 0)
            return callback(resultCode);
        
        if(tryCount >= 2)
            return callback(20);

        pool.query('UPDATE T_QUIZ_STATUS SET TRY_COUNT = TRY_COUNT + 1, EXPIRATION_DATE = DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY) WHERE USER_FCM_TOKEN=? AND STATUS=0 AND EXPIRATION_DATE >= CURRENT_DATE();'+
            'SELECT COUNT(*) FROM T_QUIZZES WHERE INTERNAL_ID IN (SELECT QUIZ_NUMBER FROM T_QUIZ_STATUS WHERE USER_FCM_TOKEN=? AND STATUS=0);'+
            'SELECT COUNT(*) FROM T_QUIZZES WHERE INTERNAL_ID IN (SELECT QUIZ_NUMBER FROM T_QUIZ_STATUS WHERE USER_FCM_TOKEN=? AND STATUS=0) AND ANSWER = ?;',
        [fcmToken, fcmToken, fcmToken, answerNumber],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }

            if(typeof data[1][0] === 'undefined' || typeof data[2][0] === 'undefined')
                return callback(3);

            if(!data[1][0]['COUNT(*)'])
                return callback(21);

            if(data[2][0]['COUNT(*)']){
                updateQuestionStatus(fcmToken, 1, function(resultCode){
                    if(resultCode != 0)
                        return callback(resultCode);

                    return callback(resultCode, Boolean(data[2][0]['COUNT(*)']));
                });
            }else {
                changeQuiz(fcmToken, function(resultCode){
                    if(resultCode != 0)
                        return callback(3);

                    return callback(resultCode, Boolean(data[2][0]['COUNT(*)']), 2 - tryCount - 1);
                });
            }
        });
    });
}

module.exports = {
    checkAnswerCorrect : checkAnswerCorrect,
    getQuiz : getQuiz,
    checkQuizCorrect : checkQuizCorrect
};