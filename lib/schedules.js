const pool = require('./db.connect');

function get(gradeNum, classNum, callback){
    pool.query('SELECT * FROM T_SCHOOL_SCHEDULES WHERE GRADE=? AND CLASS=? ORDER BY DAY, PERIOD;', [gradeNum, classNum],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            else{
                let dataMapped = data.map(row => ({day: row.DAY, period: row.PERIOD, subject: row.SUBJECT, teacher: row.TEACHER}));
                if(typeof data === 'undefined' || typeof dataMapped === 'undefined')
                    return callback(20);
                return callback(0, dataMapped);
            }
        });
}

module.exports = {
    get : get
};