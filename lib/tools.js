const request = require('request');
const fcmServerKey = '{YOUR_KEY}';
const fcmAdmin = require('firebase-admin');

const serviceAccount = require('../dongcheonalimi-firebase-adminsdk-f5v9u-bee48a06e6.json');

fcmAdmin.initializeApp({
    credential: fcmAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://dongcheonalimi.firebaseio.com'
});


function isReqQueryVaild(req_list){
    let result = 1;
    req_list.forEach(query => {
        if(typeof query === 'undefined')
            return result = 0;
    });
    return result;
}

function isSelQueryVaild(sel_list){
    let result = 0;
    sel_list.forEach(query => {
        if(typeof query !== 'undefined')
            return result = 1;
    });
    return result;
}

function isQueryVaild(req_list, sel_list){
    if(typeof sel_list !== 'undefined')
        return isReqQueryVaild(req_list) && isSelQueryVaild(sel_list);
    else
        return isReqQueryVaild(req_list);
}

function getClientIpAddress(req){
    return req.headers['x-real-ip'] || req.connection.remoteAddress;
}

function checkFcmTokenVaild(token, callback){
    request.post('https://fcm.googleapis.com/fcm/send',{
        headers: {
            'Authorization' : 'key=' + fcmServerKey,
            'Content-Type' : 'application/json'
        },
        body: '{"registration_ids": ["'+token+'"]}'
    }, function (er, rs, bd) {
        if (er){
            console.log(er);
            return callback(3);
        }

        var parsedBd = JSON.parse(bd);

        if(typeof parsedBd.success === 'undefined')
            return callback(3); 

        if(parsedBd.success)
            return callback(0);
        else
            return callback(10);
    });
}

module.exports = {
    checkFcmTokenVaild: checkFcmTokenVaild,
    isQueryVaild : isQueryVaild,
    getClientIpAddress : getClientIpAddress,
    fcmAdmin : fcmAdmin
};