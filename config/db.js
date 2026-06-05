const Database = require('better-sqlite3');
const path = require('path');

let dbInstance = null;

function ensureColumn(db, tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function ensureDefaultSemesters(db) {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM semesters').get();

  if (count === 0) {
    const insertSemester = db.prepare('INSERT INTO semesters (value) VALUES (?)');
    const transaction = db.transaction(() => {
      for (let semester = 1; semester <= 12; semester += 1) {
        insertSemester.run(semester);
      }
    });

    transaction();
  }
}

function getDb() {
  if (!dbInstance) {
    try {
      dbInstance = new Database(path.join(__dirname, '../database.sqlite'));
      
      // Crear tablas
      dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cedula TEXT UNIQUE,
          nombres TEXT,
          apellidos TEXT,
          correo TEXT UNIQUE,
          telefono TEXT,
          carrera TEXT,
          semestre INTEGER,
          periodo TEXT,
          fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS teachers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cedula TEXT UNIQUE,
          nombres TEXT,
          apellidos TEXT,
          correo TEXT UNIQUE,
          telefono TEXT,
          especialidad TEXT,
          fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS careers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        );
        CREATE TABLE IF NOT EXISTS semesters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value INTEGER UNIQUE NOT NULL
        );
        CREATE TABLE IF NOT EXISTS periods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        );
      `);

      ensureColumn(dbInstance, 'students', 'periodo', 'TEXT');
      ensureDefaultSemesters(dbInstance);
    } catch (err) {
      console.error("Error inicializando better-sqlite3:", err);
      throw err;
    }
  }
  return dbInstance;
}

module.exports = { getDb };
