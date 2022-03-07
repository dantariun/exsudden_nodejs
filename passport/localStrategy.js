const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const crypto = require('crypto')

const { TnUser, TnUserAttrb, TnInstt } = require('../models')
var sequelize = require('sequelize-oracle');

module.exports = () => {
    passport.use(new LocalStrategy({
      usernameField: 'userId',
      passwordField: 'password',
    }, async (id, password, done) => {
      try {
           
            const exUser = await TnUser.findOne( { 
                include : [{
                        model : TnUserAttrb,
                        attributes :[],
                        required: true,
                        include : [{
                                model : TnInstt,
                                attributes :[],
                                required: true,
                            }
                        ],
                    }
                ],
                attributes: ['userId', 'userPassword', 'userNm', 'userTelNo', 'userEmail', 'useAt', 'registerId', 'registDt',
                            [sequelize.literal(`"TN_USER_ATTRB"."INSTT_ID"`), 'insttId'],
                            [sequelize.literal(`"TN_USER_ATTRB.TN_INSTT"."INSTT_NM"`), 'insttNm'],

                ],
                where : { USER_ID: id }
            });

            if( exUser ) {
                // 비밀번호 인증 
                const cryptoPassword = crypto.createHash('sha256').update(id+password).digest('base64');
                const result = (exUser.userPassword === cryptoPassword)
                
                if( result ) {
                    done(null, exUser);
                } else {
                    done(null, false, { message : '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done( null, false, {message : '가입되지 않은 회원입니다.' });
            }
        } catch (error){
            done(error);
        }
    }));
};