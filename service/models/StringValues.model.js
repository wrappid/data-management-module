module.exports = (sequelize, DataTypes) => {
  const stringValues = sequelize.define("StringValues", {
    _status: {
      allowNull   : false,
      defaultValue: "new",
      type        : DataTypes.STRING
    },
    deletedAt: {
      allowNull: true,
      type     : "TIMESTAMP"
    },
    id: {
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER
    },
    key: {
      allowNull: false,
      type     : DataTypes.STRING
    },
    value: {
      allowNull   : false,
      defaultValue: "",
      type        : DataTypes.STRING
    }
  });

  stringValues.associate = (models) => {
    stringValues.belongsTo(models.SupportedLanguages, {
      foreignKey: "locale",
      sourceKey : "locale"
    });
    stringValues.belongsTo(models.Users, {
      as        : "Owner",
      foreignKey: "createdBy",
      sourceKey : "id"
    });
    stringValues.belongsTo(models.Users, {
      as        : "Updater",
      foreignKey: "updatedBy",
      sourceKey : "id"
    });
    stringValues.belongsTo(models.Users, {
      as        : "Destroyer",
      foreignKey: "deletedBy",
      sourceKey : "id"
    });
  };

  return stringValues;
};
