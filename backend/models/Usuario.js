const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Usuario', {
        id:           { type: DataTypes.STRING(24), primaryKey: true },
        nombre:       { type: DataTypes.STRING, allowNull: false },
        email:        { type: DataTypes.STRING, allowNull: false, unique: true },
        departamento: { type: DataTypes.STRING, allowNull: false },
        municipio:    { type: DataTypes.STRING, allowNull: false },
        password:     { type: DataTypes.STRING, allowNull: false },
        rol:          { type: DataTypes.STRING(50), defaultValue: 'cliente' },
        v:            { type: DataTypes.INTEGER, defaultValue: 0 }
    }, {
        tableName: 'usuarios',
        timestamps: false
    });
};