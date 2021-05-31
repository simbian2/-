const express = require('express');
const cookieParser = require('cookie-parser'); //npm install cookie-parser
const bodyParser = require('body-parser'); // npm install body-parser
const app = express();
const nunjucks = require('nunjucks');
const ctoken = require('./jwt');
const cuserpw1 = require('./pw.js');
const auth = require('./middleware/auth');
const {sequelize,User} = require('./models/index')

app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false,}))
app.use(cookieParser());
app.use(express.static('public'));

sequelize.sync({force:false})
.then(()=>{ // resolve
    console.log('DB접속이 완료되었습니다.')
})
.catch((err)=>{ // reject
    console.log(err)
})


app.get('/',(req,res)=>{ // main페이지          
    res.render('index',{
        msg:req.query.msg,
    })
  
});

app.get('/user/info',auth,(req,res)=>{
    //res.clearCookie('AccessToken');
    res.send(`Hello ${req.userid}`);
})

app.get('/user/join',(req,res)=>{
    //res.clearCookie('AccessToken');
    res.render('join')
})

app.post('/user/join', async (req,res)=>{
    let userid = req.body.userid
    let userpw = req.body.userpw
    let cuserpw = cuserpw1(userpw);
    res.cookie('AccessToken',cuserpw,{httpOnly:true,secure:true,})

    await User.create({
        userid: userid,
        userpw: cuserpw,
    })

    try{
        let token = ctoken(userid,userpw);
        res.cookie('AccessToken',token,{httpOnly:true,secure:true,})
        
    }catch(err){
        res.json(err.data)
    }
    res.redirect('/')
})


app.get('/menu1',(req,res)=>{ //sub 페이지 
    res.send('menu1페이지입니다.');
})

//POST auth/local/login
app.post('/auth/local/login', async (req,res)=>{
    let bodyuserid = req.body.bodyuserid
    let bodyuserpw = req.body.bodyuserpw
    let {AccessToken} = req.cookies// 클라이언트의 cookie.accesstoken 
    let payload = AccessToken.split('.')[1];
    let {userid,exp,userpw} = JSON.parse(Buffer.from(payload,'base64').toString()) 
    console.log('AccessToken : ',bodyuserid, bodyuserpw); 
    console.log('AccessToken : ',userid, userpw); 

    let result = {};

    let flag = await User.findOne({ 
        where:{ userid:userid, userpw:userpw }
    }) 

    try{
        if(userid == bodyuserid && userpw == bodyuserpw){
            // 로그인 성공
            result = {
                result:true,
                msg:'로그인에 성공하셨습니다.'
            }
    
            res.clearCookie('AccessToken');
            let token = ctoken(userid,userpw);
            res.cookie('AccessToken',token,{httpOnly:true,secure:true,})
    
            //token 내용을 
        } else {
            // 로그인 실패
            result = {
                result:false,
                msg:'아이디와 패스워드를 확인해주세요.'
            }
        }
        res.json(result)
    }catch(err){
        res.json(err.data)
    }
})

app.listen(5000,()=>{
    console.log('server start port 3000!');
});