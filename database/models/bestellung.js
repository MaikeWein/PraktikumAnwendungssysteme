module.exports = function (sequelize, DataTypes) {

    var BESTELLUNG = sequelize.define('BESTELLUNG', {
        gesamtPreis: {
            type: DataTypes.FLOAT
        }
    }, {
        classMethods: {
            associate: function(models) {

                BESTELLUNG.belongsTo(models.USER,{as:'USER',foreignKey: {
                    name: 'userId',
                    allowNull: false
                }});


                BESTELLUNG.belongsTo(models.GEBAECK,{as:'GEBAECK',foreignKey: {
                    name: 'gebaeckId',
                    allowNull: false
                }});



                BESTELLUNG.belongsTo(models.GESCHMACK,{as:'GESCHMACK',foreignKey: {
                    name: 'geschmackId',
                    allowNull: false
                }});

                BESTELLUNG.belongsTo(models.FUELLUNG,{as:'FUELLUNG',foreignKey: {
                    name: 'fuellungId',
                    allowNull: false
                }});

                BESTELLUNG.belongsToMany(models.TOPPINGS, { as: 'Toppings', through: models.bestellungtoppings, foreignKey: 'bestellId' });

            }
        },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return BESTELLUNG;
}
