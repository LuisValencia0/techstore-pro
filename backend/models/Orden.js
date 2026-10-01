const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Orden', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true
        },
        usuario_id: {
            type: DataTypes.STRING(24),
            allowNull: false,
            field: 'usuario_id'
        },
        total:              { type: DataTypes.BIGINT, allowNull: false },
        estado:             { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pendiente' },
        wompiTransactionId: { type: DataTypes.STRING, allowNull: true },
        wompiReference:     { type: DataTypes.STRING, allowNull: true },
        v:                  { type: DataTypes.INTEGER, defaultValue: 0 }
    }, {
        tableName: 'ordens',
        timestamps: true
    });
};