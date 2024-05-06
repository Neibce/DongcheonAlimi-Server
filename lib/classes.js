const pool = require('./db.connect');

function getCount(gradeNum, callback){
    pool.query('SELECT COUNT(*) FROM T_SCHOOL_CLASSES WHERE GRADE=?;', [gradeNum],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            else {
                if(typeof data === 'undefined' || typeof data[0]['COUNT(*)'] === 'undefined')
                    return callback(20);
                return callback(0, data[0]['COUNT(*)']);
            }
        });
}

module.exports = {
    getCount : getCount
};