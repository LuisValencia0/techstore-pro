const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Transaccion', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true
        },
        wompiReference:     { type: DataTypes.STRING, allowNull: false },
        amountInCents:      { type: DataTypes.BIGINT, allowNull: false },
        currency:           { type: DataTypes.STRING(10), defaultValue: 'COP' },
        status:             { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'PENDING' },
        pendingOrderData:   { type: DataTypes.TEXT('long'), allowNull: true },
        orden_id: {
            type: DataTypes.STRING(24),
            allowNull: true,
            field: 'orden_id'         // ← único campo con field explícito
        },
        wompiTransactionId: { type: DataTypes.STRING, allowNull: true },
        v:                  { type: DataTypes.INTEGER, defaultValue: 0 }
    }, {
        tableName: 'transaccions',
        timestamps: true
    });
};