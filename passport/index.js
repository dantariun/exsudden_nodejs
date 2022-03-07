const passport = require('passport');
const local = require('./localStrategy');

const { TnUser, TnUserAttrb, TnInstt } = require('../models')

var sequelize = require('sequelize-oracle');

module.exports = ()=>{
    passport.serializeUser( (user, done) =>{
        done(null, user.userId);
    });

    passport.deserializeUser( (id, done) =>{
        TnUser.findOne({ 
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
        })
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            done(err)
        
        });
    });

    local();
}