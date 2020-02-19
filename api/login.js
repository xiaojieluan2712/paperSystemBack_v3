var express = require('express');
var app = express();

var db = require('../database');

var jwt = require('jsonwebtoken');  //用于生成token

module.exports = {
    loginByUserName: function(req,res) {
        //console.log(req.body);
        var sql = 'select * from user where username=' + req.body.username;
        var params = {
          password: req.body.password
        };
        db.query(sql,params, function(data,fields) {
          //console.log('api/login查询到的该登录用户信息');
          //console.log(data);
          if(data.length != 0) {
            var content = { userId: data[0].userId}; //要生成的token的主题信息
            var secretPrPrivateKey = 'jwt'; //要加密的key(密钥)
            var token = jwt.sign(content,secretPrPrivateKey, {
              expiresIn: 60*60*24   //24小时过期
            });
            var pwd = data[0].password;
            if(pwd !== params.password) {
              res.json({resCode:2, resMsg:'密码错误',data:{role:data[0].role}});
              res.end();
            } else {
             var result = {
               resCode: 1,  //正确返回码
               resMsg: '账号密码正确',
               data: {
                 token:token,
                 role: data[0].role
               }
             }
             res.json(result);
             res.end();
            }
          }else {
            res.json({resCode:401,resMsg:'账户不存在'});
          }
        });
    },

    getUserInfo:function(req,res) {
        //console.log('/api/user接口的headers和token-----------------------------------------------------')
        //console.log(req.headers);
        //console.log(req.headers.token);
        var token = req.headers.token;
        //解析token
        jwt.verify(token,'jwt',(err,decoded) => {
            if(err) {
            //console.log('解析token错误信息------------------------------------------------------------------')
            console.log(err);
            return err;
            }else {
            //console.log('解析成功结果----------------------------------------------------------------------------');
            //console.log(decoded);  //打印token解析成功的信息
            var userId = decoded.userId;
            //console.log('解析token结果中的userId--------------------------------------------------------------------')
           // console.log('userId:'+userId);
            var sql = 'select * from user where userId=' + userId;
            db.query(sql,[],function(data,fields) {
                //打印查询结果
                //console.log('/api/user接口查询到的用户信息----------------------------------------------------------')
                //console.log(data);
                res.json(data);
                res.end();
            })
            }
        })
      },
      
      logout: function(req,res) {
        var result = {
          resCode: 10000,
          resMsg: '登出成功'
        }
        res.json(result);
        res.end();
      }
}