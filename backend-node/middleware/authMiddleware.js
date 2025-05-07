const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Autenticación: Encabezado recibido:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. No hay token.' 
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token recibido:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    if (!decoded.user || !decoded.user.id) {
      console.error('Error: ID no válido en el token.');
      return res.status(400).json({ 
        success: false, 
        message: 'ID no válido en el token.' 
      });
    }

    req.user = decoded.user;
    next();

  } catch (err) {
    console.error('Error al verificar el token:', err);
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado.' 
    });
  }
}

module.exports = authMiddleware;
