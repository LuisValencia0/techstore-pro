// Middleware: verifica que el usuario autenticado tenga rol admin
function verificarAdmin(req, res, next) {
    if (!req.usuario) {
        return res.status(401).json({ error: 'Sin autentificación' });
    }
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denengado - se requiere rol admin'});
    }
    next();   // solo llefa aqui si el token existe y el rol es admin
}

module.exports = verificarAdmin;
