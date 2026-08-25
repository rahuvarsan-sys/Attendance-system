const app = document.getElementById('app');

const DEFAULT_STUDENTS = [
  { id: 1786012049973.925, name: "Aatharshen P J", reg_no: "922525105001", department: "EEE", parent_contact: "9842299286" },
  { id: 1786012049973.3005, name: "Arunika M", reg_no: "922525105002", department: "EEE", parent_contact: "9600467799" },
  { id: 1786012049973.7542, name: "Deepak T", reg_no: "922525105003", department: "EEE", parent_contact: "9443515247" },
  { id: 1786012049973.856, name: "Dharani sri A K", reg_no: "922525105004", department: "EEE", parent_contact: "7598195330" },
  { id: 1786012049974.3218, name: "Dharanya M", reg_no: "922525105005", department: "EEE", parent_contact: "8695179411" },
  { id: 1786012049974.9414, name: "Dharshan V V", reg_no: "922525105006", department: "EEE", parent_contact: "9994031121" },
  { id: 1786012049974.4214, name: "Dhikeesh  D", reg_no: "922525105007", department: "EEE", parent_contact: "9965836530" },
  { id: 1786012049974.167, name: "Ganesh A", reg_no: "922525105008", department: "EEE", parent_contact: "6379922759" },
  { id: 1786012049974.8052, name: "Girubha A", reg_no: "922525105009", department: "EEE", parent_contact: "9952640463" },
  { id: 1786012049974.7048, name: "Gobika P", reg_no: "922525105010", department: "EEE", parent_contact: "9865081565" },
  { id: 1786012049974.347, name: "Gokulram K", reg_no: "922525105011", department: "EEE", parent_contact: "6380476138" },
  { id: 1786012049974.9656, name: "Gopika B L", reg_no: "922525105012", department: "EEE", parent_contact: "9715188678" },
  { id: 1786012049974.9155, name: "Gurudev G", reg_no: "922525105013", department: "EEE", parent_contact: "9443083222" },
  { id: 1786012049974.6948, name: "Harish varaje S", reg_no: "922525105014", department: "EEE", parent_contact: "9791582987" },
  { id: 1786012049975.3394, name: "Iniyan S R", reg_no: "922525105015", department: "EEE", parent_contact: "9787538717" },
  { id: 1786012049975.2622, name: "Jeeva J", reg_no: "922525105016", department: "EEE", parent_contact: "9655941224" },
  { id: 1786012049975.5134, name: "Kabilan M L", reg_no: "922525105017", department: "EEE", parent_contact: "8825805398" },
  { id: 1786012049975.434, name: "Kadhiravan U", reg_no: "922525105018", department: "EEE", parent_contact: "9585907112" },
  { id: 1786012049975.1296, name: "Karthi R", reg_no: "922525105019", department: "EEE", parent_contact: "9786473991" },
  { id: 1786012049975.713, name: "Kaushal sakthivel", reg_no: "922525105020", department: "EEE", parent_contact: "9787511936" },
  { id: 1786012049975.8704, name: "Kaveen K", reg_no: "922525105021", department: "EEE", parent_contact: "9884980185" },
  { id: 1786012049975.6357, name: "Kavin R", reg_no: "922525105022", department: "EEE", parent_contact: "8870402387" },
  { id: 1786012049975.8425, name: "Kiruthik D E", reg_no: "922525105023", department: "EEE", parent_contact: "7010156502" },
  { id: 1786012049975.5452, name: "Krishna Prasad A S", reg_no: "922525105024", department: "EEE", parent_contact: "9976396297" },
  { id: 1786012049975.4216, name: "Lithish R", reg_no: "922525105025", department: "EEE", parent_contact: "8973072125" },
  { id: 1786012049976.2087, name: "Madhan Kumar K", reg_no: "922525105026", department: "EEE", parent_contact: "9626780372" },
  { id: 1786012049976.3672, name: "Mallishwaran M", reg_no: "922525105027", department: "EEE", parent_contact: "9751182111" },
  { id: 1786012049976.7478, name: "Mithun S", reg_no: "922525105028", department: "EEE", parent_contact: "9965676362" },
  { id: 1786012049976.1914, name: "Mohamed Yasir", reg_no: "922525105029", department: "EEE", parent_contact: "9894365016" },
  { id: 1786012049976.8076, name: "NAARAYANAN. M V", reg_no: "922525105030", department: "EEE", parent_contact: "9176437022" },
  { id: 1786012049976.3882, name: "NAMASIVAYA. L", reg_no: "922525105031", department: "EEE", parent_contact: "9087026291" },
  { id: 1786012049976.9146, name: "Naresh S", reg_no: "922525105032", department: "EEE", parent_contact: "6382680067" },
  { id: 1786012049976.3801, name: "Nisanth  T", reg_no: "922525105033", department: "EEE", parent_contact: "8098989718" },
  { id: 1786012049976.5835, name: "Nishanth S R", reg_no: "922525105034", department: "EEE", parent_contact: "9626742115" },
  { id: 1786012049976.9062, name: "Nitheen K", reg_no: "922525105035", department: "EEE", parent_contact: "9003772592" },
  { id: 1786012049976.1758, name: "Nithish raja D", reg_no: "922525105036", department: "EEE", parent_contact: "6380791318" },
  { id: 1786012049977.661, name: "Nithisri P P", reg_no: "922525105037", department: "EEE", parent_contact: "9952172559" },
  { id: 1786012049977.8252, name: "Nithya Varshini D", reg_no: "922525105038", department: "EEE", parent_contact: "7010540639" },
  { id: 1786012049977.6936, name: "Pavithra M", reg_no: "922525105039", department: "EEE", parent_contact: "9994225436" },
  { id: 1786012049977.1821, name: "Prabhu P", reg_no: "922525105040", department: "EEE", parent_contact: "7904442305" },
  { id: 1786012049977.6304, name: "Prasanna T R", reg_no: "922525105041", department: "EEE", parent_contact: "9843541630" },
  { id: 1786012049978.6753, name: "Priyadharshini V", reg_no: "922525105042", department: "EEE", parent_contact: "9385731902" },
  { id: 1786012049978.585, name: "Ragavel A", reg_no: "922525105043", department: "EEE", parent_contact: "9159899366" },
  { id: 1786012049978.407, name: "Rahuvarsan P V", reg_no: "922525105044", department: "EEE", parent_contact: "9865543924" },
  { id: 1786012049978.7273, name: "Rakshitha S", reg_no: "922525105045", department: "EEE", parent_contact: "8760580681" },
  { id: 1786012049978.0005, name: "Renuka M", reg_no: "922525105046", department: "EEE", parent_contact: "8883829609" },
  { id: 1786012049978.788, name: "Rithika I", reg_no: "922525105047", department: "EEE", parent_contact: "9443048326" },
  { id: 1786012049978.39, name: "Rohith N", reg_no: "922525105048", department: "EEE", parent_contact: "9787723149" },
  { id: 1786012049978.6533, name: "Sanjaisriram S P", reg_no: "922525105049", department: "EEE", parent_contact: "9442793930" },
  { id: 1786012049978.4565, name: "Saran Raj S", reg_no: "922525105050", department: "EEE", parent_contact: "9566623337" },
  { id: 1786012049978.709, name: "Sibiarasu P", reg_no: "922525105051", department: "EEE", parent_contact: "9361039774" },
  { id: 1786012049979.256, name: "Sipitharan S", reg_no: "922525105052", department: "EEE", parent_contact: "9787429392" },
  { id: 1786012049979.1167, name: "Sowman K M", reg_no: "922525105053", department: "EEE", parent_contact: "9842632099" },
  { id: 1786012049979.5732, name: "Sree Aakaash S A", reg_no: "922525105054", department: "EEE", parent_contact: "9976825375" },
  { id: 1786012049979.1663, name: "Sridharsan B M", reg_no: "922525105055", department: "EEE", parent_contact: "9688241307" },
  { id: 1786012049979.0366, name: "Suhailhasan J", reg_no: "922525105057", department: "EEE", parent_contact: "9843166586" },
  { id: 1786012049979.5276, name: "Sujan S", reg_no: "922525105058", department: "EEE", parent_contact: "7339670805" },
  { id: 1786012049979.4253, name: "Swetha S", reg_no: "922525105059", department: "EEE", parent_contact: "9790474506" },
  { id: 1786012049979.423, name: "Tamilarasan S", reg_no: "922525105060", department: "EEE", parent_contact: "8760981208" },
  { id: 1786012049979.9304, name: "Thanuja R M", reg_no: "922525105061", department: "EEE", parent_contact: "9566714689" },
  { id: 1786012049979.1387, name: "Ubayadhullah J", reg_no: "922525105062", department: "EEE", parent_contact: "9443823376" },
  { id: 1786012049979.9207, name: "Vinothkumar B", reg_no: "922525105063", department: "EEE", parent_contact: "9025766228" },
  { id: 1787476799750, name: "GOWTHAM V", reg_no: "9225251050301", department: "EEE", parent_contact: "9360807080" },
  { id: 1787476922698, name: "KARTHIKEYAN K", reg_no: "9225251050302", department: "EEE", parent_contact: "7200724587" },
  { id: 1787476970755, name: "KUMARAKURUBARAN C", reg_no: "9225251050303", department: "EEE", parent_contact: "9943787173" },
  { id: 1787477007372, name: "SARANRAJ S", reg_no: "9225251050501", department: "EEE", parent_contact: "9787025207" }
];

function getLocalStudents() {
  try {
    const raw = localStorage.getItem('AMS_STUDENTS');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('AMS_STUDENTS', JSON.stringify(DEFAULT_STUDENTS));
  return DEFAULT_STUDENTS;
}

function saveLocalStudents(students) {
  try {
    localStorage.setItem('AMS_STUDENTS', JSON.stringify(students));
  } catch (e) {}
}

function getLocalAttendance() {
  try {
    const raw = localStorage.getItem('AMS_ATTENDANCE');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveLocalAttendance(attendance) {
  try {
    localStorage.setItem('AMS_ATTENDANCE', JSON.stringify(attendance));
  } catch (e) {}
}

let today = new Date();
let currentYear = today.getFullYear();
let state = {
  auth: { username: 'Admin', role: 'admin' },
  view: 'attendance',
  month: `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}`,
  attendance: null,
  reports: null,
  shortage: null,
  students: getLocalStudents(),
  reportMode: 'monthly',
  selectedYear: currentYear,
  form: { name: '', regNo: '', parentContact: '', department: '' },
  editStudentId: null,
  editStudentForm: { name: '', regNo: '', parentContact: '', department: '' },
  importMessage: '',
  attendanceMessage: ''
};

function setView(view) {
  state.view = view;
  render();
}

function compareRegNo(a, b) {
  const parseValue = (value) => {
    const raw = String(value || '').trim();
    const number = Number(raw.replace(/[^0-9]/g, ''));
    return Number.isNaN(number) ? null : number;
  };
  const aNumber = parseValue(a.reg_no || a.regNo);
  const bNumber = parseValue(b.reg_no || b.regNo);
  if (aNumber !== null && bNumber !== null) return aNumber - bNumber;
  return String(a.reg_no || a.regNo || '').localeCompare(String(b.reg_no || b.regNo || ''), undefined, { numeric: true, sensitivity: 'base' });
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

function computeLocalAttendanceData(month) {
  const [yearStr, monStr] = month.split('-');
  const year = Number(yearStr);
  const monthNumber = Number(monStr);
  const monthInfo = getMonthDetails(year, monthNumber);
  const students = (state.students || getLocalStudents()).slice().sort(compareRegNo);
  const attendanceList = getLocalAttendance();

  const rows = attendanceList.filter((entry) => {
    return entry.date && entry.date.startsWith(`${year}-${String(monthNumber).padStart(2, '0')}`);
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
      parent_contact: student.parent_contact || '',
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

async function api(path, options = {}) {
  try {
    const response = await fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function loadDashboard() {
  state.students = getLocalStudents().slice().sort(compareRegNo);
  
  // Try server sync
  const serverStudents = await api('/api/students');
  if (serverStudents && Array.isArray(serverStudents.students)) {
    state.students = serverStudents.students.slice().sort(compareRegNo);
    saveLocalStudents(state.students);
  }

  const localAttData = computeLocalAttendanceData(state.month);
  state.attendance = localAttData;

  const summary = computeSummary(localAttData.records);
  if (state.reportMode === 'overall') {
    const allAttendance = getLocalAttendance();
    const allRecords = state.students.map((student) => {
      const rows = allAttendance.filter((e) => e.student_id === student.id);
      const totalPresent = rows.filter((r) => r.status === 'present').length;
      const totalAbsent = rows.filter((r) => r.status === 'absent').length;
      const totalDays = totalPresent + totalAbsent;
      const attendancePercent = totalDays === 0 ? 0 : Math.round((totalPresent / totalDays) * 100);
      return { ...student, totalPresent, totalAbsent, totalDays, attendancePercent };
    });
    state.reports = { mode: 'overall', records: allRecords, summary: computeSummary(allRecords) };
  } else {
    state.reports = { mode: 'monthly', month: localAttData.month, records: localAttData.records, summary };
  }

  state.shortage = {
    month: localAttData.month,
    records: localAttData.records.filter((s) => s.attendancePercent < 75)
  };

  render();
}

async function saveAttendance() {
  try {
    const localAttendance = getLocalAttendance();
    const recordsToSave = [];
    state.attendance.records.forEach((student) => {
      student.entries.forEach((entry) => {
        recordsToSave.push({ studentId: student.id, date: entry.date, status: entry.status });
        const idx = localAttendance.findIndex((e) => e.student_id === student.id && e.date === entry.date);
        if (idx !== -1) {
          localAttendance[idx].status = entry.status;
        } else {
          localAttendance.push({ student_id: student.id, date: entry.date, status: entry.status });
        }
      });
    });
    saveLocalAttendance(localAttendance);

    // Try server save
    api('/api/attendance/save', {
      method: 'POST',
      body: JSON.stringify({ month: state.month, records: recordsToSave })
    });

    state.attendanceMessage = 'Attendance saved successfully!';
    await loadDashboard();
    setTimeout(() => {
      state.attendanceMessage = '';
      render();
    }, 3000);
  } catch (error) {
    state.attendanceMessage = 'Attendance saved locally.';
    render();
  }
}

function handleAttendanceToggle(studentId, date, checked) {
  const student = state.attendance.records.find((item) => item.id === studentId);
  if (!student) return;
  const entry = student.entries.find((item) => item.date === date);
  if (entry) entry.status = checked ? 'present' : 'absent';
  
  const totalDays = student.entries.length;
  const totalPresent = student.entries.filter((e) => e.status === 'present').length;
  student.totalPresent = totalPresent;
  student.totalAbsent = totalDays - totalPresent;
  student.attendancePercent = totalDays === 0 ? 0 : Math.round((totalPresent / totalDays) * 100);
  render();
}

async function addStudentHandler(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = String(formData.get('name') || '').trim();
  const regNo = String(formData.get('regNo') || '').trim();
  const parentContact = String(formData.get('parentContact') || '').trim();
  const department = String(formData.get('department') || 'EEE').trim();

  if (!name || !regNo) {
    alert('Please enter both student name and register number.');
    return;
  }

  const existing = state.students.find((s) => s.reg_no === regNo);
  if (existing) {
    alert('A student with this Register Number already exists!');
    return;
  }

  const newStudent = {
    id: Date.now() + Math.random(),
    name,
    reg_no: regNo,
    parent_contact: parentContact,
    department: department || 'EEE'
  };

  state.students.push(newStudent);
  saveLocalStudents(state.students);
  api('/api/students', { method: 'POST', body: JSON.stringify(newStudent) });
  
  event.target.reset();
  await loadDashboard();
}

async function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student and all attendance records?')) return;
  state.students = state.students.filter((s) => s.id !== studentId);
  saveLocalStudents(state.students);

  const localAtt = getLocalAttendance().filter((e) => e.student_id !== studentId);
  saveLocalAttendance(localAtt);

  api(`/api/students/${studentId}`, { method: 'DELETE' });
  await loadDashboard();
}

function startEditStudent(studentId) {
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return;
  state.editStudentId = student.id;
  state.editStudentForm = {
    name: student.name,
    regNo: student.reg_no,
    parentContact: student.parent_contact || '',
    department: student.department || ''
  };
  render();
}

function cancelEditStudent() {
  state.editStudentId = null;
  state.editStudentForm = { name: '', regNo: '', parentContact: '', department: '' };
  render();
}

async function saveStudentEdit(event) {
  event.preventDefault();
  const index = state.students.findIndex((s) => s.id === state.editStudentId);
  if (index !== -1) {
    state.students[index].name = state.editStudentForm.name;
    state.students[index].reg_no = state.editStudentForm.regNo;
    state.students[index].parent_contact = state.editStudentForm.parentContact;
    state.students[index].department = state.editStudentForm.department || 'EEE';
    saveLocalStudents(state.students);
    api(`/api/students/${state.editStudentId}`, {
      method: 'PUT',
      body: JSON.stringify(state.students[index])
    });
  }
  state.editStudentId = null;
  state.editStudentForm = { name: '', regNo: '', parentContact: '', department: '' };
  await loadDashboard();
}

async function importStudentsHandler(event) {
  event.preventDefault();
  const fileInput = document.getElementById('import-file-input');
  const file = fileInput && fileInput.files[0];
  if (!file) {
    state.importMessage = 'Please select a CSV or Excel file.';
    render();
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      if (typeof XLSX === 'undefined') {
        alert('File reader loading, please try again.');
        return;
      }
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });

      let addedCount = 0;
      rows.slice(1).forEach((row) => {
        if (!Array.isArray(row) || row.length === 0) return;
        const name = String(row[1] || row[0] || '').trim();
        const regNo = String(row[2] || row[1] || '').trim();
        const dept = String(row[3] || 'EEE').trim();
        const contact = String(row[4] || '').trim();

        if (name && regNo && !state.students.some((s) => s.reg_no === regNo)) {
          state.students.push({
            id: Date.now() + Math.random(),
            name,
            reg_no: regNo,
            department: dept,
            parent_contact: contact
          });
          addedCount += 1;
        }
      });

      saveLocalStudents(state.students);
      state.importMessage = `Successfully imported ${addedCount} new students!`;
      await loadDashboard();
    } catch (err) {
      state.importMessage = 'Error reading file: ' + err.message;
      render();
    }
  };
  reader.readAsArrayBuffer(file);
}

function printCurrentReport() {
  window.print();
}

function renderDashboard() {
  const summary = state.reports?.summary || { totalStudents: 0, totalPresent: 0, totalAbsent: 0, presentPercent: 0, absentPercent: 0 };
  return `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="logo">AMS</div>
        <div class="subtle">College / School</div>
        <button class="nav-btn ${state.view === 'attendance' ? 'active' : ''}" onclick="setView('attendance')">Attendance</button>
        <button class="nav-btn ${state.view === 'reports' ? 'active' : ''}" onclick="setView('reports')">Reports</button>
        <button class="nav-btn ${state.view === 'shortage' ? 'active' : ''}" onclick="setView('shortage')">Shortage List</button>
        <button class="nav-btn ${state.view === 'import' ? 'active' : ''}" onclick="setView('import')">Upload / Import Data</button>
        <button class="nav-btn ${state.view === 'students' ? 'active' : ''}" onclick="setView('students')">Students</button>
      </aside>
      <main class="main">
        <div class="header">
          <div>
            <h2>Attendance Dashboard</h2>
            <div class="subtle">Manage monthly attendance and generate reports with ease.</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="muted">Total Students</div>
            <div class="value">${summary.totalStudents}</div>
          </div>
          <div class="stat-box">
            <div class="muted">Present</div>
            <div class="value">${summary.totalPresent}</div>
          </div>
          <div class="stat-box">
            <div class="muted">Absent</div>
            <div class="value">${summary.totalAbsent}</div>
          </div>
          <div class="stat-box">
            <div class="muted">Attendance %</div>
            <div class="value">${summary.presentPercent}%</div>
          </div>
        </div>

        ${renderSection()}
      </main>
    </div>
  `;
}

function renderSection() {
  if (state.view === 'attendance') return renderAttendance();
  if (state.view === 'reports') return renderReports();
  if (state.view === 'shortage') return renderShortage();
  if (state.view === 'import') return renderImport();
  if (state.view === 'students') return renderStudents();
  return renderAttendance();
}

function renderAttendance() {
  if (!state.attendance) return '<div class="panel">Loading attendance...</div>';
  const monthLabel = `${state.attendance.month.label} ${state.attendance.month.year}`;
  const days = state.attendance.month.dates || [];
  const monthOptions = getMonthOptions(state.selectedYear);

  const rowsHtml = state.attendance.records.map((student) => {
    const departmentText = student.department || 'EEE';
    const entriesHtml = student.entries.map((entry) => `
      <td class="day-cell">
        <input type="checkbox" ${entry.status === 'present' ? 'checked' : ''} onchange="handleAttendanceToggle(${student.id}, '${entry.date}', this.checked)" />
      </td>
    `).join('');
    return `
      <tr>
        <td>${student.reg_no || 'Unknown'}</td>
        <td>${student.name || 'Unknown'}</td>
        <td>${departmentText}</td>
        ${entriesHtml}
        <td>${student.totalDays}</td>
        <td>${student.totalPresent}</td>
        <td>${student.totalAbsent}</td>
        <td>${student.attendancePercent}%</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="panel">
      <div class="header">
        <h3>Attendance Sheet</h3>
        <div class="grid-2" style="width:100%; align-items:center; gap:10px;">
          <select onchange="handleYearChange(this.value)">
            ${getYearOptions().map((year) => `<option value="${year}" ${year === state.selectedYear ? 'selected' : ''}>${year}</option>`).join('')}
          </select>
          <select onchange="state.month=this.value; loadDashboard();">
            ${monthOptions.map((month) => `<option value="${month.value}" ${month.value === state.month ? 'selected' : ''}>${month.label}</option>`).join('')}
          </select>
          <button onclick="saveAttendance()">Save Attendance</button>
        </div>
      </div>
      <div class="subtle">Month: ${monthLabel}</div>
      ${state.attendanceMessage ? `<div class="badge" style="margin-bottom:12px; display:inline-block;">${state.attendanceMessage}</div>` : ''}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Register No</th>
              <th>Student Name</th>
              <th>Department</th>
              ${days.map((day) => `<th class="day-cell">${day.day}</th>`).join('')}
              <th>Total Days</th>
              <th>Present</th>
              <th>Absent</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      <div class="header" style="margin-top:16px;">
        <button class="secondary" onclick="printCurrentReport()">Print / Export PDF</button>
      </div>
    </div>
  `;
}

function renderReports() {
  if (!state.reports) return '<div class="panel">Loading reports...</div>';
  const records = state.reports.records || [];
  const modeLabel = state.reportMode === 'overall' ? 'Overall Report' : 'Monthly Report';
  const monthOptions = getMonthOptions(state.selectedYear);

  const rowsHtml = records.map((student, index) => {
    const departmentText = student.department || 'EEE';
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.reg_no}</td>
        <td>${departmentText}</td>
        <td>${student.totalPresent}</td>
        <td>${student.totalAbsent}</td>
        <td>${student.attendancePercent}%</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="panel">
      <div class="header">
        <h3>${modeLabel}</h3>
        <div class="grid-2" style="width:100%; gap:8px; align-items:center;">
          <select onchange="handleYearChange(this.value)">
            ${getYearOptions().map((year) => `<option value="${year}" ${year === state.selectedYear ? 'selected' : ''}>${year}</option>`).join('')}
          </select>
          <select onchange="state.month=this.value; loadDashboard();">
            ${monthOptions.map((month) => `<option value="${month.value}" ${month.value === state.month ? 'selected' : ''}>${month.label}</option>`).join('')}
          </select>
          <select onchange="state.reportMode=this.value; loadDashboard();">
            <option value="monthly" ${state.reportMode === 'monthly' ? 'selected' : ''}>Monthly</option>
            <option value="overall" ${state.reportMode === 'overall' ? 'selected' : ''}>Overall</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Student Name</th>
              <th>Register No</th>
              <th>Department</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      <div class="header" style="margin-top:16px;">
        <button class="secondary" onclick="printCurrentReport()">Print / Export PDF</button>
      </div>
    </div>
  `;
}

function renderShortage() {
  if (!state.shortage) return '<div class="panel">Loading shortage list...</div>';
  const records = state.shortage.records || [];
  const monthOptions = getMonthOptions(state.selectedYear);

  const rowsHtml = records.map((student) => {
    const departmentText = student.department || 'EEE';
    return `
      <tr>
        <td>${student.name}</td>
        <td>${student.reg_no}</td>
        <td>${departmentText}</td>
        <td>${student.parent_contact || 'N/A'}</td>
        <td><span class="badge danger">${student.attendancePercent}%</span></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="panel">
      <div class="header">
        <h3>Shortage List (&lt; 75% Attendance)</h3>
        <div class="grid-2" style="width:100%; gap:10px; align-items:center;">
          <select onchange="handleYearChange(this.value)">
            ${getYearOptions().map((year) => `<option value="${year}" ${year === state.selectedYear ? 'selected' : ''}>${year}</option>`).join('')}
          </select>
          <select onchange="state.month=this.value; loadDashboard();">
            ${monthOptions.map((month) => `<option value="${month.value}" ${month.value === state.month ? 'selected' : ''}>${month.label}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Register No</th>
              <th>Department</th>
              <th>Parent Contact</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml.length > 0 ? rowsHtml : '<tr><td colspan="5" style="text-align:center;">No students below 75% attendance.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="header" style="margin-top:16px;">
        <button class="secondary" onclick="printCurrentReport()">Print / Export PDF</button>
      </div>
    </div>
  `;
}

function renderImport() {
  return `
    <div class="panel">
      <h3>Upload / Import Data</h3>
      <div class="subtle">Upload a CSV or Excel file to import students automatically.</div>
      <form onsubmit="importStudentsHandler(event)">
        <input id="import-file-input" type="file" accept=".csv,.xls,.xlsx" required />
        <button type="submit" style="margin-top:10px;">Import Students</button>
      </form>
      ${state.importMessage ? `<div class="badge" style="margin-top:12px; display:inline-block;">${state.importMessage}</div>` : ''}
    </div>

    <div class="panel" style="margin-top:16px;">
      <h3>Add Student Manually</h3>
      <form onsubmit="addStudentHandler(event)">
        <input name="name" placeholder="Student Name" required />
        <input name="regNo" placeholder="Register Number" required />
        <input name="parentContact" placeholder="Parent Contact Number" />
        <input name="department" placeholder="Department" value="EEE" />
        <button type="submit">Add Student</button>
      </form>
    </div>

    <div class="panel" style="margin-top:16px;">
      <h3>Student List (${state.students.length} Total)</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Register No</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Parent Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.students.map((student) => `
              <tr>
                <td>${student.reg_no}</td>
                <td>${student.name}</td>
                <td>${student.department || 'EEE'}</td>
                <td>${student.parent_contact || 'N/A'}</td>
                <td><button type="button" class="secondary" onclick="deleteStudent(${student.id})">Delete</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderStudents() {
  const rowsHtml = state.students.map((student) => {
    const departmentText = student.department || 'EEE';
    return `
      <tr>
        <td>${student.reg_no}</td>
        <td>${student.name}</td>
        <td>${departmentText}</td>
        <td>${student.parent_contact || 'N/A'}</td>
        <td>
          <button class="secondary" onclick="startEditStudent(${student.id})">Edit</button>
          <button class="secondary" onclick="deleteStudent(${student.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="panel">
      <h3>Student Directory (${state.students.length} Students)</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Register No</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Parent Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
    ${state.editStudentId ? renderStudentEditForm() : ''}
  `;
}

function renderStudentEditForm() {
  return `
    <div class="panel" style="margin-top:16px;">
      <h3>Edit Student</h3>
      <form onsubmit="saveStudentEdit(event)">
        <input value="${state.editStudentForm.name}" oninput="state.editStudentForm.name=this.value" placeholder="Student Name" required />
        <input value="${state.editStudentForm.regNo}" oninput="state.editStudentForm.regNo=this.value" placeholder="Register Number" required />
        <input value="${state.editStudentForm.parentContact}" oninput="state.editStudentForm.parentContact=this.value" placeholder="Parent Contact Number" />
        <input value="${state.editStudentForm.department}" oninput="state.editStudentForm.department=this.value" placeholder="Department" />
        <div class="grid-2" style="gap:12px;">
          <button type="submit">Save Changes</button>
          <button type="button" class="secondary" onclick="cancelEditStudent()">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

function render() {
  app.innerHTML = renderDashboard();
}

function getYearOptions() {
  const current = new Date().getFullYear();
  return [current - 1, current, current + 1];
}

function getMonthOptions(year) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, '0');
    const date = new Date(year, index, 1);
    const value = `${year}-${month}`;
    return { label: `${date.toLocaleString('en-US', { month: 'long' })} ${year}`, value };
  });
}

function handleYearChange(yearValue) {
  const year = Number(yearValue);
  state.selectedYear = year;
  const [, monthNumber] = state.month.split('-');
  state.month = `${year}-${monthNumber}`;
  loadDashboard();
}

window.setView = setView;
window.saveAttendance = saveAttendance;
window.addStudentHandler = addStudentHandler;
window.importStudentsHandler = importStudentsHandler;
window.handleAttendanceToggle = handleAttendanceToggle;
window.loadDashboard = loadDashboard;
window.handleYearChange = handleYearChange;
window.startEditStudent = startEditStudent;
window.saveStudentEdit = saveStudentEdit;
window.cancelEditStudent = cancelEditStudent;
window.deleteStudent = deleteStudent;
window.printCurrentReport = printCurrentReport;

loadDashboard();
