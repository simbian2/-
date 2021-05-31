require('dotenv').config();
const crypto = require('crypto'); 

function cuserpw(userpw){

    const ORiginuserpw = Buffer.from(JSON.stringify(userpw))
    .toString('base64')
    .replace('==','')
    .replace('=','')

    //userpw를 암호화
    const encodecuserpw = crypto.createHmac('sha256',Buffer.from(process.env.salt))
    .update(ORiginuserpw)
    .digest('base64')
    .replace('==','')
    .replace('=','')

    let Origincuserpw = `${encodecuserpw}`
    
    return Origincuserpw;
}

module.exports = cuserpw;