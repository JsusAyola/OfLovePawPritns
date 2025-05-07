const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const modelPath = path.resolve(__dirname, '../weka/6deabril.model'); // Ruta a tu modelo RandomForest

const MODEL_VALUES = {
  vaccines: ['Hepatitis Infecciosa Canina', 'Parvovirus', 'Moquillo', 'Rabia', 'Leptospirosis'],
  behavior: ['Agresivo', 'Timido', 'Territorial', 'Amigable', 'Sociable']
};

async function predictFromData(data) {
  try {
    const normalizedData = normalizeData(data);
    const arffContent = generateARFF(normalizedData);
    const arffPath = path.join(__dirname, 'temp_prediction.arff');

    try {
      fs.writeFileSync(arffPath, arffContent);
      const { stdout, stderr } = await executeWekaPrediction(arffPath);

      if (stderr) throw new Error(stderr);

      return parseWekaOutput(stdout);
    } catch (error) {
      console.error('Error detallado:', {
        error: error.message,
        normalizedData,
        arffContent
      });
      throw new Error(`Error en la predicción: ${error.message}`);
    } finally {
      if (fs.existsSync(arffPath)) fs.unlinkSync(arffPath);
    }
  } catch (error) {
    console.error('Error general:', error.message);
    throw error;
  }
}

function normalizeData(data) {
  return {
    type: ['Perro', 'Gato'].includes(data.type) ? data.type : 'Gato',
    breed: ['Bulldog', 'Siames', 'Persa', 'Husky', 'Labrador', 'Mestizo'].includes(data.breed) ? data.breed : 'Mestizo',
    sex: ['Hembra', 'Macho'].includes(data.sex) ? data.sex : 'Hembra',
    size: ['Pequeno', 'Mediano', 'Grande'].includes(data.size) ? data.size : 'Mediano',
    weight: ['Mas de 30kg', 'Menos de 5kg', '15-30kg', '5-15kg'].includes(data.weight) ? data.weight : '5-15kg',
    vaccines: normalizeVaccine(data.vaccines),
    sterilized: data.sterilized,
    activityLevel: normalizeActivityLevel(data.activityLevel),
    behaviorPeople: normalizeBehavior(data.behaviorPeople),
    behaviorAnimals: normalizeBehavior(data.behaviorAnimals),
    approvalStatus: ['aprobada', 'pendiente', 'rechazada'].includes(data.approvalStatus) ? data.approvalStatus : 'pendiente',
    status: ['fallecido', 'disponible', 'adoptado'].includes(data.status) ? data.status : 'disponible',
    medicalConditions: data.medicalConditions || 'Ninguna',
    allergies: ['Ninguna', 'Polen', 'Medicamentos', 'Polvo', 'Alimentos'].includes(data.allergies) ? data.allergies : 'Ninguna',
    ownershipConfirmation: data.ownershipConfirmation,
    adopted: 'No'
  };
}

function normalizeVaccine(vaccine) {
  const firstVaccine = vaccine.split(',')[0].trim();
  const vaccineMap = {
    'Rabia': 'Rabia',
    'Parvovirus': 'Parvovirus',
    'Moquillo': 'Moquillo',
    'Leptospirosis': 'Leptospirosis',
    'Hepatitis': 'Hepatitis Infecciosa Canina',
    'Hepatitis Infecciosa Canina': 'Hepatitis Infecciosa Canina'
  };
  return vaccineMap[firstVaccine] || 'Hepatitis Infecciosa Canina';
}

function normalizeActivityLevel(activityLevel) {
  const validLevels = ['Bajo', 'Alto', 'Medio'];
  return validLevels.includes(activityLevel) ? activityLevel : 'Bajo';
}

function normalizeBehavior(behavior) {
  return behavior
    .replace('í', 'i')
    .replace('Í', 'I')
    .replace('Tímido', 'Timido');
}

function generateARFF(data) {
  return `
@relation pets_sinteticas_balanceado

@attribute Tipo {Gato,Perro}
@attribute Raza {Labrador,Bulldog,Persa,Husky,Siames,Mestizo}
@attribute Sexo {Hembra,Macho}
@attribute Tamano {Mediano,Pequeno,Grande}
@attribute Peso {'Mas de 30kg',5-15kg,15-30kg,'Menos de 5kg'}
@attribute Vacunas {Rabia,Parvovirus,Leptospirosis,'Hepatitis Infecciosa Canina',Moquillo}
@attribute Esterilizado {Si,No}
@attribute Nivel_Actividad {Alto,Bajo,Medio}
@attribute Comportamiento_Personas {Timido,Agresivo,Amigable,Territorial}
@attribute Comportamiento_Animales {Territorial,Agresivo,Sociable,Timido}
@attribute Estado_Aprobacion {aprobada,pendiente,rechazada}
@attribute Estado {disponible,adoptado,fallecido}
@attribute Condiciones_Medicas {Ninguna,'Afecciones respiratorias','Lesiones previas','Enfermedades cronicas'}
@attribute Alergias {Ninguna,Medicamentos,Polen,Polvo,Alimentos}
@attribute Confirmacion_Propiedad {Si,No}
@attribute Adoptado {Si,No}

@data
${data.type},${data.breed},${data.sex},${data.size},'${data.weight}','${data.vaccines}',${data.sterilized ? 'Si' : 'No'},${data.activityLevel},${data.behaviorPeople},${data.behaviorAnimals},${data.approvalStatus},${data.status},'${data.medicalConditions}','${data.allergies}',${data.ownershipConfirmation ? 'Si' : 'No'},${data.adopted}
`.trim();
}

async function executeWekaPrediction(arffPath) {
  const wekaJarPath = path.join(__dirname, '..', 'weka', 'weka.jar');
  const command = [
    'java',
    '-Xmx1024m',
    '-Djava.awt.headless=true',
    '-cp',
    `"${wekaJarPath}"`,
    'weka.classifiers.trees.J48',
    '-l',
    `"${modelPath}"`,
    '-T',
    `"${arffPath}"`,
    '-p', '0'
  ].join(' ');

  return await execPromise(command);
}

function parseWekaOutput(output) {
  const resultLine = output.split('\n').find(line => line.trim().startsWith('1'));
  if (!resultLine) throw new Error('Formato de salida de Weka no reconocido');

  const parts = resultLine.trim().split(/\s+/);
  const predictedClass = parts[2]; // Ejemplo: '1:Si' o '2:No'
  const confidence = parseFloat(parts[parts.length - 1]) || 0;

  const willBeAdopted = predictedClass.includes('Si'); // 👈 Basado en la clase predicha

  return {
    success: true,
    prediction: {
      willBeAdopted: willBeAdopted,
      confidence: confidence,
      probability: confidence
    },
    message: `Predicción: ${willBeAdopted ? 'Adoptable' : 'No adoptable'} (${(confidence * 100).toFixed(1)}% de confianza)`,
    rawOutput: output
  };
}

module.exports = { predictFromData };