var fs = require('fs');

module.exports = function(app){
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const tools = require('../lib/tools');

    router.get('/:imageName', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.params.imageName]))
            return res.json({ result_code: 2 });

        let imagePath = path.resolve(__dirname + '/../uploads/image' + path.normalize('/' + req.params.imageName));
        fs.exists(imagePath, function(exists) {
            if (exists) {
                res.set('Content-Type', 'image/jpeg');
                res.sendFile(imagePath);
            } else {
                res.status(404).json({ result: 404 });
            }
        });
        
    });
    
    return router;
};