const Teacher = require('../models/Teacher');
const { validateTeacherPayload } = require('../utils/validation');

exports.getAllTeachers = async (req, res) => {
  try {
    const { search } = req.query;
    let teachers;
    if (search) {
      teachers = await Teacher.search(search);
    } else {
      teachers = await Teacher.findAll();
    }
    res.json(teachers);
  } catch (error) {
    console.error('Error in getAllTeachers:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error in getTeacherById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { errors, sanitized } = validateTeacherPayload(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Corrige los campos del formulario.', fields: errors });
    }

    const newTeacher = await Teacher.create(sanitized);
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error('Error in createTeacher:', error);
    if (error.code && error.code.startsWith('SQLITE_CONSTRAINT')) { 
      return res.status(400).json({ error: 'El correo o cédula ya existe.' });
    }
    res.status(500).json({ error: 'Error al crear profesor' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { errors, sanitized } = validateTeacherPayload(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Corrige los campos del formulario.', fields: errors });
    }

    const updatedTeacher = await Teacher.update(req.params.id, sanitized);
    if (!updatedTeacher) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error in updateTeacher:', error);
    if (error.code === 'SQLITE_CONSTRAINT') { 
      return res.status(400).json({ error: 'El correo o cédula ya existe.' });
    }
    res.status(500).json({ error: 'Error al actualizar profesor' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.delete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json({ message: 'Profesor eliminado con éxito', deletedTeacher });
  } catch (error) {
    console.error('Error in deleteTeacher:', error);
    res.status(500).json({ error: 'Error al eliminar profesor' });
  }
};
