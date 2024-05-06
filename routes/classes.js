module.exports = function(app){
    const express = require('express');
    const router = express.Router();
    const classes = require('../lib/classes');
    const tools = require('../lib/tools');

    router.get('/count/:grade', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.params.grade]))
            return res.json({ result_code: 2 });

        classes.getCount(req.params.grade,
            function(resultCode, classCount){
                if(resultCode != 0)
                    res.json({ resultCode: resultCode });
                else
                    res.json({ resultCode: resultCode, classCount: classCount });
            });
    });
    
    return router;
};