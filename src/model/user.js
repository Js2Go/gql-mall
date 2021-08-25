const { Model, DataTypes } = require('sequelize')

const generateUser = async (db) => {
  class User extends Model {}
  
  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  }, {
    sequelize: db,
    freezeTableName: true
  })

  await User.sync()
  
  return User
}

module.exports = generateUser
