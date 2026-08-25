const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1); // Required for Render/Heroku reverse proxies
const port = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');
const defaultState = {
  users: [],
  students: [],
  attendance: []
};
let db = loadDatabase();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'attendance-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 8 }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

function normalizeStudent(student) {
  const nameValue = String(student.name || '').trim();
  const regNoValue = String(student.reg_no || student.regNo || '').trim();
  if (/^[0-9]+$/.test(nameValue) && /[A-Za-z]/.test(regNoValue)) {
    return {
      ...student,
      name: regNoValue,
      reg_no: nameValue
    };
  }
  return {
    ...student,
    name: nameValue,
    reg_no: regNoValue,
    parent_contact: String(student.parent_contact || student.parentContact || '').trim(),
    department: String(student.department || '').trim()
  };
}

function isHeaderStudent(student) {
  const nameValue = String(student.name || '').trim().toLowerCase();
  const regNoValue = String(student.reg_no || student.regNo || '').trim().toLowerCase();
  const headerSerialPatterns = ['s.no', 's.no.', 's no', 'serial no', 'serial', 'sr no', 'srno'];
  const headerNamePatterns = ['student name', 'name', 'student', 'name of the student'];
  const looksLikeNameHeader = headerNamePatterns.some((pattern) => nameValue === pattern);
  const looksLikeRegHeader = headerSerialPatterns.some((pattern) => regNoValue === pattern);
  const looksLikeSwappedHeader = headerSerialPatterns.some((pattern) => nameValue === pattern) && headerNamePatterns.some((pattern) => regNoValue === pattern);
  return (looksLikeNameHeader && looksLikeRegHeader) || looksLikeSwappedHeader;
}

function loadDatabase() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultState, null, 2));
    return JSON.parse(JSON.stringify(defaultState));
  }
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    const students = Array.isArray(parsed.students) ? parsed.students : [];
    let needsSave = false;
    const normalizedStudents = students
      .filter((student) => {
        const isHeader = isHeaderStudent(student);
        if (isHeader) {
          needsSave = true;
        }
        return !isHeader;
      })
      .map((student) => {
        const normalized = normalizeStudent(student);
        if (JSON.stringify(normalized) !== JSON.stringify(student)) {
          needsSave = true;
        }
        return normalized;
      });
    const database = {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      students: normalizedStudents,
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : []
    };
    if (needsSave) {
      fs.writeFileSync(dataFile, JSON.stringify(database, null, 2));
    }
    return database;
  } catch (error) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultState, null, 2));
    return JSON.parse(JSON.stringify(defaultState));
  }
}

function saveDatabase() {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

function ensureAdminUser() {
  const existing = db.users.find((user) => user.username === 'admin');
  const passwordHash = bcrypt.hashSync('123456', 10);
  if (existing) {
    if (existing.role !== 'admin' || !bcrypt.compareSync('123456', existing.password_hash || '')) {
      existing.role = 'admin';
      existing.password_hash = passwordHash;
      saveDatabase();
    }
    return;
  }
  db.users.push({ id: Date.now(), username: 'admin', password_hash: passwordHash, role: 'admin' });
  saveDatabase();
}

function initDatabase() {
  ensureAdminUser();
}

function getMonthDetails(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const label = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' });
  const dates = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(year, month - 1, day);
    dates.push({
      day,
      label: current.toISOString().slice(0, 10),
      short: current.toLocaleDateString('en-US', { day: '2-digit' })
    });
  }
  return { year, month, daysInMonth, label, dates };
}

function getMonthKey(month) {
  const [year, mon] = month.split('-').map(Number);
  return { year, month: mon };
}

function compareRegNo(a, b) {
  const parseValue = (value) => {
    const raw = String(value || '').trim();
    const number = Number(raw.replace(/[^0-9]/g, ''));
    return Number.isNaN(number) ? null : number;
  };
  const aNumber = parseValue(a.reg_no || a.regNo);
  const bNumber = parseValue(b.reg_no || b.regNo);
  if (aNumber !== null && bNumber !== null) {
    return aNumber - bNumber;
  }
  return String(a.reg_no || a.regNo || '').localeCompare(String(b.reg_no || b.regNo || ''), undefined, { numeric: true, sensitivity: 'base' });
}

function getAttendanceDataForMonth(month) {
  const { year, month: monthNumber } = getMonthKey(month);
  const monthInfo = getMonthDetails(year, monthNumber);

  const students = db.students.slice().sort(compareRegNo);
  const rows = db.attendance.filter((entry) => {
    const dateValue = entry.date;
    return dateValue.startsWith(`${year}-${String(monthNumber).padStart(2, '0')}`);
  });

  const byStudent = new Map();
  students.forEach((student) => {
    byStudent.set(student.id, {
      ...student,
      entries: [],
      totalPresent: 0,
      totalAbsent: 0,
      totalDays: monthInfo.daysInMonth
    });
  });

  rows.forEach((row) => {
    const studentState = byStudent.get(row.student_id);
    if (!studentState) return;
    studentState.entries.push({ date: row.date, status: row.status });
    if (row.status === 'present') studentState.totalPresent += 1;
    else studentState.totalAbsent += 1;
  });

  const records = Array.from(byStudent.values()).map((student) => {
    const entries = monthInfo.dates.map((dateInfo) => {
      const found = student.entries.find((entry) => entry.date === dateInfo.label);
      const status = found ? found.status : 'absent';
      return { date: dateInfo.label, status };
    });
    const totalDays = monthInfo.daysInMonth;
    const totalPresent = entries.filter((entry) => entry.status === 'present').length;
    const totalAbsent = totalDays - totalPresent;
    const attendancePercent = totalDays === 0 ? 0 : Math.round((totalPresent / totalDays) * 100);
    return {
      id: student.id,
      name: student.name,
      reg_no: student.reg_no,
      parent_contact: student.parent_contact,
      department: student.department || 'EEE',
      entries,
      totalDays,
      totalPresent,
      totalAbsent,
      attendancePercent
    };
  });

  return { month: monthInfo, records };
}

function computeSummary(records) {
  const totalStudents = records.length;
  let totalPresent = 0;
  let totalAbsent = 0;
  records.forEach((student) => {
    totalPresent += student.totalPresent;
    totalAbsent += student.totalAbsent;
  });
  const presentPercent = totalStudents === 0 ? 0 : Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);
  const absentPercent = totalStudents === 0 ? 0 : 100 - presentPercent;
  return { totalStudents, totalPresent, totalAbsent, presentPercent, absentPercent };
}

// Open middleware (No login required)
function ensureAuthenticated(req, res, next) {
  return next();
}

app.post('/api/auth/login', (req, res) => {
  return res.json({ user: { id: 1, username: 'admin', role: 'admin' } });
});

app.post('/api/auth/logout', (req, res) => {
  return res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: { id: 1, username: 'Admin', role: 'admin' } });
});

app.get('/api/students', ensureAuthenticated, (req, res) => {
  const students = db.students.slice().sort(compareRegNo);
  res.json({ students });
});

app.post('/api/students', ensureAuthenticated, (req, res) => {
  const { name, regNo, parentContact, department } = req.body;
  if (!name || !regNo) {
    return res.status(400).json({ error: 'Name and register number are required' });
  }
  const duplicate = db.students.find((student) => student.reg_no === regNo);
  if (duplicate) {
    return res.status(400).json({ error: 'Register number must be unique' });
  }
  const student = {
    id: Date.now(),
    name,
    reg_no: regNo,
    parent_contact: parentContact || '',
    department: department || ''
  };
  db.students.push(student);
  saveDatabase();
  return res.status(201).json({ student });
});

app.put('/api/students/:id', ensureAuthenticated, (req, res) => {
  const studentId = Number(req.params.id);
  const { name, regNo, parentContact, department } = req.body;
  if (!name || !regNo) {
    return res.status(400).json({ error: 'Name and register number are required' });
  }
  const index = db.students.findIndex((student) => student.id === studentId);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const duplicate = db.students.find((student) => student.reg_no === regNo && student.id !== studentId);
  if (duplicate) {
    return res.status(400).json({ error: 'Register number must be unique' });
  }
  db.students[index].name = name;
  db.students[index].reg_no = regNo;
  db.students[index].parent_contact = parentContact || '';
  db.students[index].department = department || '';
  saveDatabase();
  return res.json({ student: db.students[index] });
});

app.delete('/api/students/:id', ensureAuthenticated, (req, res) => {
  const index = db.students.findIndex((student) => student.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  db.students.splice(index, 1);
  db.attendance = db.attendance.filter((entry) => entry.student_id !== Number(req.params.id));
  saveDatabase();
  return res.json({ success: true });
});

app.get('/api/attendance', ensureAuthenticated, (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const data = getAttendanceDataForMonth(month);
  return res.json(data);
});

app.post('/api/attendance/save', ensureAuthenticated, (req, res) => {
  const { month, records } = req.body;
  if (!month || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  records.forEach((row) => {
    const existing = db.attendance.findIndex((entry) => entry.student_id === row.studentId && entry.date === row.date);
    if (existing !== -1) {
      db.attendance[existing].status = row.status;
    } else {
      db.attendance.push({ student_id: row.studentId, date: row.date, status: row.status });
    }
  });
  saveDatabase();
  const payload = getAttendanceDataForMonth(month);
  return res.json(payload);
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/import', ensureAuthenticated, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });

  const normalizeValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value.toString();
    const text = String(value).trim();
    const sciMatch = text.match(/^[+-]?(\d+\.?\d*)(e[+-]?\d+)$/i);
    if (sciMatch) {
      const parsed = Number(text);
      if (!Number.isNaN(parsed)) {
        return parsed.toLocaleString('fullwide', { useGrouping: false });
      }
    }
    return text;
  };

  const headerTokens = Array.isArray(rows[0])
    ? rows[0].map((header) => String(header || '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .match(/[a-z0-9]+/g) || [])
    : [];
  const matchTokens = (tokens, candidate) => candidate.every((token) => tokens.includes(token));
  const findColumnIndex = (candidates) => headerTokens.findIndex((tokens) => candidates.some((candidate) => matchTokens(tokens, candidate)));
  const nameIndex = findColumnIndex([
    ['student', 'name'],
    ['name', 'of', 'the', 'student'],
    ['full', 'name'],
    ['name']
  ]);
  const regNoIndex = findColumnIndex([
    ['register', 'no'],
    ['register', 'number'],
    ['reg', 'no'],
    ['admission', 'no'],
    ['admission', 'number'],
    ['registration', 'number']
  ]);
  const parentContactIndex = findColumnIndex([
    ['parent', 'contact'],
    ['parent', 'phone'],
    ['mobile'],
    ['phone'],
    ['contact']
  ]);
  const departmentIndex = findColumnIndex([
    ['department'],
    ['dept'],
    ['section'],
    ['branch']
  ]);

  const inserted = [];
  let processedRows = 0;

  rows.slice(1).forEach((row) => {
    if (!Array.isArray(row) || row.every((cell) => String(cell || '').trim() === '')) {
      return;
    }

    const name = normalizeValue(nameIndex !== -1 ? row[nameIndex] : '');
    const regNo = normalizeValue(regNoIndex !== -1 ? row[regNoIndex] : '');
    const parentContact = normalizeValue(parentContactIndex !== -1 ? row[parentContactIndex] : '');
    const department = normalizeValue(departmentIndex !== -1 ? row[departmentIndex] : '');

    if (!name || !regNo) return;
    processedRows += 1;

    const student = {
      id: Date.now() + Math.random(),
      name,
      reg_no: regNo,
      parent_contact: parentContact,
      department: department || ''
    };

    const duplicate = db.students.find((existing) => existing.reg_no === regNo);
    if (duplicate) return;

    db.students.push(student);
    inserted.push(student);
  });

  saveDatabase();
  return res.json({ success: true, inserted, importedRows: processedRows });
});

app.get('/api/reports', ensureAuthenticated, (req, res) => {
  const month = req.query.month || null;
  const mode = req.query.mode || 'monthly';
  if (mode === 'overall') {
    const allRecords = db.students.slice().sort((a, b) => a.name.localeCompare(b.name)).map((student) => {
      const rows = db.attendance.filter((entry) => entry.student_id === student.id);
      const totalPresent = rows.filter((row) => row.status === 'present').length;
      const totalAbsent = rows.filter((row) => row.status === 'absent').length;
      const totalDays = totalPresent + totalAbsent;
      const attendancePercent = totalDays === 0 ? 0 : Math.round((totalPresent / totalDays) * 100);
      return {
        id: student.id,
        name: student.name,
        reg_no: student.reg_no,
        parent_contact: student.parent_contact,
        totalPresent,
        totalAbsent,
        totalDays,
        attendancePercent
      };
    });
    const summary = computeSummary(allRecords);
    return res.json({ mode: 'overall', records: allRecords, summary });
  }

  const data = getAttendanceDataForMonth(month || new Date().toISOString().slice(0, 7));
  const summary = computeSummary(data.records);
  return res.json({ mode: 'monthly', month: data.month, records: data.records, summary });
});

app.get('/api/shortage', ensureAuthenticated, (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const data = getAttendanceDataForMonth(month);
  const shortage = data.records.filter((student) => student.attendancePercent < 75);
  return res.json({ month: data.month, records: shortage });
});

function makePdf(res, title, lines) {
  const doc = new PDFDocument({ size: 'A4', margin: 36 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
  doc.pipe(res);
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  lines.forEach((line) => doc.fontSize(12).text(line));
  doc.end();
}

app.get('/api/export/attendance-pdf', ensureAuthenticated, (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const data = getAttendanceDataForMonth(month);
  const lines = [`Month: ${data.month.label} ${data.month.year}`, ''];
  data.records.forEach((student) => {
    lines.push(`${student.name} | ${student.reg_no} | ${student.department || 'N/A'} | Present: ${student.totalPresent} | Absent: ${student.totalAbsent} | %: ${student.attendancePercent}`);
  });
  makePdf(res, `attendance-${month}`, lines);
});

app.get('/api/export/report-pdf', ensureAuthenticated, (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const data = getAttendanceDataForMonth(month);
  const summary = computeSummary(data.records);
  const lines = [
    `Monthly Report - ${data.month.label} ${data.month.year}`,
    `Total Students: ${summary.totalStudents}`,
    `Total Present: ${summary.totalPresent}`,
    `Total Absent: ${summary.totalAbsent}`,
    `Present %: ${summary.presentPercent}`,
    `Absent %: ${summary.absentPercent}`,
    ''
  ];
  data.records.forEach((student) => {
    lines.push(`${student.name} | ${student.reg_no} | ${student.department || 'N/A'} | Present: ${student.totalPresent} | Absent: ${student.totalAbsent} | %: ${student.attendancePercent}`);
  });
  makePdf(res, `report-${month}`, lines);
});

app.get('/api/export/shortage-pdf', ensureAuthenticated, (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const data = getAttendanceDataForMonth(month);
  const shortage = data.records.filter((student) => student.attendancePercent < 75);
  const lines = [`Shortage List - ${data.month.label} ${data.month.year}`, ''];
  shortage.forEach((student) => {
    lines.push(`${student.name} | ${student.reg_no} | ${student.department || 'N/A'} | Parent Contact: ${student.parent_contact || 'N/A'} | Attendance: ${student.attendancePercent}%`);
  });
  makePdf(res, `shortage-${month}`, lines);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler must come after all routes
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request payload too large. Please reduce the attendance data size and try again.' });
  }
  return next(err);
});

initDatabase();

app.listen(port, '0.0.0.0', () => {
  console.log(`Attendance system running on port ${port}`);
});
