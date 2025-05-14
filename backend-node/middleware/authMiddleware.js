const jwt = require('jsonwebtoken');

// Middleware de autenticación que permite la predicción sin token
function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Autenticación: Encabezado recibido:', authHeader);

  if (!authHeader) {
    // Si no hay encabezado de autenticación, dejamos pasar la solicitud
    req.user = null;  // Establecemos req.user como null
    return next();  // No bloqueamos la solicitud
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token recibido:', token);
    
    console.log('JWT_SECRET usado para verificar:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

if (!decoded.user || !decoded.user.id) {
  console.error('Error: ID no válido en el token.');
  return res.status(401).json({
    success: false,
    message: 'Token inválido: falta información de usuario.'
  });
}


    // Si el token es válido, asignamos el usuario al request
    req.user = decoded.user;
    next();  // Pasamos la solicitud al siguiente middleware o controlador

  } catch (err) {
    console.error('Error al verificar el token:', err);
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.'
    });
  }
}

module.exports = authMiddleware;
