
/*{{ sso agentInfo */
const AUTH_URL = '192.168.21.171'
const AUTHORIZATION_URL= `http://${AUTH_URL}/`
const agentId = "1"
const requestData = "id,pwdLastSet"

const agentinfo = {
    AUTH_URL:AUTH_URL,
    AUTHORIZATION_URL:AUTHORIZATION_URL,
    agentId:agentId,
    requestData: requestData
}

/* sso agentInfo }}*/
const http = require('http')
const axios = require('axios')
const { json } = require('body-parser')
const ssoCheckAuth = async (req, res, next)=>{

  var resultCode = req.body.resultCode || '' 
  const secureToken = req.body.secureToken || ''
  const secureSessionId = req.body.secureSessionId || ''
  const clientIp = (req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress)
                    .slice(7,22)

  var resultMessage = "";
  var returnUrl = "";
  var responseData = "";
  var resultData = "";
  var sendData = "";
  var saveTokenUrl = AUTHORIZATION_URL + "token/saveToken.html";
  var errorPage = "error";
  var agentProcPage = "agentProc";
  var useCSMode = false;
  req.session.secureSessionId = secureSessionId;


  var isErrorPage=false;
  req.session.isErrorPage = isErrorPage;


  if (resultCode == "" || secureToken == "" || secureSessionId == "") {
    isErrorPage=true;
    req.session.isErrorPage = isErrorPage;
    returnUrl = errorPage;
    // error_log("error!!!");
    // header("Location:error.php");

  
  } else {
    if(['000000'].includes(resultCode)) {
      var TOKEN_AUTHORIZATION_URL =    + "token/authorization";
      resultCode = "";
      try {
        const headers = {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*'
          }
        let param = {
            secureToken: encodeURI(secureToken),
            secureSessionId: secureSessionId,
            requestData: requestData,
            agentId:agentId,
            clientIP:clientIp
        }
        const res = await axios.post(TOKEN_AUTHORIZATION_URL,param, {headers})
        
        resultCode = res.resultCode
        resultMessage = res.resultMessage
        returnUrl = res.returnUrl
        useCSMode = res.useCSMode
        if (resultCode === '000000') {
            const keys = requestData.split(",")
            for (i = 0; i< keys.length; i++) {
                
            }
        }

      }
      catch(error) {
        next(error)
      }

    }


  }


  req.session.save();
  // res.send(req.session)
}
const ssoLogout = (req, res, next) => {
    req.logout()
    req.session.destroy()
    res.render("logout", agentinfo)
}
module.exports = {
    ssoCheckAuth,
    ssoLogout
}