// /routes/solicitudes.js
const express = require('express');
const AdoptionRequest = require('../models/AdoptionRequest');
const AdoptionForm = require('../models/AdoptionForm');
const Pet = require('../models/Pet');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta para crear una nueva solicitud de adopción
router.post('/create', authMiddleware, async (req, res) => {
  console.log('Datos recibidos en /create:', req.body);
  
  const { mascota_id, adoptador_id, cuidador_id, reuseForm, ...formData } = req.body;

  if (!mascota_id || !cuidador_id || !adoptador_id) {
    return res.status(400).json({ error: 'Los campos mascota_id, cuidador_id y adoptador_id son obligatorios.' });
  }

  try {
    // 1. Verificar si ya existe una solicitud pendiente para esta mascota
    const existingSolicitud = await AdoptionRequest.findOne({
      mascota_id,
      adoptador_id,
      estado: 'pendiente',
    });

    if (existingSolicitud) {
      return res.status(400).json({
        error: 'Ya tienes una solicitud en proceso para esta mascota.',
      });
    }

    // 2. Buscar o actualizar el formulario de adopción
    let adoptionForm = await AdoptionForm.findOne({ adoptador_id });

    if (!adoptionForm) {
      // Crear nuevo formulario (primera vez)
      adoptionForm = new AdoptionForm({
        adoptador_id,
        ...formData,
        reuseForm: reuseForm || false,
        mascotas_adoptadas: [{
          mascota_id,
          cuidador_id,
          fecha_adopcion: new Date()
        }]
      });
    } else {
      // Verificar si ya solicitó esta mascota antes (aunque no esté pendiente)
      const mascotaYaSolicitada = adoptionForm.mascotas_adoptadas.some(
        m => m.mascota_id.toString() === mascota_id
      );

      if (mascotaYaSolicitada) {
        return res.status(400).json({
          error: 'Ya has solicitado esta mascota anteriormente.',
        });
      }

      // Actualizar formulario existente
      if (reuseForm) {
        // Solo actualizar los campos específicos de la nueva solicitud
        adoptionForm.mascotas_adoptadas.push({
          mascota_id,
          cuidador_id,
          fecha_adopcion: new Date()
        });
      } else {
        // Actualizar todos los campos (nueva info + mascota)
        adoptionForm = await AdoptionForm.findOneAndUpdate(
          { adoptador_id },
          {
            ...formData,
            reuseForm: false,
            $push: {
              mascotas_adoptadas: {
                mascota_id,
                cuidador_id,
                fecha_adopcion: new Date()
              }
            }
          },
          { new: true }
        );
      }
    }

    await adoptionForm.save();

    // 3. Crear la nueva solicitud de adopción
    const solicitud = new AdoptionRequest({
      mascota_id,
      adoptador_id,
      cuidador_id,
      formId: adoptionForm._id,
      estado: 'pendiente'
    });

    await solicitud.save();

    res.status(201).json({ 
      _id: solicitud._id, 
      reuseForm: adoptionForm.reuseForm,
      message: 'Solicitud creada con éxito.' 
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor al guardar la solicitud.' });
  }
});


// Ruta para verificar si el adoptador ya tiene un formulario de adopción
router.get('/check-adoption-form/:adoptadorId', authMiddleware, async (req, res) => {
  const { adoptadorId } = req.params;

  try {
    const formExists = await AdoptionForm.exists({ adoptador_id: adoptadorId });

    if (!formExists) {
      return res.status(404).json({ msg: 'Formulario no encontrado' });
    }

    res.json(true);
  } catch (error) {
    console.error("Error al verificar el formulario de adopción:", error);
    res.status(500).json({ error: "Error en el servidor al verificar el formulario." });
  }
});

router.get('/check-adoption/:adoptador_id/:mascota_id', authMiddleware, async (req, res) => {
  const { adoptador_id, mascota_id } = req.params;

  try {
    const solicitudExistente = await AdoptionRequest.findOne({
      adoptador_id,
      mascota_id,
      estado: 'pendiente',
    });

    if (solicitudExistente) {
      return res.json({ exists: true, message: 'Ya tienes una solicitud en proceso para esta mascota.' });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error('Error al verificar solicitud existente:', error);
    res.status(500).json({ error: 'Error en el servidor al verificar la solicitud.' });
  }
});


router.get('/last-form/:adoptador_id', authMiddleware, async (req, res) => {
  const { adoptador_id } = req.params;

  try {
    const lastForm = await AdoptionForm.findOne({ adoptador_id }).sort({ createdAt: -1 });

    if (!lastForm) {
      return res.json({ exists: false, message: 'No hay formulario previo.' });
    }

    res.json({ exists: true, form: lastForm });
  } catch (error) {
    console.error('Error al obtener el último formulario:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener el formulario.' });
  }
});


router.get('/cuidador', authMiddleware, async (req, res) => {
  const cuidador_id = req.user.id;

  try {
    const solicitudes = await AdoptionRequest.find({ cuidador_id })
      .populate('adoptador_id', 'firstName lastName email phone')
      .populate('mascota_id', 'name breed image');

    res.json(solicitudes.length ? solicitudes : { msg: 'No se encontraron solicitudes de adopción' });
  } catch (error) {
    console.error('Error al obtener las solicitudes del cuidador:', error);
    res.status(500).send('Error en el servidor');
  }
});

router.get('/tipo/:tipoMascota', authMiddleware, async (req, res) => {
  const { tipoMascota } = req.params;
  const cuidador_id = req.user.id;

  try {
    const solicitudes = await AdoptionRequest.find({ cuidador_id })
      .populate({
        path: 'mascota_id',
        match: { type: tipoMascota },  // Asegúrate de que el valor coincida (Gato o Perro)
        select: 'name breed image type'
      })
      .populate('adoptador_id', 'firstName lastName email phone');

    const filteredSolicitudes = solicitudes.filter(solicitud => solicitud.mascota_id);

    res.json(filteredSolicitudes.length ? filteredSolicitudes : { msg: 'No se encontraron solicitudes para el tipo especificado' });
  } catch (error) {
    console.error('Error al obtener solicitudes por tipo de mascota:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener las solicitudes' });
  }
});

// Ruta para obtener el formulario de adopción de un adoptador específico
router.get('/formulario/:adoptadorId', authMiddleware, async (req, res) => {
  const { adoptadorId } = req.params;

  try {
    const formulario = await AdoptionForm.findOne({ adoptador_id: adoptadorId })
      .populate('adoptador_id', 'firstName lastName'); // Asegúrate de incluir el campo correcto

    if (!formulario) {
      return res.status(404).json({ msg: 'Formulario no registrado' });
    }

    res.json(formulario);
  } catch (error) {
    console.error("Error al obtener el formulario de adopción:", error);
    res.status(500).json({ error: "Error en el servidor al obtener el formulario." });
  }
});

// Middleware de validación para aprobar/rechazar
const validateRequestAction = async (req, res, next) => {
  try {
    const solicitud = await AdoptionRequest.findById(req.params.id);
    
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    if (solicitud.cuidador_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para esta acción' });
    }
    
    if (solicitud.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La solicitud ya fue procesada' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error de validación' });
  }
};

// Aprobar solicitud
router.put('/aprobar/:id', authMiddleware, validateRequestAction, async (req, res) => {
  try {
    const solicitud = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { 
        estado: 'aprobada', 
        fecha_decision: new Date()  // Guardar la fecha actual de aprobación
      },
      { new: true }
    ).populate('adoptador_id', 'firstName lastName email')
     .populate('mascota_id', 'name breed');

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({ 
      success: true,
      solicitud: {
        _id: solicitud._id,
        estado: solicitud.estado,
        fecha_decision: solicitud.fecha_decision || new Date(), // Enviamos la fecha directamente como Date si está guardada
        mascota: solicitud.mascota_id,
        adoptador: solicitud.adoptador_id
      }
    });
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Rechazar solicitud
router.put('/rechazar/:id', authMiddleware, validateRequestAction, async (req, res) => {
  try {
    const { motivo } = req.body;
    
    if (!motivo || motivo.trim() === '') {
      return res.status(400).json({ error: 'Debe proporcionar un motivo' });
    }

    const solicitud = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { 
        estado: 'rechazada', 
        motivo_rechazo: motivo,
        fecha_decision: new Date() 
      },
      { new: true }
    ).populate('adoptador_id', 'firstName lastName email')
     .populate('mascota_id', 'name breed');
    
    res.json({ 
      success: true,
      solicitud: {
        _id: solicitud._id,
        estado: solicitud.estado,
        motivo_rechazo: solicitud.motivo_rechazo,
        fecha_decision: solicitud.fecha_decision,
        mascota: solicitud.mascota_id,
        adoptador: solicitud.adoptador_id
      }
    });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener el historial de solicitudes de un adoptador específico
router.get('/historial', authMiddleware, async (req, res) => {
  const adoptadorId = req.user.id; // Asegúrate de que authMiddleware asigna el ID del usuario autenticado correctamente

  try {
    const historial = await AdoptionRequest.find({ adoptador_id: adoptadorId }) // Filtra por adoptador_id
      .populate('adoptador_id', 'firstName lastName email')
      .populate('mascota_id', 'name breed image type') // Asegúrate de incluir el tipo de mascota
      .sort({ createdAt: -1 });

    if (!historial || historial.length === 0) {
      return res.status(200).json([]); // Si no hay solicitudes, devuelve un array vacío
    }

    res.status(200).json(historial);
  } catch (error) {
    console.error('Error al obtener el historial de solicitudes:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener el historial de solicitudes.' });
  }
});

// Ruta para obtener las mascotas adoptadas por un usuario específico
router.get('/adoptadas', authMiddleware, async (req, res) => {
  const adoptadorId = req.user.id; // Capturamos el ID del usuario autenticado

  try {
    const solicitudesAprobadas = await AdoptionRequest.find({
      adoptador_id: adoptadorId,
      estado: 'aprobada' // Solo devolvemos las solicitudes que han sido aprobadas
    })
    .populate('mascota_id', 'name breed image type') // Incluimos la información de la mascota
    .sort({ fecha_decision: -1 });

    if (!solicitudesAprobadas || solicitudesAprobadas.length === 0) {
      return res.status(200).json([]); // Si no hay solicitudes aprobadas, devolvemos un array vacío
    }

    res.status(200).json(solicitudesAprobadas);
  } catch (error) {
    console.error('Error al obtener las mascotas adoptadas:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener las mascotas adoptadas.' });
  }
});

module.exports = router;