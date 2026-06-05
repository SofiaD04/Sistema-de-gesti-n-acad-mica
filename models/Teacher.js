const { getDb } = require('../config/db');

class Teacher {
  static async findAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM teachers ORDER BY id DESC').all();
  }

  static async findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
  }

  static async create(teacherData) {
    const db = getDb();
    const { cedula, nombres, apellidos, correo, telefono, especialidad } = teacherData;
    const stmt = db.prepare(`
      INSERT INTO teachers (cedula, nombres, apellidos, correo, telefono, especialidad)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(cedula, nombres, apellidos, correo, telefono, especialidad);
    return this.findById(info.lastInsertRowid);
  }

  static async update(id, teacherData) {
    const db = getDb();
    const { cedula, nombres, apellidos, correo, telefono, especialidad } = teacherData;
    const stmt = db.prepare(`
      UPDATE teachers 
      SET cedula = ?, nombres = ?, apellidos = ?, correo = ?, telefono = ?, especialidad = ?
      WHERE id = ?
    `);
    stmt.run(cedula, nombres, apellidos, correo, telefono, especialidad, id);
    return this.findById(id);
  }

  static async delete(id) {
    const db = getDb();
    const teacher = await this.findById(id);
    if (teacher) {
      db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
    }
    return teacher;
  }

  static async search(term) {
    const db = getDb();
    const searchPattern = `%${term}%`;
    return db.prepare(`
      SELECT * FROM teachers 
      WHERE nombres LIKE ? OR apellidos LIKE ? OR cedula LIKE ? OR especialidad LIKE ?
      ORDER BY id DESC
    `).all(searchPattern, searchPattern, searchPattern, searchPattern);
  }
}

module.exports = Teacher;
