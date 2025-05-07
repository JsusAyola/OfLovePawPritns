const express = require('express');
const Pet = require('../models/Pet');
const User = require('../models/User');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const { predictFromData } = require('../helpers/wekaService'); // Cambié esto
const Prediction = require('../models/Prediction'); // 👈 modelo que debes crear

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/avif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo JPEG, JPG, PNG, WEBP y AVIF.'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limitar tamaño de archivo a 2MB
});

// Validación de datos mínimos necesarios para predecir
function validateInput(data) {
  const requiredFields = [
    'type', 'breed', 'sex', 'size', 'weight', 
    'vaccines', 'sterilized', 'activityLevel',
    'behaviorPeople', 'behaviorAnimals'
  ];
  
  const missingFields = requiredFields.filter(field => data[field] === undefined || data[field] === '');
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Faltan campos requeridos: ${missingFields.join(', ')}`
    };
  }

  return { isValid: true };
}

// Ruta para agregar una nueva mascota
router.post('/add', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 }, // Imagen principal
  { name: 'verificationImage', maxCount: 1 }, // Imagen de verificación
]), async (req, res) => {
  try {
    const { 
      name, birthDate, type, breed, sex, size, weight, 
      vaccines, isVaccinated, sterilized, activityLevel, 
      behaviorPeople, behaviorAnimals, approvalStatus, 
      medicalConditions, allergies, location, ownershipConfirmation
    } = req.body;

    // Obtener las rutas de las imágenes subidas
    const imagePath = req.files['image'] ? req.files['image'][0].path : null;
    const verificationImagePath = req.files['verificationImage'] ? req.files['verificationImage'][0].path : null;
    const cuidador_id = req.user.id;

    // Convertir vaccines a un array si viene como JSON string
    let vaccinesArray = [];
    if (vaccines) {
      try {
        vaccinesArray = JSON.parse(vaccines); // Intenta convertir a array
      } catch (error) {
        console.error('Error al parsear las vacunas:', error);
        return res.status(400).json({ message: 'Formato de vacunas no válido' });
      }
    }

    // Validar que las vacunas sean válidas
    const allowedVaccines = [
      // Vacunas para perros
      'Rabia',
      'Moquillo',
      'Parvovirus',
      'Hepatitis Infecciosa Canina',
      'Leptospirosis',
      'Parainfluenza',
      'Bordetella',
      'Coronavirus Canino',
      // Vacunas para gatos
      'Rabia',
      'Panleucopenia',
      'Rinotraqueítis Viral Felina',
      'Calicivirus Felino',
      'Leucemia Felina',
      'Clamidiosis Felina',
      'Peritonitis Infecciosa Felina',
      'Bordetella Felina'
    ];

    const invalidVaccines = vaccinesArray.filter(vaccine => !allowedVaccines.includes(vaccine));
    if (invalidVaccines.length > 0) {
      return res.status(400).json({ 
        message: 'Una o más vacunas no son válidas', 
        invalidVaccines 
      });
    }

    // Crear la nueva mascota
    const newPet = new Pet({
      name,
      birthDate,
      type,
      breed,
      sex,
      size,
      weight,
      vaccines: vaccinesArray,
      isVaccinated: isVaccinated === 'true', // Convertir string a booleano
      sterilized: sterilized === 'true', // Convertir string a booleano
      activityLevel,
      behaviorPeople,
      behaviorAnimals,
      approvalStatus: approvalStatus || 'pendiente', // Valor por defecto
      status: 'disponible', // Establecer status como "disponible" por defecto
      image: imagePath,
      verificationImage: verificationImagePath, // Imagen de verificación
      cuidador_id,
      medicalConditions,
      allergies,
      location,
      ownershipConfirmation: ownershipConfirmation === 'true'
    });

    // Guardar la mascota en la base de datos
    await newPet.save();
    res.status(201).json({ message: 'Mascota registrada con éxito', pet: newPet });

  } catch (error) {
    console.error('Error al registrar la mascota:', error);
    res.status(500).json({ message: 'Error al registrar la mascota', error });
  }
});

// Ruta para obtener mascotas pendientes (solo para admin)
router.get('/pendientes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const mascotasPendientes = await Pet.find({ approvalStatus: 'pendiente' });
    res.json(mascotasPendientes);
  } catch (error) {
    console.error('Error al obtener mascotas pendientes:', error);
    res.status(500).json({ msg: 'Error al obtener mascotas pendientes.' });
  }
});

// Ruta para aprobar una mascota
router.put('/aprobar/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    if (pet.approvalStatus === 'aprobada') {
      return res.status(400).json({ msg: 'La mascota ya está aprobada' });
    }

    pet.approvalStatus = 'aprobada';
    pet.status = 'disponible';  // Asegúrate de que este campo se actualice
    await pet.save();
    
    res.json({ msg: 'Mascota aprobada y disponible' });
  } catch (error) {
    console.error('Error al aprobar la mascota:', error);
    res.status(500).json({ msg: 'Error al aprobar la mascota' });
  }
});

// Ruta para rechazar una mascota
router.put('/rechazar/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    if (pet.approvalStatus === 'rechazada') {
      return res.status(400).json({ msg: 'La mascota ya está rechazada' });
    }

    pet.approvalStatus = 'rechazada';
    await pet.save();
    
    res.json({ msg: 'Mascota rechazada' });
  } catch (error) {
    console.error('Error al rechazar la mascota:', error);
    res.status(500).json({ msg: 'Error al rechazar la mascota' });
  }
});

// Ruta para obtener todas las mascotas de un cuidador específico
router.get('/cuidador', authMiddleware, async (req, res) => {
  try {
    const cuidador_id = req.user.id;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(cuidador_id)) {
      console.error('ID del cuidador no es válido:', cuidador_id);
      return res.status(400).json({ msg: 'ID no válido' });
    }

    const filter = { cuidador_id };
    if (status) {
      filter.status = status;
    }

    const mascotas = await Pet.find(filter);

    res.json(mascotas.length ? mascotas : []);
  } catch (error) {
    console.error('Error al obtener las mascotas del cuidador:', error);
    res.status(500).send({ msg: 'Error en el servidor.' });
  }
});

// Ruta para obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const pets = await Pet.find(filter); // Obtener todas las mascotas con filtro opcional
    res.json(pets);
  } catch (error) {
    console.error('Error al obtener las mascotas:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener una mascota por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID no válido' });
  }

  try {
    const pet = await Pet.findById(id).populate('cuidador_id');
    if (!pet) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }
    res.json(pet);
  } catch (error) {
    console.error('Error al obtener la mascota:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para actualizar una mascota (sin modificar su estado)
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { name, birthDate, breed, vaccines, type, sex, weight, size, status } = req.body;

  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { name, birthDate, breed, vaccines, type, sex, weight, size, status },
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    res.json(updatedPet);
  } catch (error) {
    console.error('Error al actualizar la mascota:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para eliminar una mascota
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    res.json({ msg: 'Mascota eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la mascota:', error);
    res.status(500).send('Error en el servidor');
  }
});


// Ruta para obtener todas las mascotas aprobadas y disponibles
router.get('/disponibles', async (_, res) => {
  try {
    const mascotas = await Pet.find({ 
      approvalStatus: 'aprobada', 
      status: 'disponible' 
    });
    res.json(mascotas);
  } catch (error) {
    console.error('Error al obtener mascotas disponibles:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para incrementar el contador de interesados
router.put('/:id/increment-interested', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Incrementar el contador de interesados
    pet.interestedCount += 1;
    await pet.save();

    res.status(200).json({ message: 'Contador de interesados incrementado' });
  } catch (error) {
    console.error('Error al incrementar el contador de interesados:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para obtener predicciones guardadas
router.get('/predicciones', authMiddleware, async (req, res) => {
  try {
    const preds = await Prediction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(preds);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener predicciones' });
  }
});

// Ruta para predecir con weka
router.post('/predic', async (req, res) => {
  try {
    const validation = validateInput(req.body); // Asegúrate de definir la validación de input en este archivo
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.message
      });
    }

    const predictionResult = await predictFromData(req.body);

    if (!predictionResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Error en la predicción',
        details: predictionResult.message,
        rawError: predictionResult.rawOutput
      });
    }

    // Guardar la predicción en la base de datos
    await Prediction.create({
      inputData: req.body,
      result: predictionResult.prediction,
      message: predictionResult.message,
      userId: req.user ? req.user.id : null
    });

    res.status(200).json({
      success: true,
      prediction: predictionResult.prediction,
      message: predictionResult.message
    });

  } catch (error) {
    console.error('Error completo:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

