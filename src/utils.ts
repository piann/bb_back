import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateToken = id => jwt.sign({id}, process.env.JWT_SECRET);

export const generateClientStyleHash= (text:string):string => {
  const salt = "0w";
  const hashedPassword:string= crypto.createHmac('sha256',salt).update(text).digest('hex');
  return hashedPassword;
}

export const generateSaltedHash = (pw:string):string => {
    if (process.env.I_AM_SALT===undefined){
        throw Error("Enviroment error")
    }
    const hashedPassword:string= crypto.createHmac('sha3-512',process.env.I_AM_SALT).update(pw).digest('hex');
    return hashedPassword

}

export const compareSaltedHash = (pw:string,savedPasswordHash:string):boolean => {
    if (process.env.I_AM_SALT===undefined){
        throw Error("Enviroment error")
    }
    const hashedPassword:string= crypto.createHmac('sha3-512',process.env.I_AM_SALT).update(pw).digest('hex');
    if(hashedPassword===savedPasswordHash){
        return true;
    }else{
        return false;
    }
}


interface sendEmailArgs{
    fromInfo:string;
    toEmail:string;
    title:string;
    content:string;
}

export const sendEmail = async ({
    fromInfo,
    toEmail,
    title,
    content,
}:sendEmailArgs):Promise<boolean> => {

    try{

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.USER_ACCOUNT_ADDRESS,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
                expires: 3600
            }
        });
        
        await transporter.sendMail({
            // 보내는 곳의 이름과, 메일 주소를 입력
            from: fromInfo,
            // 받는 곳의 메일 주소를 입력
            to:toEmail,
            // 보내는 메일의 제목을 입력
            subject: title,
            // 보내는 메일의 내용을 입력
            // text: 일반 text로 작성된 내용
            // html: html로 작성된 내용
            html: content,
        });

        return true;
    } catch(err){
        console.log(err);
        return false;
    }

} 

interface authSecretArgs{
    email:string;
    nickName:string;
    secret:string;
}

export const sendAuthSecretMail = async ({
    email,
    nickName,
    secret:authSecret
}:authSecretArgs):Promise<boolean> => {


    const result = await sendEmail({
        fromInfo:"zerowhale team <no-reply>",
        toEmail:email,
        title:"Confirm your zerowhale account",
        content:makeAuthEmail({email, nickName, authSecret}),
    });
    return result;      
}


export const sendPasswordResetSecretMail = async ({
  email,
  nickName,
  secret:passwordResetSecret
}:authSecretArgs):Promise<boolean> => {


  const result = await sendEmail({
      fromInfo:"zerowhale team <no-reply>",
      toEmail:email,
      title:"Reset your zerowhale password",
      content:makePasswordResetEmail({email, nickName, passwordResetSecret}),
  });
  return result;      
}


export const checkOnlyNormalChars = (target:string):boolean => {
    const reg = /^[a-zA-Z0-9_]+$/;
    const result = reg.test(target);
    return result;
}


export const checkOnlyLowerNormalChars = (target:string):boolean => {
    const reg = /^[a-z0-9_]+$/;
    const result = reg.test(target);
    return result;
}

export const checkEmailChars = (target:string):boolean => {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = reg.test(target);
    return result;
}

export const checkComplexPassword = (target:string):boolean => {
    const reg = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[A-z])(?=(.*)).{8,}/
    const result = reg.test(target);
    return result;
}


export const makeAuthEmail = ({
    email,
    nickName,
    authSecret
})=>{

    const linkAddress = `https://zerowhale.io/confirm_secret/${authSecret}/`;
    const authEmailContent = `
    <table
    width="100%"
    border="0"
    cellspacing="0"
    cellpadding="0"
    style="width: 100% !important;"
  >
    <tbody>
      <tr>
        <td align="center">
          <table
            style="border: 1px solid #eaeaea; border-radius: 5px; margin: 40px 0;"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="40"
          >
            <tbody>
              <tr>
                <td align="center">
                  <div
                    style="
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      text-align: left;
                      width: 465px;
                    "
                  >
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      style="width: 100% !important;"
                    >
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                            </div>
                            <h1
                              style="
                                color: #000;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                                  'Cantarell', 'Fira Sans', 'Droid Sans',
                                  'Helvetica Neue', sans-serif;
                                font-size: 24px;
                                font-weight: normal;
                                margin: 30px 0;
                                margin-top: 15px;
                                padding: 0;
                              "
                            >
                              Verify account for
                              <b><span>zerowhale</span></b>
                            </h1>
                          </td>
                        </tr>
                      </tbody>
                    </table>
  
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                          'Droid Sans', 'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      Welcome <b>${nickName}</b>
                    </p>
  
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                          'Droid Sans', 'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      To complete the verfication, please click the button
                      below:
                    </p>
                    <br />
  
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      style="width: 100% !important;"
                    >
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                              <a
                                href="${linkAddress}"
                                style="
                                  background-color: #102A3A;
                                  border-radius: 5px;
                                  color: #fff;
                                  display: inline-block;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                                    'Cantarell', 'Fira Sans', 'Droid Sans',
                                    'Helvetica Neue', sans-serif;
                                  font-size: 12px;
                                  font-weight: 500;
                                  line-height: 50px;
                                  text-align: center;
                                  text-decoration: none;
                                  width: 200px;
                                "
                                target="_blank"
                                >Verify</a
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
  
                    <br />
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                          'Droid Sans', 'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      Or copy and paste this URL into a new tab of your browser:
                    </p>
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                          'Droid Sans', 'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      <a
                        href="${linkAddress}"
                        style="color: #067df7; text-decoration: none;"
                        target="_blank"
                      >
                        ${linkAddress}
                      </a>
                    </p>
                    <br />
                    <hr
                      style="
                        border: none;
                        border-top: 1px solid #eaeaea;
                        margin: 26px 0;
                        width: 100%;
                      "
                    />
                    <p
                      style="
                        color: #666666;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                          'Droid Sans', 'Helvetica Neue', sans-serif;
                        font-size: 12px;
                        line-height: 24px;
                      "
                    >
                     It’s an honor to be together
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
`

      return authEmailContent;
}


export const makePasswordResetEmail = ({
  email,
  nickName,
  passwordResetSecret
})=>{

  const linkAddress = `https://zerowhale.io/reset_password/${passwordResetSecret}/`;
  const authEmailContent = `
  <table
  width="100%"
  border="0"
  cellspacing="0"
  cellpadding="0"
  style="width: 100% !important;"
>
  <tbody>
    <tr>
      <td align="center">
        <table
          style="border: 1px solid #eaeaea; border-radius: 5px; margin: 40px 0;"
          width="600"
          border="0"
          cellspacing="0"
          cellpadding="40"
        >
          <tbody>
            <tr>
              <td align="center">
                <div
                  style="
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                      'Droid Sans', 'Helvetica Neue', sans-serif;
                    text-align: left;
                    width: 465px;
                  "
                >
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    style="width: 100% !important;"
                  >
                    <tbody>
                      <tr>
                        <td align="center">
                          <div>
                          </div>
                          <h1
                            style="
                              color: #000;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                                'Cantarell', 'Fira Sans', 'Droid Sans',
                                'Helvetica Neue', sans-serif;
                              font-size: 24px;
                              font-weight: normal;
                              margin: 30px 0;
                              margin-top: 15px;
                              padding: 0;
                            "
                          >
                            Reset password for
                            <b><span>zerowhale</span></b>
                          </h1>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p
                    style="
                      color: #000;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      font-size: 14px;
                      line-height: 24px;
                    "
                  >
                    Hello <b>${nickName}</b>
                  </p>

                  <p
                    style="
                      color: #000;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      font-size: 14px;
                      line-height: 24px;
                    "
                  >
                    To reset your password, please click the button
                    below:
                  </p>
                  <br />

                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    style="width: 100% !important;"
                  >
                    <tbody>
                      <tr>
                        <td align="center">
                          <div>
                            <a
                              href="${linkAddress}"
                              style="
                                background-color: #102A3A;
                                border-radius: 5px;
                                color: #fff;
                                display: inline-block;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                                  'Cantarell', 'Fira Sans', 'Droid Sans',
                                  'Helvetica Neue', sans-serif;
                                font-size: 12px;
                                font-weight: 500;
                                line-height: 50px;
                                text-align: center;
                                text-decoration: none;
                              "
                              width="200px"
                              height="80px"
                              target="_blank"
                              >Go</a
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <br />
                  <p
                    style="
                      color: #000;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      font-size: 14px;
                      line-height: 24px;
                    "
                  >
                    Or copy and paste this URL into a new tab of your browser:
                  </p>
                  <p
                    style="
                      color: #000;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      font-size: 14px;
                      line-height: 24px;
                    "
                  >
                    <a
                      href="${linkAddress}"
                      style="color: #067df7; text-decoration: none;"
                      target="_blank"
                    >
                      ${linkAddress}
                    </a>
                  </p>
                  <br />
                  <hr
                    style="
                      border: none;
                      border-top: 1px solid #eaeaea;
                      margin: 26px 0;
                      width: 100%;
                    "
                  />
                  <p
                    style="
                      color: #666666;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                        'Droid Sans', 'Helvetica Neue', sans-serif;
                      font-size: 12px;
                      line-height: 24px;
                    "
                  >
                   It’s an honor to meet you again
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
`

    return authEmailContent;
}