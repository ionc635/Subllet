"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Asking, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      models.User.hasMany(models.Reply, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      models.User.hasMany(models.Comment, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      models.User.hasMany(models.Scrap, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      models.User.hasMany(models.Subscribe, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      profile: DataTypes.STRING,
      total_scraps: DataTypes.INTEGER,
      total_subscribes: DataTypes.INTEGER,
      total_price: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
