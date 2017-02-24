module.exports = function (sequelize, DataTypes) {

    var FUELLUNG = sequelize.define('FUELLUNG', {

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

                FUELLUNG.hasMany(models.BESTELLUNG,{as:'BESTELLUNGEN',
                    foreignKey: {
                        name: 'fuellungId',
                        allowNull: false
                    }});
            }
        },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return FUELLUNG;
}
