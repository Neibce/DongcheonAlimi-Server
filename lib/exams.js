const pool = require('./db.connect');

function get(year, callback){
    pool.query('SELECT DATE_FORMAT(START_DATE, ?) AS START_DATE, DATE_FORMAT(END_DATE, ?) AS END_DATE, TITLE, TYPE FROM T_EXAMS WHERE year(START_DATE)=? ORDER BY START_DATE, TYPE DESC;',
        ['%Y-%m-%d', '%Y-%m-%d', year],
        function(err, data){
            if (err){
                console.log(err);
                return callback(3);
            }
            else{
                let dataMapped = data.map(row => ({startDate: row.START_DATE, endDate: row.END_DATE, title: row.TITLE, type: row.TYPE}));
                if(typeof data === 'undefined' || typeof dataMapped === 'undefined')
                    return callback(20);
                return callback(0, dataMapped);
            }
        });
}

module.exports = {
    get : get
};