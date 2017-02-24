module.exports = function (sequelize, DataTypes) {

    var GEBAECK = sequelize.define('GEBAECK', {

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

                GEBAECK.hasMany(models.BESTELLUNG,{as:'BESTELLUNGEN',
                    foreignKey: {
                        name: 'gebaeckId',
                        allowNull: false
                    }});

            }
        },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return GEBAECK;
}
