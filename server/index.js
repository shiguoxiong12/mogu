const Koa = require('koa');
const app = new Koa();
const router=require('koa-router');
const koaBody=require('koa-body');
const users=require('./router/users');
const koajwt=require('koa-jwt');
const staticFiles = require('koa-static');
const Router=new router();
const db=require('./db/index');
const path=require('path');
app.use(koaBody({    //koaBody解析post 上传  文件上传
    multipart:true, // 支持文件上传
   // encoding:'gzip', //启用这个会报错,koa-body unsupported media type
    enableTypes: ['json', 'form', 'text'],
    formidable:{
      uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
      onFileBegin:(name,file) => { // 文件上传前的设置
        
      },
    }
}));
app.use(koajwt({     //服务端验证token
	  secret: 'my_token'
}).unless({
	 path: [/\/user\/login/,/\/user\/registered/]
}));
app.use(staticFiles(__dirname+'public'));//设置静态目录
app.use(async (ctx,next) => {
    await next();
});
db.then(function(data){
  Router.use('/user',users);
  console.log(data)
}).catch(function(error){
})
app.use(Router.routes()).use(Router.allowedMethods())
app.listen(3001);