const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Obtener el encabezado Authorization de la solicitud
  const authHeader = req.header('Authorization');
  console.log('Autenticación: Encabezado recibido:', authHeader);

  // Si no se recibe el encabezado Authorization, respondemos con un error 401
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. No se ha proporcionado un token.',
    });
  }

  try {
    // Extraer el token del encabezado Authorization, eliminando el "Bearer " al inicio
    const token = authHeader.replace('Bearer ', '');
    console.log('Token recibido:', token);

    // Verificar el token usando la clave secreta definida en el entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    // Verificar que el token contiene el userId (o el campo correspondiente)
    if (!decoded.user || !decoded.user.id) {
      console.error('Error: ID no válido en el token.');
      return res.status(400).json({
        success: false,
        message: 'ID no válido en el token.',
      });
    }

    // Asignar el userId extraído del token a req.user
    req.user = decoded.user;  // Esto puede incluir más información que el token haya guardado
    next();  // Llamamos al siguiente middleware o controlador

  } catch (err) {
    console.error('Error al verificar el token:', err);
    // Si el token no es válido o ha expirado, respondemos con un error 401
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
}

module.exports = authMiddleware;
