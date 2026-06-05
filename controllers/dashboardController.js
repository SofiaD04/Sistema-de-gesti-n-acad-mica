const { getDb } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    console.log("Dashboard Stats request received");
    const db = getDb();
    console.log("DB instance retrieved");

    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const totalTeachers = db.prepare('SELECT COUNT(*) as count FROM teachers').get().count;

    const todayStudents = db.prepare(`SELECT COUNT(*) as count FROM students WHERE date(fecha_registro) = date('now', 'localtime')`).get().count;
    const todayTeachers = db.prepare(`SELECT COUNT(*) as count FROM teachers WHERE date(fecha_ingreso) = date('now', 'localtime')`).get().count;
    const createdToday = todayStudents + todayTeachers;

    const totalRecords = totalStudents + totalTeachers;

    const studentsByCareer = db.prepare('SELECT carrera as name, COUNT(*) as value FROM students GROUP BY carrera').all();
    const teachersBySpecialty = db.prepare('SELECT especialidad as name, COUNT(*) as value FROM teachers GROUP BY especialidad').all();

    res.json({
      metrics: {
        totalStudents,
        totalTeachers,
        createdToday,
        totalRecords
      },
      charts: {
        studentsByCareer,
        teachersBySpecialty
      }
    });

  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener estadísticas' });
  }
};
