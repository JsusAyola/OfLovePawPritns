const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'administrador') {
      return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
  };
  
  module.exports = adminMiddleware;
  