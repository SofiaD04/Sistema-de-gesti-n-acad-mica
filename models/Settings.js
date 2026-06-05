const { getDb } = require('../config/db');
const { cleanText } = require('../utils/validation');

class Settings {
  static getCatalogs() {
    const db = getDb();

    return {
      careers: db.prepare('SELECT id, name FROM careers ORDER BY name ASC').all(),
      semesters: db.prepare('SELECT id, value FROM semesters ORDER BY value ASC').all(),
      periods: db.prepare('SELECT id, name FROM periods ORDER BY name DESC').all(),
    };
  }

  static getCatalogNames() {
    const catalogs = this.getCatalogs();

    return {
      careers: catalogs.careers.map((career) => career.name),
      semesters: catalogs.semesters.map((semester) => semester.value),
      periods: catalogs.periods.map((period) => period.name),
    };
  }

  static createCareer(name) {
    const db = getDb();
    const safeName = cleanText(name);
    const info = db.prepare('INSERT INTO careers (name) VALUES (?)').run(safeName);

    return db.prepare('SELECT id, name FROM careers WHERE id = ?').get(info.lastInsertRowid);
  }

  static createSemester(value) {
    const db = getDb();
    const safeValue = Number(value);
    const info = db.prepare('INSERT INTO semesters (value) VALUES (?)').run(safeValue);

    return db.prepare('SELECT id, value FROM semesters WHERE id = ?').get(info.lastInsertRowid);
  }

  static createPeriod(name) {
    const db = getDb();
    const safeName = cleanText(name);
    const info = db.prepare('INSERT INTO periods (name) VALUES (?)').run(safeName);

    return db.prepare('SELECT id, name FROM periods WHERE id = ?').get(info.lastInsertRowid);
  }

  static deleteCareer(id) {
    const db = getDb();
    const career = db.prepare('SELECT id, name FROM careers WHERE id = ?').get(id);

    if (!career) {
      return null;
    }

    const usage = db.prepare('SELECT COUNT(*) as count FROM students WHERE carrera = ?').get(career.name);
    if (usage.count > 0) {
      const error = new Error('La carrera está siendo usada por estudiantes registrados.');
      error.code = 'CATALOG_IN_USE';
      throw error;
    }

    db.prepare('DELETE FROM careers WHERE id = ?').run(id);
    return career;
  }

  static deleteSemester(id) {
    const db = getDb();
    const semester = db.prepare('SELECT id, value FROM semesters WHERE id = ?').get(id);

    if (!semester) {
      return null;
    }

    const usage = db.prepare('SELECT COUNT(*) as count FROM students WHERE semestre = ?').get(semester.value);
    if (usage.count > 0) {
      const error = new Error('El semestre está siendo usado por estudiantes registrados.');
      error.code = 'CATALOG_IN_USE';
      throw error;
    }

    db.prepare('DELETE FROM semesters WHERE id = ?').run(id);
    return semester;
  }

  static deletePeriod(id) {
    const db = getDb();
    const period = db.prepare('SELECT id, name FROM periods WHERE id = ?').get(id);

    if (!period) {
      return null;
    }

    const usage = db.prepare('SELECT COUNT(*) as count FROM students WHERE periodo = ?').get(period.name);
    if (usage.count > 0) {
      const error = new Error('El período está siendo usado por estudiantes registrados.');
      error.code = 'CATALOG_IN_USE';
      throw error;
    }

    db.prepare('DELETE FROM periods WHERE id = ?').run(id);
    return period;
  }
}

module.exports = Settings;
