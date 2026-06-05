const { getDb } = require('../config/db');

class Student {
  static async findAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM students ORDER BY id DESC').all();
  }

  static async findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  }

  static async create(studentData) {
    const db = getDb();
    const { cedula, nombres, apellidos, correo, telefono, carrera, semestre, periodo } = studentData;
    const stmt = db.prepare(`
      INSERT INTO students (cedula, nombres, apellidos, correo, telefono, carrera, semestre, periodo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(cedula, nombres, apellidos, correo, telefono, carrera, semestre, periodo);
    return this.findById(info.lastInsertRowid);
  }

  static async update(id, studentData) {
    const db = getDb();
    const { cedula, nombres, apellidos, correo, telefono, carrera, semestre, periodo } = studentData;
    const stmt = db.prepare(`
      UPDATE students 
      SET cedula = ?, nombres = ?, apellidos = ?, correo = ?, telefono = ?, carrera = ?, semestre = ?, periodo = ?
      WHERE id = ?
    `);
    stmt.run(cedula, nombres, apellidos, correo, telefono, carrera, semestre, periodo, id);
    return this.findById(id);
  }

  static async delete(id) {
    const db = getDb();
    const student = await this.findById(id);
    if (student) {
      db.prepare('DELETE FROM students WHERE id = ?').run(id);
    }
    return student;
  }

  static async search(term) {
    const db = getDb();
    const searchPattern = `%${term}%`;
    return db.prepare(`
      SELECT * FROM students 
      WHERE nombres LIKE ? OR apellidos LIKE ? OR cedula LIKE ? OR carrera LIKE ? OR periodo LIKE ?
      ORDER BY id DESC
    `).all(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }
}

module.exports = Student;
