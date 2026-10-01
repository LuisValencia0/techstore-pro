const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Producto', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            field: 'id'
        },
        icono:       { type: DataTypes.STRING, field: 'icono' },
        nombre:      { type: DataTypes.STRING, allowNull: false, field: 'nombre' },
        descripcion: { type: DataTypes.TEXT, field: 'descripcion' },
        precio:      { type: DataTypes.STRING, field: 'precio' },
        imagen:      { type: DataTypes.STRING, field: 'imagen' }
    }, {
        tableName: 'productos',
        timestamps: false
    });
};