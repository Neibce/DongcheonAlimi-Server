const express = require('express');
const app = express();
const logger = require('morgan');

console.log('NODE_ENV: ' + process.env.NODE_ENV);

app.enable('trust proxy');
app.disable('x-powered-by');

app.use(express.json());
app.use(logger('short'));

logger.token('remote-addr', function (req) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

const schedulesRouter = require('./routes/schedules')(app);
app.use('/schedules', schedulesRouter);
const examsRouter = require('./routes/exams')(app);
app.use('/exams', examsRouter);
const classesRouter = require('./routes/classes')(app);
app.use('/classes', classesRouter);
const boardRouter = require('./routes/board')(app);
app.use('/board', boardRouter);
const quizRouter = require('./routes/quiz')(app);
app.use('/quiz', quizRouter);
const imagesRouter = require('./routes/images')(app);
app.use('/images', imagesRouter);

app.get('*', function(req, res){
    res.status(404).json({ result: 404 });
});


app.listen(3001, function(){
    console.log('Express server has started on port 3000');
});
