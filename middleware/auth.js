require('dotenv').config();
const crypto = require('crypto');

module.exports = (req,res,next) => {
    let {AccessToken} = req.cookies// 클라이언트의 cookie.accesstoken 
    if(AccessToken == undefined){
        res.redirect('/?msg=로그인을 진행해주세요.');
        return 0;
    }

    let [header,payload,sign] = AccessToken.split('.');
    let signature = getSignature(header,payload);
    console.log(signature)

    if (sign == signature) {
        console.log('검증된 토큰입니다.');
        let {userid,exp} = JSON.parse(Buffer.from(payload,'base64').toString()) 
        console.log(userid)
        console.log(exp) // 토큰을 생성한 시간으로부터 2시간뒤 시간을 저장한 변수
        let nexp = new Date().getTime();
        if(nexp > exp){
            //기간이 만료되었을때 처리영역
            //res.json({result:false,msg:'토큰만료'});
            res.clearCookie('AccessToken');
            res.redirect('/?msg=토큰만료');
        }

        //모든 검증이 완료됨.
        req.userid = userid;
        next();
    } else {
        res.redirect('/?msg=부적절한토큰');
    }
}


function getSignature(header,payload){
    const signature = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                            .update(header+"."+payload)
                            .digest('base64')
                            .replace('==','')
                            .replace('=','')
    
    return signature;
}