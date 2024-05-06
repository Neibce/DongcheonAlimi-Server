module.exports = function(app){
    const express = require('express');
    const router = express.Router();
    const multiparty = require('multiparty');
    const board = require('../lib/board');
    const tools = require('../lib/tools');

    const form = new multiparty.Form();

    router.post('/new', (req, res) => {
        if(!tools.isQueryVaild([req.query.fcmToken, req.query.type]))
            return res.json({ result_code: 2 });

        board.createPost(req, res, function(resultCode){
            res.json({ resultCode: resultCode });
        });
    });

    router.get('/list', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.query.lastPostId, req.query.type]))
            return res.json({ result_code: 2 });

        form.parse(req, function(err, fields, files) {
            if(err)
                return res.json({ resultCode: 3 });
            board.getList(req.query.lastPostId, req.query.type, fields.manageToken, function(resultCode, postList, isLast){
                if(resultCode != 0)
                    return res.json({ resultCode: resultCode });
                
                res.json({ resultCode: resultCode, posts: postList, isLast: isLast });
            });
        });
    });

    router.get('/:postId', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.query.fcmToken, req.params.postId]))
            return res.json({ result_code: 2 });

        form.parse(req, function(err, fields, files) {
            board.getBody(req.query.fcmToken, req.params.postId, function(resultCode, postBody, views, isOwner, image1, image2){
                if(resultCode != 0)
                    return res.json({ resultCode: resultCode });
                
                res.json({ resultCode: resultCode, body: postBody, views: views, isOwner: isOwner, image1: image1, image2: image2 });
            });
        });
    });

    router.post('/:postId/delete', function(req, res){
        //const clientIp = tools.get_client_ip();
        
        if(!tools.isQueryVaild([req.query.fcmToken, req.params.postId]))
            return res.json({ result_code: 2 });

        form.parse(req, function(err, fields, files) {
            if(err)
                return res.json({ resultCode: 3 });

            board.deletePost(req.query.fcmToken, fields.manageToken, req.params.postId, function(resultCode){
                if(resultCode != 0)
                    return res.json({ resultCode: resultCode });
                
                res.json({ resultCode: resultCode });
            });
        });
    });

    
    router.post('/:postId/edit', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.params.type]))
            return res.json({ result_code: 2 });

        board.post(req.params.postId, function(resultCode, postBody){
            if(resultCode != 0)
                return res.json({ resultCode: resultCode });
            
            res.json({ resultCode: resultCode, body: postBody });
        });
    });

    router.post('/', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.params.type]))
            return res.json({ result_code: 2 });

        board.post(req.params.postId, function(resultCode, postBody){
            if(resultCode != 0)
                return res.json({ resultCode: resultCode });
            
            res.json({ resultCode: resultCode, body: postBody });
        });
    });

    return router;
};