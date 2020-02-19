var jwt = require('jsonwebtoken');  //用于生成token

module.exports = {
    parseToken:function(token) {
        var userId;
        jwt.verify(token,'jwt',(err,decoded) => {
          if(err) {
            console.log('解析token错误信息------------------------------------------------------------------')
            console.log(err);
            return err;
          }else {
            console.log('解析成功结果----------------------------------------------------------------------------');
            console.log(decoded);  //打印token解析成功的信息
            userId = decoded.userId;
            console.log('解析token结果中的userId--------------------------------------------------------------------')
            console.log(userId);
          }
        })
        return userId;
    }
}