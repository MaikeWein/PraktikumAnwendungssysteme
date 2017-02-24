module.exports = function (sequelize, DataTypes) {

    var TOPPINGS = sequelize.define('TOPPINGS', {

        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        picurl: {
            type: DataTypes.STRING
        },
        preis: {
            type: DataTypes.FLOAT
        },
    }, {
        classMethods: {
            associate: function(models) {

                TOPPINGS.belongsToMany(models.BESTELLUNG, { as: 'BESTELLUNGEN', through: models.bestellungtoppings, foreignKey: 'toppingId' });

            }
        },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return TOPPINGS;
}
