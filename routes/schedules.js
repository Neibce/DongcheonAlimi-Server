module.exports = function(app){
    const express = require('express');
    const router = express.Router();
    const schadules = require('../lib/schedules');
    const tools = require('../lib/tools');

    router.get('/:grade/:class', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.params.grade, req.params.class]))
            return res.json({ result_code: 2 });

        schadules.get(req.params.grade, req.params.class,
            function(resultCode, scheduleList){
                if(resultCode != 0)
                    res.json({ resultCode: resultCode });
                else
                    res.json({ resultCode: resultCode, schedules: scheduleList });
            });
    });
    
    return router;
};