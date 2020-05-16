
const address="localhost";
const port=3030;
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost:27017');
var db = Mongoose.connection;
module.exports=new Promise((resolve,reject)=>{
      db.on('error', function(){
          reject()
      });
      db.once('open', function() {
          resolve("数据库连接成功")
      });
})