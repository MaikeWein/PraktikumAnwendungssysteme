module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define('USER', {

        salutation: {
            type: DataTypes.BOOLEAN
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        street: {
            type: DataTypes.STRING
        },
        plz: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models) {


            }
        },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return User;
}
