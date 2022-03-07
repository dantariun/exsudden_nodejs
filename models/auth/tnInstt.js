/**
 * 기관(?!) 속성
 * @since 2021.12.17
 * @author bhc
 */
module.exports = (sequelize,DataTypes) => {
    const TnInstt  = sequelize.define('TN_INSTT',{
        // 기관 ID
        INSTT_ID : {
            type : DataTypes.STRING(10),
            primaryKey : true
        },
        // 약칭
        insttAbrv  : {
            type : DataTypes.STRING(30),
            field : "ABRV"
        },
        // 기관명
        insttNm : {
            type : DataTypes.STRING(100),
            field : "INSTT_NM"
        },
        // 전화번호
        insttTelno : {
            type : DataTypes.STRING(2),
            field : "TELNO"
        },
        // 기관 주소
        insttAddress : {
            type : DataTypes.STRING(2),
            field : "INSTT_ADRES"
        },
        // 팩스 번호
        faxNo : {
            type : DataTypes.STRING(10),
            field : "FAX_NO"
        },
        // 홈페이지주소
        homepageAddress : {
            type : DataTypes.INTEGER,
            field : "HMPG_ADRES"
        },
        // 기관유형코드
        insttTyCode : {
            type : DataTypes.INTEGER,
            field : "INSTT_TY_CODE"
        },
        // 상위기관ID
        upperInsttId : {
            type : DataTypes.STRING(2),
            field : "UPPER_INSTT_ID"
        },
        // 우편번호
        addressZip : {
            type : DataTypes.DATE,
            field : "ZIP"
        },
        // 도시명
        ctyNm : {
            type : DataTypes.STRING(15),
            field : "CTY_NM"
        },
        // 휴대전화번호
        mobilePhoneNo : {
            type : DataTypes.STRING(1),
            field : "MOBLPHON_NO"
        },
    },
    {
        freezeTableName : true,
        tableName : "TN_INSTT",
        timestamps : false
    });

    return TnInstt;
}
