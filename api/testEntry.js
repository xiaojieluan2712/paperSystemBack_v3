var express = require('express');
var app = express();

var db = require('../database');
var { parseToken } = require('../parseToken');

module.exports = {
    //生成一个数组，数组的每一项都是一个promise，然后用primise.all()
    initial: function(req,res) {  // get方法 
      // 初始化页面
      var actions = [];  //用来放三个promise
      var token = req.headers.token;
      var userId = parseToken(token);
      var sqls = [
        'select * from subjects',
        'select * from questypes',
        'select typeName,labelColor,subAbbr,quesId,question from question,subjects,questypes where question.subjectId = subjects.subjectId && question.typeId = questypes.typeId && userId='+ userId
      ]
      var resData = {};
      var resDataKey = ['subjectsList','quesTypes','quesArray'];
      for(var i=0;i<3;i++) {
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
      },
    createQuesObj: function(req,res) {
        //新增一条试题记录
      var token = req.headers.token;
      var userId = parseToken(token);
      var quesObj = req.body;
      quesObj.userId = userId;
      var keys = '';
      var values = '';
      for(key in quesObj) {
         keys += key+",";
         if(typeof(quesObj[key]) === 'string') {
             values += "'" + quesObj[key] + "',";
         }else {
             values += quesObj[key]+ ",";
         }
      }
      keys = keys.slice(0,-1);
      values = values.slice(0,-1);
      // var sql = "insert into question (quesId,subjectId,typeId,question,result,date,keyWords,userId) 
      // values(1581998408248,1,10001,'在OSI参考模型中，物理层的作用是？\nA 建立和释放链接\nB 透明地传输比特流\nC 在物理实体之间传送数据帧\nD 发送和接受用户数据',
      // '','2020-02-18T04:00:08.248Z','',321001)"
      var sql = "insert into question (" + keys + ") values (" + values + ")";
      db.query(sql,[],function(data,fields) {
        // console.log(data);
        var result = {
            resCode: 1000,
            resMsg: '创建成功',
            data: data
        }
        res.json(result);
        res.end();
      })
    },

    getQuesDetails(req,res) {
        // 查看已录入题目详情
        var quesId = req.body.quesId;
        //console.log(quesId)
        var sql = 'select quesId,date,subjectName,typeName,question,result,quesKeyWords from question,subjects,questypes where question.subjectId=subjects.subjectId && question.typeId=questypes.typeId && quesId=' + quesId;
        db.query(sql,[],function(data,fields) {
            var result = {
                resCode: 1000,
                resMsg: '成功获取试题信息',
                data: data
            };
            res.json(result);
            res.end();
        })
    },

    editQues(req,res) {
        // 查看题目详情，保存修改
        var quesObj = req.body
        // console.log(quesObj);
        var sql = "update question set question='"+quesObj.question + "',result='" + quesObj.result+"',quesKeyWords='"+quesObj.quesKeyWords+"' where quesId = '"+quesObj.quesId+"'"; 
        db.query(sql,[],function(data,fields) {
            var result = {
                resCode:1000,
                resMsg:'修改成功'
            };
            res.json(result);
            res.end();
        })
    },

    deleteQues(req,res) {
        //查看题目详情，删除这个题目
        var quesId = req.body.quesId
        console.log(quesId)
        var sql = 'delete from question where quesId = '+ quesId;
        db.query(sql,[],function(data,fields) {
            var result = {
                resCode: 1000,
                resMsg: '删除成功'
            };
            res.json(result);
            res.end();
        })
    }
}