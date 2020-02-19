var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var util = require('util');
var querysting = require('querystring');
var bodyParser = require('body-parser');  //解析，用于req.body获取post参数
// var cors = require('cors');
var jwt = require('jsonwebtoken');  //用于生成token
var db = require('./database');
app.listen(8000,() => {
    console.log('the server is listening 8000');
});
app.use(bodyParser.json());   // for parseing application/json
app.use(bodyParser.urlencoded({extended: true}));   //for parsing application/x-www-form-urlencoded
// app.use(cors());  //允许跨域
//设置跨域请求
app.all('*', function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9527");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Max-Age,Content-Type,token");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

var {changeUserInfo, changeRemark} = require('./api/accountSetting');
var { loginByUserName, getUserInfo,logout } = require('./api/login');
var { initial,createQuesObj, getQuesDetails, editQues, deleteQues} = require('./api/testEntry');

//登录，获取用户信息
app.post('/api/login',function(req,res) { loginByUserName(req,res); })
app.get('/api/user',function(req,res) { getUserInfo(req,res)});
app.post('/api/logout',function(req,res) { logout(req,res); });

//accountSetting页面
app.post('/api/changeUserInfo',function(req,res) { changeUserInfo(req,res); });
app.post('/api/changeRemark',function(req,res) { changeRemark(req,res); });

//testEntry页面
app.get('/api/testEntry/initial',function(req,res) { initial(req,res); });
app.post('/api/testEntry/createQuesObj',function(req,res) { createQuesObj(req,res); });
app.post('/api/testEntry/getQuesDetails',function(req,res) { getQuesDetails(req,res); });
app.post('/api/testEntry/editQues', function(req,res) { editQues(req,res); });
app.post('/api/testEntry/deleteQues',function(req,res) { deleteQues(req,res); })

