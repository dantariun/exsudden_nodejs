/**
 * 사용자 속성
 * @since 2021.12.17
 * @author bhc
 */
module.exports = (sequelize,DataTypes) => {
    const TnUserAttrb  = sequelize.define('TN_USER_ATTRB',{
        
        // 기관 ID
        INSTT_ID : {
            type : DataTypes.STRING(10),
            primaryKey : true,
        },
        
        // 사용자 ID
        USER_ID : {
            type : DataTypes.STRING(10),
            primaryKey : true,
            allowNull: false,
        },
        
        
        // 부서명
        deptNm  : {
            type : DataTypes.STRING(30),
            field : "DEPT_NM"
        },
        // 직급명
        clsfNm : {
            type : DataTypes.STRING(30),
            field : "CLSF_NM"
        },
        // 시도코드
        ctprvnCOde : {
            type : DataTypes.STRING(2),
            field : "CTPRVN_CODE"
        },
        // 시군구코드
        signguCode : {
            type : DataTypes.STRING(2),
            field : "SIGNGU_CODE"
        },
        // 로그인 실패수
        loginFailrCo : {
            type : DataTypes.INTEGER,
            field : "LOGIN_FAILR_CO"
        },
        // 로그인 수
        LOGIN_CO : {
            type : DataTypes.INTEGER,
            field : "LOGIN_CO"
        },
        // 로그인 잠금 여부
        loginLockAt : {
            type : DataTypes.STRING(2),
            field : "LOGIN_LOCK_AT"
        },
        // 로그인 종료 일시
        loginEndDt : {
            type : DataTypes.DATE,
            field : "LOGIN_END_DT"
        },
        // 로그인종료IP주소
        loginEndIpAdres : {
            type : DataTypes.STRING(15),
            field : "LOGIN_END_IP_ADRES"
        },
        // 다중 로그인 사용 여부
        multiLoginUseAt : {
            type : DataTypes.STRING(1),
            field : "MULTI_LOGIN_USE_AT"
        },
        // 유효시작일자
        validBeginDe : {
            type : DataTypes.STRING(8),
            field : "VALID_BEGIN_DE"
        },
        // 유효종료일지
        validEndDe : {
            type : DataTypes.STRING(8),
            field : "VALID_END_DE"
        },
        // 등록자 ID
        registerID : {
            type : DataTypes.STRING(10),
            field : "REGISTER_ID"
        },
        // 이벤트 메모내용
        registDt : {
            type : DataTypes.DATE,
            field : "REGIST_DT"
        },
        // 알람방지 분
        tnshAppUseAt : {
            type : DataTypes.STRING(1),
            field : "TNSH_APP_USE_AT"
        },
    },
    {
        freezeTableName : true,
        tableName : "TN_USER_ATTRB",
        timestamps : false
    });

    return TnUserAttrb;
}
