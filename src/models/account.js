const { UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Accounts",{  
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      unique: true,
    },
    accountNo: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  Account.associate = models => {
  Account.belongsTo(models.Users, {
      as: "accounts",
      foreignKey: "userId",
    });
  };
  return Account;
};
