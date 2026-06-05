const Student = require('../models/Student');
const Settings = require('../models/Settings');
const { validateStudentPayload } = require('../utils/validation');

exports.getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let students;
    if (search) {
      students = await Student.search(search);
    } else {
      students = await Student.findAll();
    }
    res.json(students);
  } catch (error) {
    console.error('Error in getAllStudents:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error in getStudentById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { errors, sanitized } = validateStudentPayload(req.body, Settings.getCatalogNames());

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Corrige los campos del formulario.', fields: errors });
    }

    const newStudent = await Student.create(sanitized);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error in createStudent:', error);
    if (error.code && error.code.startsWith('SQLITE_CONSTRAINT')) { 
      return res.status(400).json({ error: 'El correo o cédula ya existe.' });
    }
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { errors, sanitized } = validateStudentPayload(req.body, Settings.getCatalogNames());

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Corrige los campos del formulario.', fields: errors });
    }

    const updatedStudent = await Student.update(req.params.id, sanitized);
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error in updateStudent:', error);
    if (error.code === 'SQLITE_CONSTRAINT') { 
      return res.status(400).json({ error: 'El correo o cédula ya existe.' });
    }
    res.status(500).json({ error: 'Error al actualizar estudiante' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.delete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json({ message: 'Estudiante eliminado con éxito', deletedStudent });
  } catch (error) {
    console.error('Error in deleteStudent:', error);
    res.status(500).json({ error: 'Error al eliminar estudiante' });
  }
};
