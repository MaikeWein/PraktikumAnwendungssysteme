module.exports = function (sequelize, DataTypes) {

    var GESCHMACK = sequelize.define('GESCHMACK', {

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

                GESCHMACK.hasMany(models.BESTELLUNG,{as:'BESTELLUNGEN',
                    foreignKey: {
                        name: 'geschmackId',
                        allowNull: false
                    }});

            }
        },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return GESCHMACK;
}
