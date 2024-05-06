module.exports = function(app){
    const express = require('express');
    const router = express.Router();
    const exams = require('../lib/exams');
    const tools = require('../lib/tools');

    router.get('/:year', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.params.year]))
            return res.json({ result_code: 2 });

        exams.get(req.params.year,
            function(resultCode, examList){
                if(resultCode != 0)
                    res.json({ resultCode: resultCode });
                else
                    res.json({ resultCode: resultCode, exams: examList });
            });
    });
    
    return router;
};