const Settings = require('../models/Settings');
const { cleanText } = require('../utils/validation');

function handleConstraintError(res, error, defaultMessage) {
  if (error.code === 'CATALOG_IN_USE') {
    return res.status(400).json({ error: error.message });
  }

  if (error.code && error.code.startsWith('SQLITE_CONSTRAINT')) {
    return res.status(400).json({ error: defaultMessage });
  }

  return null;
}

exports.getCatalogs = (req, res) => {
  try {
    res.json(Settings.getCatalogs());
  } catch (error) {
    console.error('Error in getCatalogs:', error);
    res.status(500).json({ error: 'Error al obtener la configuración.' });
  }
};

exports.createCareer = (req, res) => {
  try {
    const name = cleanText(req.body.name);

    if (name.length < 3) {
      return res.status(400).json({ error: 'La carrera debe tener al menos 3 caracteres.' });
    }

    const career = Settings.createCareer(name);
    res.status(201).json(career);
  } catch (error) {
    console.error('Error in createCareer:', error);
    if (!handleConstraintError(res, error, 'La carrera ya existe.')) {
      res.status(500).json({ error: 'Error al registrar la carrera.' });
    }
  }
};

exports.createSemester = (req, res) => {
  try {
    const value = Number(req.body.value);

    if (!Number.isInteger(value) || value < 1 || value > 12) {
      return res.status(400).json({ error: 'El semestre debe estar entre 1 y 12.' });
    }

    const semester = Settings.createSemester(value);
    res.status(201).json(semester);
  } catch (error) {
    console.error('Error in createSemester:', error);
    if (!handleConstraintError(res, error, 'El semestre ya existe.')) {
      res.status(500).json({ error: 'Error al registrar el semestre.' });
    }
  }
};

exports.createPeriod = (req, res) => {
  try {
    const name = cleanText(req.body.name);

    if (name.length < 3) {
      return res.status(400).json({ error: 'El período debe tener al menos 3 caracteres.' });
    }

    const period = Settings.createPeriod(name);
    res.status(201).json(period);
  } catch (error) {
    console.error('Error in createPeriod:', error);
    if (!handleConstraintError(res, error, 'El período ya existe.')) {
      res.status(500).json({ error: 'Error al registrar el período.' });
    }
  }
};

exports.deleteCareer = (req, res) => {
  try {
    const deleted = Settings.deleteCareer(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Carrera no encontrada.' });
    }

    res.json({ message: 'Carrera eliminada correctamente.', deleted });
  } catch (error) {
    console.error('Error in deleteCareer:', error);
    if (!handleConstraintError(res, error, 'No se pudo eliminar la carrera.')) {
      res.status(500).json({ error: 'Error al eliminar la carrera.' });
    }
  }
};

exports.deleteSemester = (req, res) => {
  try {
    const deleted = Settings.deleteSemester(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Semestre no encontrado.' });
    }

    res.json({ message: 'Semestre eliminado correctamente.', deleted });
  } catch (error) {
    console.error('Error in deleteSemester:', error);
    if (!handleConstraintError(res, error, 'No se pudo eliminar el semestre.')) {
      res.status(500).json({ error: 'Error al eliminar el semestre.' });
    }
  }
};

exports.deletePeriod = (req, res) => {
  try {
    const deleted = Settings.deletePeriod(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Período no encontrado.' });
    }

    res.json({ message: 'Período eliminado correctamente.', deleted });
  } catch (error) {
    console.error('Error in deletePeriod:', error);
    if (!handleConstraintError(res, error, 'No se pudo eliminar el período.')) {
      res.status(500).json({ error: 'Error al eliminar el período.' });
    }
  }
};
