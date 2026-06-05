const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,60}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CEDULA_REGEX = /^(V|E)-\d{6,11}$/;
const PHONE_REGEX = /^0\d{3}-\d{7}$/;

function cleanText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function normalizeCedula({ nationality, number }) {
  const safeNationality = String(nationality ?? '').trim().toUpperCase();
  const safeNumber = String(number ?? '').replace(/\D/g, '');

  return `${safeNationality}-${safeNumber}`;
}

function parseCedula(cedula) {
  const safeCedula = cleanText(cedula).toUpperCase();
  const match = safeCedula.match(/^(V|E)-?(\d{6,11})$/);

  if (!match) {
    return null;
  }

  return {
    nationality: match[1],
    number: match[2],
    value: `${match[1]}-${match[2]}`,
  };
}

function normalizePhone({ code, number }) {
  const safeCode = String(code ?? '').replace(/\D/g, '').slice(0, 4);
  const safeNumber = String(number ?? '').replace(/\D/g, '').slice(0, 7);

  return `${safeCode}-${safeNumber}`;
}

function parsePhone(phone) {
  const safePhone = cleanText(phone);
  const match = safePhone.match(/^(0\d{3})-?(\d{7})$/);

  if (!match) {
    return null;
  }

  return {
    code: match[1],
    number: match[2],
    value: `${match[1]}-${match[2]}`,
  };
}

function validateCommonPersonFields(payload) {
  const errors = {};
  const nombres = cleanText(payload.nombres);
  const apellidos = cleanText(payload.apellidos);
  const correo = cleanText(payload.correo).toLowerCase();
  const cedula = payload.cedula;
  const telefono = payload.telefono;

  if (!CEDULA_REGEX.test(cedula)) {
    errors.cedula = 'La cédula debe usar V o E y contener entre 6 y 11 dígitos.';
  }

  if (!NAME_REGEX.test(nombres)) {
    errors.nombres = 'Los nombres deben tener entre 2 y 60 caracteres y solo letras válidas.';
  }

  if (!NAME_REGEX.test(apellidos)) {
    errors.apellidos = 'Los apellidos deben tener entre 2 y 60 caracteres y solo letras válidas.';
  }

  if (!EMAIL_REGEX.test(correo)) {
    errors.correo = 'Debes ingresar un correo electrónico válido.';
  }

  if (!PHONE_REGEX.test(telefono)) {
    errors.telefono = 'El teléfono debe tener un código de 4 dígitos y un número de 7 dígitos.';
  }

  return {
    errors,
    sanitized: {
      cedula,
      nombres,
      apellidos,
      correo,
      telefono,
    },
  };
}

function validateStudentPayload(payload, catalogs) {
  const { errors, sanitized } = validateCommonPersonFields(payload);
  const carrera = cleanText(payload.carrera);
  const periodo = cleanText(payload.periodo);
  const semestre = Number(payload.semestre);

  if (!carrera) {
    errors.carrera = 'Debes seleccionar una carrera.';
  } else if (!catalogs.careers.includes(carrera)) {
    errors.carrera = 'La carrera seleccionada no está disponible en configuración.';
  }

  if (!Number.isInteger(semestre)) {
    errors.semestre = 'Debes seleccionar un semestre válido.';
  } else if (!catalogs.semesters.includes(semestre)) {
    errors.semestre = 'El semestre seleccionado no está disponible en configuración.';
  }

  if (!periodo) {
    errors.periodo = 'Debes seleccionar un período.';
  } else if (!catalogs.periods.includes(periodo)) {
    errors.periodo = 'El período seleccionado no está disponible en configuración.';
  }

  return {
    errors,
    sanitized: {
      ...sanitized,
      carrera,
      semestre,
      periodo,
    },
  };
}

function validateTeacherPayload(payload) {
  const { errors, sanitized } = validateCommonPersonFields(payload);
  const especialidad = cleanText(payload.especialidad);

  if (!NAME_REGEX.test(especialidad)) {
    errors.especialidad = 'La especialidad debe tener entre 2 y 60 caracteres y solo letras válidas.';
  }

  return {
    errors,
    sanitized: {
      ...sanitized,
      especialidad,
    },
  };
}

module.exports = {
  cleanText,
  normalizeCedula,
  normalizePhone,
  parseCedula,
  parsePhone,
  validateStudentPayload,
  validateTeacherPayload,
};
