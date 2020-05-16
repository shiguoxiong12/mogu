const router=require('koa-router');
const Router=new router();
//const jwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const userModel=require('../db/modle/user');
const fs=require('fs');
const path=require('path');
const goodsModel=require('../db/modle/goods');
function loadData(file){  //读取本地文件
    return new Promise((resolve,reject)=>{
        fs.readFile(path.join(__dirname,file),'utf-8',function(error,data){
            if(error){
                reject(error);
            }else{
                resolve(data);
            }
        });
    })
}
//用户注册
Router.post('/registered',async(ctx,next)=>{
    const data = ctx.request.body;
    const result = await userModel.findOne({
		name: data.name,
    });
    console.log(result)
    if(result){
        return ctx.body = {
			code: '200',
            data: null,
            status:'false',
			msg: '用户已经注册'
		}
    }else{
        let user=await new userModel({
            name: data.name,
            password:data.password
        }).save();
        if(user){
            return ctx.body = {
                code: '200',
                data: null,
                msg: '注册成功'
            }
        }
        
    }
    next();
})
//用户登录
Router.post('/login',async (ctx)=>{
    const data = ctx.request.body;
	if(!data.name || !data.password){
		return ctx.body = {
			code: '000002',
			data: null,
			msg: '参数不合法'
		}
	}
	const result = await userModel.findOne({
		name: data.name,
		password: data.password
	})
	if(result !== null){
		const token = jwt.sign({     //生成token
			name: result.name,
			_id: result._id
		}, 'my_token', { expiresIn: '2h' });
		return ctx.body = {
			code: '000001',
			token: token,
			msg: '登录成功'
		}
	}else{
		return ctx.body = {
			code: '000002',
			data: null,
			msg: '用户名或密码错误'
		}
	}
})
module.exports=Router.routes();