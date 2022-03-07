module.exports = (sequelize, DataTypes) =>{

    const tnUser = sequelize.define(
        'TN_USER',
        {
            userId: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                allowNull: false,
                field : "USER_ID"
            },
            userPassword: {
                type: DataTypes.STRING(128),
                allowNull: true,
                field : "PASSWORD"
            },
            userNm: {
                type: DataTypes.STRING(30),
                allowNull: true,
                field : "USER_NM"
            },
            userTelNo: {
                type: DataTypes.INTEGER(128),
                allowNull: true,
                field : "TELNO"
            },
            userEmail: {
                type: DataTypes.STRING(500),
                allowNull: true,
                field : "EMAIL"
            },
            useAt: {
                type: DataTypes.STRING(1),
                allowNull: true,
                field : "USE_AT"
            },
            registerId: {
                type: DataTypes.STRING(10),
                allowNull: true,
                field : "REGISTER_ID"
            },
            registDt: {
                type:DataTypes.DATE,
                field : "REGIST_DT"
            },
        },
        {
          freezeTableName: true,
          tableName: 'TN_USER',
          timestamps: false
        }
    );

    return tnUser;
};

        