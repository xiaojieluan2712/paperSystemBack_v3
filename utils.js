// 生成n个不重复随机数的方法

module.exports = {
    getRandom: function(num) { // num指的是生成的随机数数组的长度
      var array = [];
      for(let i=0;i<num;i++) { //生成0-10之间的随机整数
          var temp = Math.ceil(Math.random()*10);
          if(array.indexOf(temp) === -1) { //生成的随机数数组中不存在，可以放进数组
            array.push(temp);
          } else {
              i--;
          }
      }
      return array;
    }
}