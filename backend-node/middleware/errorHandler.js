const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'ID no válido' });
    }
  
    res.status(500).json({ msg: 'Error en el servidor' });
  };
  
  module.exports = errorHandler;