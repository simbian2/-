function createtoken(){
    let header={
        "alg":"HS256",
        "typ":"JWT"
    }
    let encodeheader= Buffer.from(JSON.stringify(header))
                                    .toString('base64')
                                    .replace('==','')
    let payload = {
        "sub": "1234567890",
        "name": "John Doe",
        "user" : "dfassf",
        "info": "he's not Jain Doe, he's not a girl.",
        "iat": 1516239022
    }
    let encodepayload= Buffer.from(JSON.stringify(payload))
                                    .toString('base64')
                                    .replace('==','')
    const crypto = require('crypto');
    //1 어떤 암호화를 할거냐(sha256)
    //2 암호화 규칙 스트링으로 
    let signature = crypto.createHmac('sha256',Buffer.from('shinoo')) //16진수로 표현하는게 좋음
                                        .update(`${encodeheader}.${encodepayload}`) //header payload
                                        .digest('base64')
                                        .replace('=','')
    return `${encodeheader}.${encodepayload}.${signature}`
}

let token = createtoken();
console.log(token);
module.exports = createtoken();