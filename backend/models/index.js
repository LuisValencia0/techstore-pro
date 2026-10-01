const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'techstore',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        dialect: 'mysql',
        dialectOptions: {
            socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
        },
        logging: false,
        define: {
            timestamps: true
            // ← sin "underscored: true"
        }
    }
);

const Usuario = require('./usuario')(sequelize);
const Producto = require('./producto')(sequelize);
const Orden = require('./orden')(sequelize);
const Transaccion = require('./transaccion')(sequelize);

// ---- RELACIONES (con field: explícito para FKs) ----

Usuario.hasMany(Orden, { foreignKey: 'usuario_id', as: 'ordens' });
Orden.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

const OrdenProducto = sequelize.define('orden_producto', {
    orden_id: {
        type: Sequelize.STRING(24),
        primaryKey: true,
        field: 'orden_id'
    },
    producto_id: {
        type: Sequelize.STRING(24),
        primaryKey: true,
        field: 'producto_id'
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'cantidad'
    }
}, {
    tableName: 'orden_productos',
    timestamps: false
});

Orden.belongsToMany(Producto, {
    through: OrdenProducto,
    foreignKey: 'orden_id',
    otherKey: 'producto_id',
    as: 'productos'
});
Producto.belongsToMany(Orden, {
    through: OrdenProducto,
    foreignKey: 'producto_id',
    otherKey: 'orden_id'
});

Orden.hasOne(Transaccion, { foreignKey: 'orden_id', as: 'transaccion' });
Transaccion.belongsTo(Orden, { foreignKey: 'orden_id', as: 'orden' });

module.exports = {
    sequelize,
    Usuario,
    Producto,
    Orden,
    Transaccion,
    OrdenProducto
};