// 自动组卷页面的接口
var express = require('express');
var app = express();

var db = require('../database');
var { parseToken } = require('../parseToken');
var { getRandom } = require('../utils');

module.exports = {
    // 获取科目列表
    autoInitial:function(req,res) {
        var sql = 'select * from subjects';
        db.query(sql,[],function(data,fields) {
           var result = {
               resCode:1000,
               resMsg: '获取成功',
               data:data
           };
           res.json(result);
           res.end();
        });
    },
    //automaticTest页面的自动组卷按钮接口 /api/autoCreate
    autoCreate:function(req,res) {
        var actions = [];  //用来放多个promise
      // 通过token解析获取userId
      var token = req.headers.token;
      var userId = parseToken(token);

      var subjectId = req.body.subjectId
      var typeScoreList = req.body.typeScoreList
      // console.log(typeScoreList);
      var len = typeScoreList.length; //4
      var sqls = [];
      var resDataKey = [];
      for(let i=0;i<len;i++) {
          var typeId = typeScoreList[i][0];
          var number = typeScoreList[i][1];
          var perScore = typeScoreList[i][2];
          resDataKey.push(typeId);
          var sql = 'select question,result from question where subjectId = '+subjectId + ' && typeId ='+ typeId + ' && userId = '+ userId + ' limit '+ number;
          sqls.push(sql);
      }
      //console.log(sqls);
      var resData = {};
      for(let i=0;i<len;i++) {
        var action = function() {
            return new Promise(resolve => {
              ((index) => {
                 //console.log(sqls[index]);
                 db.query(sqls[index],[],function(data,fields) {
                   resData[resDataKey[index]] = data;
                   //console.log(resData[resDataKey[index]]);
                   resolve();
              });
              })(i);
            });
        };
        actions[i] = action();
      }
      Promise.all(actions).then(() => {
        var result = {
            resCode: 10000,
            resMsg: '获取成功',
            data: resData
        }
        res.json(result);
        res.end();
    })
    }
}