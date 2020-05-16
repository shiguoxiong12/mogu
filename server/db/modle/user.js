var mongoose=require('mongoose');
var Schema=require('mongoose').Schema;
var userschema = new Schema({
    name:String,
    password:String
  })
module.exports=mongoose.model('userModel', userschema);