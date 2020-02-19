var mysql = require('mysql');
var config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'papersystem'
};
// const connection = mysql.createConnection(config);  //创建一个连接

//封装查询数据库的代码
module.exports = {
    //封装查询数据的方法
    query:function(sql,params,callback) {
            var connection = mysql.createConnection(config);        //连接数据库
            connection.connect(function(err){
                if(err){                  //数据库操作失败
                    console.log('数据库链接失败');
                    throw err;
                }
                //数据库连接成功，开始数据操作
               connection.query(sql,params ,function(err,results,fields) { 
                   if(err) {
                       console.log('无法查询数据');   //数据操作失败
                       throw err;
                   }
                   //callback && callback(JSON.parse(JSON.stringify(results)),JSON.parse(JSON.stringify(fields)));
                   callback && callback(results,fields);
                   //将查询出来的数据返回给回调函数，results为数据操作后的结果，fields为数据库连接的一些字段

                   //停止数据库连接
                   connection.end(function(err) {
                       if(err) {
                           console.log('关闭数据库连接失败');
                           throw err;
                       }
                   });
                });
             });
          }
}
