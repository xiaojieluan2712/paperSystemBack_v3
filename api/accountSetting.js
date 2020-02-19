// accountSetting页面的接口
var express = require('express');
var app = express();

var db = require('../database');
var { parseToken } = require('../parseToken');

module.exports = {
    //accountSetting页面 /api/changeUserInfo
    changeUserInfo: function(req,res) {
        var body = req.body;
       // console.log('修改用户信息接口--------------------------------------------');
        //console.log(body);
        var fields = '';
        var values = '';
        for(let k in body) {
          if(body[k] !== null) {
            values = values + k+ "='"+body[k]+ "',"
          }
        }
        values = values.slice(0,-1);
        values += ' ';
        // console.log(values);
        // 更新一条数据 update 'tabalename' set 'name' = 'xxx' ,'sex' = 'xxx';
        var sql = "update user set "+ values + "where userName ='" + body.userName+ "'"; 
        //console.log(sql);
        db.query(sql,[],function(data,fields) {
          //console.log('用户修改个人信息------------------------------------------');
          //console.log(data);
          // res.json(data);
          res.json({resMsg:'修改成功'});
          res.end();
        })
      },
    //修改remark信息的接口
    changeRemark: function(req,res) {
        var body = req.body;
        //console.log('api/changeRemark---------------------------------');
        //console.log(body);
        //console.log(req.headers.token);
        var token = req.headers.token;
        var userId = parseToken(token);  //获取到用户信息
        //console.log(userId);
        // update 'user' set 'remark'= 'xxx
        var sql = "update user set remark = '"+ body.remark+"' where userId = "+ userId;
        //var sql = "update user set remark='添加remark信息' where userId=321002";
        //console.log(sql);
        db.query(sql,[],function(data,fields) {
          var result = {
            resCode: 10000,
            resMsg: '修改成功'
          }
          res.json(result);
          res.end();
        });
      }
}
   


