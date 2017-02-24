module.exports = function (sequelize, DataTypes) {

    var bestellungtoppings = sequelize.define('bestellungtoppings', {


    }, {

        freezeTableName: true // Model tableName will be the same as the model name
    });


    return bestellungtoppings;
}
