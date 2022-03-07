const path = require('path');
// const Sequelize = require('sequelize');
const Sequelize = require('sequelize-oracle');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'db' ,'config.json'))[
  env
];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// model

/****** 돌발상황매니저 생성한 테이블 *********/
db.TnIaMngrNight = require("./outbrk/tnIaMngrNight")(sequelize,Sequelize); // 설정 - 야간시간 테이블 모델 설정
db.TnIaMngrEvent = require("./outbrk/tnIaMngrEvent")(sequelize,Sequelize); // 설정 - 이벤트 테이블 모델 설정
db.ThIaMngrScan = require("./outbrk/thIaMngrScan")(sequelize,Sequelize); // 영상분석 매니저 검지 테이블 모델 설정
db.ThIaMngrAlarSetup = require("./outbrk/thIaMngrAlarSetup")(sequelize,Sequelize); // 영상분석 매니저 알람 테이블 모델 설정
db.ThIaMngrChange = require("./outbrk/thIaMngrChange")(sequelize,Sequelize); // 영상분석 매니저 변경 이력 테이블 모델 설정
db.ThIaCctvScanSttus = require("./outbrk/thIaCctvScanSttus")(sequelize,Sequelize); // CCTV 상태 

// auth
db.TnUser = require('./auth/tnUser')(sequelize, Sequelize);
db.TnInstt = require('./auth/tnInstt')(sequelize, Sequelize);
db.TnUserAttrb = require('./auth/tnUserAttrb')(sequelize, Sequelize);



// Associate 
Object.keys(db).forEach(modelName =>{
    // associate 설정한 모델만 적용 
    if(db[modelName].associate) 
    {        
        db[modelName].associate(db);
    }
});

// Associate - auth
db.TnUser.hasOne(db.TnUserAttrb, {foreignKey: 'USER_ID',targetKey: 'USER_ID'});
db.TnUserAttrb.hasOne(db.TnInstt, {foreignKey: 'INSTT_ID',targetKey: 'INSTT_ID'});

module.exports = db;
