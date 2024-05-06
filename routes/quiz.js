module.exports = function(app){
    const express = require('express');
    const router = express.Router();
    const quiz = require('../lib/quiz');
    const tools = require('../lib/tools');

    router.get('/new', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.query.fcmToken]))
            return res.json({ resultCode: 2 });

        quiz.getQuiz(req.query.fcmToken, function(resultCode, isAttemptExceeded, quizInfo){
            if(resultCode != 0)
                return res.json({ resultCode: resultCode });
            
            if(isAttemptExceeded)
                res.json({ resultCode: resultCode, isAttemptExceeded: true});
            else
                res.json({ resultCode: resultCode, isAttemptExceeded: false, question: quizInfo['QUESTION'],
                    options: [quizInfo['OPTION1'], quizInfo['OPTION2'], quizInfo['OPTION3'], quizInfo['OPTION4'], quizInfo['OPTION5']] });
        });
    });

    router.post('/check-answer', function(req, res){
        //const clientIp = tools.get_client_ip();

        if(!tools.isQueryVaild([req.query.fcmToken, req.query.answerNumber]))
            return res.json({ resultCode: 2 });

        quiz.checkAnswerCorrect(req.query.fcmToken, req.query.answerNumber, function(resultCode, isAnswerCorrect, remainingAttempts){
            if(resultCode != 0)
                return res.json({ resultCode: resultCode });
            if(isAnswerCorrect)
                res.json({ resultCode: resultCode, isAnswerCorrect: isAnswerCorrect });
            else
                res.json({ resultCode: resultCode, isAnswerCorrect: isAnswerCorrect, remainingAttempts: remainingAttempts });
        });
    });

    return router;
};