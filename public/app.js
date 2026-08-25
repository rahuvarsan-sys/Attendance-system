const app = document.getElementById('app');
let today = new Date();
let currentYear = today.getFullYear();
let state = {
  auth: { username: 'Admin', role: 'admin' },
  view: 'attendance',
  authMessage: '',
  month: `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}`,
  attendance: null,
  reports: null,
  shortage: null,
  students: [],
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

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { error: text };
  }
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function loadDashboard() {
  const [attendance, reports, shortage, students] = await Promise.all([
    api(`/api/attendance?month=${state.month}`),
    api(`/api/reports?mode=${state.reportMode}&month=${state.month}`),
    api(`/api/shortage?month=${state.month}`),
    api('/api/students')
  ]);
  state.attendance = attendance;
  state.reports = reports;
  state.shortage = shortage;
  state.students = students.students.slice().sort(compareRegNoObjects);
  render();
}

function compareRegNoObjects(a, b) {
  const parseValue = (value) => {
    const raw = String(value || '').trim();
    const numeric = Number(raw.replace(/[^0-9]/g, ''));
    return Number.isNaN(numeric) ? null : numeric;
  };
  const aNumber = parseValue(a.reg_no || a.regNo);
  const bNumber = parseValue(b.reg_no || b.regNo);
  if (aNumber !== null && bNumber !== null) {
    return aNumber - bNumber;
  }
  return String(a.reg_no || a.regNo || '').localeCompare(String(b.reg_no || b.regNo || ''), undefined, { numeric: true, sensitivity: 'base' });
}

async function saveAttendance() {
  try {
    const records = [];
    state.attendance.records.forEach((student) => {
      student.entries.forEach((entry) => {
        records.push({ studentId: student.id, date: entry.date, status: entry.status });
      });
    });
    const result = await api('/api/attendance/save', {
      method: 'POST',
      body: JSON.stringify({ month: state.month, records })
    });
    state.attendance = result;
    state.reports = await api(`/api/reports?mode=${state.reportMode}&month=${state.month}`);
    state.shortage = await api(`/api/shortage?month=${state.month}`);
    state.attendanceMessage = 'Attendance saved successfully.';
    render();
  } catch (error) {
    state.attendanceMessage = error.message || 'Failed to save attendance.';
    render();
  }
}

async function addStudentHandler(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = {
    name: formData.get('name'),
    regNo: formData.get('regNo'),
    parentContact: formData.get('parentContact'),
    department: formData.get('department')
  };
  const result = await api('/api/students', { method: 'POST', body: JSON.stringify(payload) });
  state.students = [...state.students, result.student];
  event.target.reset();
  render();
}

async function importStudentsHandler(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const file = formData.get('file');
  if (!file) {
    state.importMessage = 'Please upload a CSV or XLSX file first.';
    render();
    return;
  }
  const response = await fetch('/api/import', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  const result = await response.json();
  if (!response.ok) {
    state.importMessage = result.error || 'Import failed';
    render();
    return;
  }
  const importedCount = result.inserted ? result.inserted.length : 0;
  state.importMessage = `Imported ${importedCount} students successfully. (${result.importedRows || 0} rows processed)`;
  state.students = [...state.students, ...(result.inserted || [])];
  event.target.reset();
  await loadDashboard();
  render();
}

function recalculateStudentAttendance(student) {
  const totalDays = student.entries.length;
  const totalPresent = student.entries.filter((entry) => entry.status === 'present').length;
  student.totalPresent = totalPresent;
  student.totalAbsent = totalDays - totalPresent;
  student.attendancePercent = totalDays === 0 ? 0 : Math.round((totalPresent / totalDays) * 100);
}

function handleAttendanceToggle(studentId, date, checked) {
  const student = state.attendance.records.find((item) => item.id === studentId);
  if (!student) return;
  const entry = student.entries.find((item) => item.date === date);
  if (entry) entry.status = checked ? 'present' : 'absent';
  recalculateStudentAttendance(student);
  render();
}

async function deleteStudent(studentId) {
  if (!confirm('Delete this student and all attendance records?')) return;
  await api(`/api/students/${studentId}`, { method: 'DELETE' });
  state.students = state.students.filter((student) => student.id !== studentId);
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
  const payload = {
    name: state.editStudentForm.name,
    regNo: state.editStudentForm.regNo,
    parentContact: state.editStudentForm.parentContact,
    department: state.editStudentForm.department
  };
  const response = await fetch(`/api/students/${state.editStudentId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) {
    state.importMessage = result.error || 'Update failed';
    render();
    return;
  }
  state.editStudentId = null;
  state.editStudentForm = { name: '', regNo: '', parentContact: '', department: '' };
  await loadDashboard();
}

function renderDashboard() {
  const summary = state.reports?.summary || { totalStudents: 0, totalPresent: 0, totalAbsent: 0, presentPercent: 0, absentPercent: 0 };
  const shortageList = state.shortage?.records || [];
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
      ${state.attendanceMessage ? `<div class="subtle">${state.attendanceMessage}</div>` : ''}
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
        <a href="/api/export/attendance-pdf?month=${state.month}" target="_blank">Download Attendance PDF</a>
        <a href="/api/export/report-pdf?month=${state.month}" target="_blank">Download Report PDF</a>
        <a href="/api/export/shortage-pdf?month=${state.month}" target="_blank">Download Shortage PDF</a>
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
        <h3>Shortage List</h3>
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
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderImport() {
  return `
    <div class="panel">
      <h3>Upload / Import Data</h3>
      <div class="subtle">Upload a CSV or Excel file and import students directly.</div>
      <form onsubmit="importStudentsHandler(event)" method="post" enctype="multipart/form-data">
        <input id="import-file-input" type="file" name="file" accept=".csv,.xls,.xlsx" required />
        <button type="submit" style="margin-top:10px;">Import Students</button>
      </form>
      <div class="subtle">${state.importMessage || 'If import fails, use the manual student entry form below.'}</div>
    </div>

    <div class="panel" style="margin-top:16px;">
      <h3>Add Student Manually</h3>
      <form onsubmit="addStudentHandler(event)">
        <input name="name" placeholder="Student Name" required />
        <input name="regNo" placeholder="Register Number" required />
        <input name="parentContact" placeholder="Parent Contact Number" />
        <input name="department" placeholder="Department" />
        <button type="submit">Add Student</button>
      </form>
    </div>

    <div class="panel" style="margin-top:16px;">
      <h3>Imported Students</h3>
      ${state.students.length === 0 ? '<div class="subtle">No students imported yet.</div>' : `
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
                  <td>${student.department || 'N/A'}</td>
                  <td>${student.parent_contact || 'N/A'}</td>
                  <td><button type="button" class="secondary" onclick="deleteStudent(${student.id})">Delete</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
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
      <h3>Student Directory</h3>
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

loadDashboard();
