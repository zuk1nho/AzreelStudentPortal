// --- 1. APPLICATION, STORAGE & THEME STATE ---
let currentUser = null;
let chartInstanceBar = null;
let chartInstanceDoughnut = null;
let chartInstanceGpa = null;

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("localStorage unavailable:", e);
    }
}

function loadData(key, fallback = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
}

const defaultUsers = [
    { name: "Aina Binti Ali", id: "2023459812", email: "student@uitm.edu.my", password: "pass123" }
];

function getRegisteredUsers() {
    const saved = loadData('uitm_registered_users');
    if (saved && Array.isArray(saved)) {
        return saved;
    }
    saveData('uitm_registered_users', defaultUsers);
    return defaultUsers;
}

function initTheme() {
    const savedTheme = localStorage.getItem('uitm_portal_theme') || 'light';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('uitm_portal_theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    const mobileIcon = document.getElementById('mobile-theme-icon');
    const text = document.getElementById('theme-text');

    if (theme === 'dark') {
        if (icon) icon.className = 'fa-solid fa-sun text-warning';
        if (mobileIcon) mobileIcon.className = 'fa-solid fa-sun text-warning';
        if (text) text.textContent = 'Light Mode';
    } else {
        if (icon) icon.className = 'fa-solid fa-moon text-warning';
        if (mobileIcon) mobileIcon.className = 'fa-solid fa-moon text-warning';
        if (text) text.textContent = 'Dark Mode';
    }

    if (document.getElementById('view-dashboard')?.classList.contains('active')) {
        initCharts();
    }
    if (document.getElementById('view-results')?.classList.contains('active')) {
        initGpaChart();
    }
}

// Live Academic Clock & Next Class Pulse
function startLiveClock() {
    const updateClock = () => {
        const now = new Date();
        const options = { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formatted = now.toLocaleDateString('en-MY', options);
        const clockEl = document.getElementById('live-clock-badge');
        if (clockEl) {
            clockEl.innerHTML = `<i class="fa-regular fa-clock text-warning me-1"></i>${formatted}`;
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[now.getDay()];
        const todayClasses = timetableData.filter(t => t.day === todayName);
        const indicator = document.getElementById('next-class-indicator');
        if (indicator) {
            if (todayClasses.length > 0) {
                indicator.textContent = `Today (${todayName}): ${todayClasses[0].course} at ${todayClasses[0].time} (${todayClasses[0].venue})`;
            } else {
                indicator.textContent = `Weekend / Self-Study Mode: Next Scheduled Lab is IMS566 on Monday at 08:00 AM`;
            }
        }
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// Dataset 1: Course Catalog Data
let coursesData = [
    { code: "IMS566", title: "Advanced Web Design & Development", credits: 3, score: 56, grade: "A+", instructor: "Dr. Azlan Sha" },
    { code: "IMS556", title: "Information Architecture", credits: 3, score: 52, grade: "A", instructor: "Prof. Madya Dr. Norhayati" },
    { code: "IMS506", title: "Database Systems for Information Professionals", credits: 3, score: 49, grade: "A-", instructor: "En. Ahmad Redza" },
    { code: "IMS555", title: "Algorithm & Data Structures", credits: 3, score: 46, grade: "B+", instructor: "Puan Farida" },
    { code: "IMC510", title: "Organization of Information", credits: 3, score: 54, grade: "A", instructor: "Dr. Suraya" },
    { code: "ENT530", title: "Principles of Entrepreneurship", credits: 3, score: 58, grade: "A+", instructor: "Pn. Mastura" }
];

// Dataset 2: Tasks & Internship Data
const defaultTasksData = [
    { id: 1, title: "Petronas Digital - Business Analyst Intern", category: "Internship Application", deadline: "2026-11-20", status: "Offered", notes: "KLCC Tower 1, Allowance RM 1,200/mo" },
    { id: 2, title: "IMS566 Individual Assignment Submission", category: "Assessment", deadline: "2026-11-15", status: "In Progress", notes: "Upload HTML & Documentation to U-Future" },
    { id: 3, title: "Maybank IT Trainee Placement", category: "Internship Application", deadline: "2026-11-28", status: "Pending", notes: "Interview scheduled for Nov 22" },
    { id: 4, title: "IMS556 Information Architecture Prototype", category: "Course Project", deadline: "2026-11-05", status: "Completed", notes: "Figma prototype & usability report" },
    { id: 5, title: "Academic Clearance Form Submission", category: "Administrative", deadline: "2026-12-01", status: "Pending", notes: "Submit signed form to Faculty Office" }
];

let tasksData = loadData('uitm_tasks_data', defaultTasksData);

function autoSaveTasks() {
    saveData('uitm_tasks_data', tasksData);
}

// Dataset 3: Class Timetable Data
const timetableData = [
    { day: "Monday", time: "08:00 AM - 10:00 AM", course: "IMS566 - Advanced Web Design & Development", type: "Lab", venue: "Makmal Komputer 3, Blok C", lecturer: "Dr. Azlan Sha" },
    { day: "Monday", time: "02:00 PM - 04:00 PM", course: "IMS556 - Information Architecture", type: "Lecture", venue: "Dewan Kuliah 2", lecturer: "Prof. Madya Dr. Norhayati" },
    { day: "Tuesday", time: "10:00 AM - 12:00 PM", course: "IMS506 - Database Systems", type: "Lab", venue: "Makmal Pangkalan Data 1", lecturer: "En. Ahmad Redza" },
    { day: "Wednesday", time: "09:00 AM - 11:00 AM", course: "IMS555 - Algorithm & Data Structures", type: "Lecture", venue: "Bilik Seminar 4", lecturer: "Puan Farida" },
    { day: "Thursday", time: "11:00 AM - 01:00 PM", course: "IMC510 - Organization of Information", type: "Lecture", venue: "Dewan Kuliah 1", lecturer: "Dr. Suraya" },
    { day: "Friday", time: "09:00 AM - 11:00 AM", course: "ENT530 - Principles of Entrepreneurship", type: "Tutorial", venue: "Bilik Tutorial 7", lecturer: "Pn. Mastura" }
];

// Dataset 4: Exam & Results History (Semester Summary + Subject Breakdown)
const resultsData = [
    { semester: "Semester 4", session: "2025/2026 - 2", credits: 18, gpa: "3.82", cgpa: "3.78", award: "Dean's List (Anugerah Dekan)" },
    { semester: "Semester 3", session: "2025/2026 - 1", credits: 19, gpa: "3.75", cgpa: "3.76", award: "Dean's List (Anugerah Dekan)" },
    { semester: "Semester 2", session: "2024/2025 - 2", credits: 18, gpa: "3.80", cgpa: "3.77", award: "Dean's List (Anugerah Dekan)" },
    { semester: "Semester 1", session: "2024/2025 - 1", credits: 17, gpa: "3.74", cgpa: "3.74", award: "Dean's List (Anugerah Dekan)" }
];

const subjectResultsData = [
    // Semester 4
    { semester: "Semester 4", code: "IMS554", title: "Web Content Management & Design", credit: 3, grade: "A+", point: "4.00", status: "LU" },
    { semester: "Semester 4", code: "IMS553", title: "Information System Project Management", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 4", code: "IMS552", title: "Information Security & Ethics", credit: 3, grade: "A-", point: "3.67", status: "LU" },
    { semester: "Semester 4", code: "IMC502", title: "Research Methodology in Information Science", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 4", code: "ELC550", title: "English for Academic Writing", credit: 3, grade: "A-", point: "3.67", status: "LU" },
    { semester: "Semester 4", code: "TAC451", title: "Introductory Arabic (Level II)", credit: 3, grade: "B+", point: "3.33", status: "LU" },

    // Semester 3
    { semester: "Semester 3", code: "IMS505", title: "Metadata Development in Information Environment", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 3", code: "IMS504", title: "Systems Analysis and Design", credit: 4, grade: "A-", point: "3.67", status: "LU" },
    { semester: "Semester 3", code: "IMS503", title: "Records Management in Organizations", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 3", code: "IMC501", title: "Information Sources and Services", credit: 3, grade: "B+", point: "3.33", status: "LU" },
    { semester: "Semester 3", code: "CTU554", title: "Values and Civilization II", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 3", code: "TAC401", title: "Introductory Arabic (Level I)", credit: 3, grade: "B+", point: "3.33", status: "LU" },

    // Semester 2
    { semester: "Semester 2", code: "IMS456", title: "Basic Web Design and Content Management", credit: 3, grade: "A+", point: "4.00", status: "LU" },
    { semester: "Semester 2", code: "IMS455", title: "Support Services and Maintenance", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 2", code: "IMS454", title: "Information Retrieval Systems", credit: 3, grade: "A-", point: "3.67", status: "LU" },
    { semester: "Semester 2", code: "IMC451", title: "Cataloguing and Classification", credit: 3, grade: "A-", point: "3.67", status: "LU" },
    { semester: "Semester 2", code: "ELC501", title: "English for Critical Academic Reading", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 2", code: "HBU121", title: "National Kesatria II", credit: 3, grade: "B+", point: "3.33", status: "LU" },

    // Semester 1
    { semester: "Semester 1", code: "IMS401", title: "Fundamentals of Information Systems", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 1", code: "IMS402", title: "Introduction to Programming", credit: 3, grade: "A-", point: "3.67", status: "LU" },
    { semester: "Semester 1", code: "IMC401", title: "Foundation of Information Management", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 1", code: "MGT400", title: "Introduction to Management", credit: 3, grade: "B+", point: "3.33", status: "LU" },
    { semester: "Semester 1", code: "CTU552", title: "Philosophy and Current Issues", credit: 3, grade: "A", point: "4.00", status: "LU" },
    { semester: "Semester 1", code: "HBU111", title: "National Kesatria I", credit: 2, grade: "B+", point: "3.33", status: "LU" }
];

// Dataset 5: UiTM Academic Calendar
const calendarData = [
    { activity: "Course Registration & Validation", dates: "01 Oct 2026 - 14 Oct 2026", duration: "2 Weeks", status: "Completed" },
    { activity: "Mid-Semester Break", dates: "23 Nov 2026 - 29 Nov 2026", duration: "1 Week", status: "Upcoming" },
    { activity: "Student Feedback Online (SuFO)", dates: "14 Dec 2026 - 03 Jan 2027", duration: "3 Weeks", status: "Upcoming" },
    { activity: "Study Week (Minggu Ulangkaji)", dates: "11 Jan 2027 - 17 Jan 2027", duration: "1 Week", status: "Scheduled" },
    { activity: "Final Examination Period", dates: "18 Jan 2027 - 07 Feb 2027", duration: "3 Weeks", status: "Scheduled" }
];

// --- 2. INITIALIZATION & AUTO-RESTORE SESSION ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    startLiveClock();
    renderCoursesTable();
    renderTasksTable();
    renderDashboardRecentTasks();
    renderTimetableTable();
    renderIcressTimetableGrid();
    renderSeparatedSemesterResults();
    renderCalendarTable();

    const savedSession = loadData('uitm_current_session');
    if (savedSession && savedSession.email) {
        currentUser = savedSession;
        updateAuthUI();
        navigateTo('dashboard');
    } else {
        updateAuthUI();
    }
});

// --- 3. PAGE ROUTING & MOBILE SIDEBAR NAVIGATION ---
function toggleMobileSidebar(forceClose = false) {
    const sidebar = document.querySelector('.sidebar-uitm');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar || !backdrop) return;

    if (forceClose) {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('show');
    } else {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('show');
    }
}

function navigateTo(viewId) {
    if (!currentUser && viewId !== 'auth') {
        showToast("Please log in to access portal features.", "danger");
        viewId = 'auth';
    }

    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    document.querySelectorAll('.sidebar-uitm .nav-link, .profile-pill-btn').forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${viewId}`);
    if (activeNav) activeNav.classList.add('active');

    if (viewId === 'dashboard') {
        setTimeout(initCharts, 100);
    }
    if (viewId === 'results') {
        setTimeout(initGpaChart, 100);
    }
    if (viewId === 'profile') {
        loadStudentProfilePage();
    }

    toggleMobileSidebar(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value.trim();
    const rememberMe = document.getElementById('rememberMe')?.checked ?? true;

    // Permanent default account so your lecturer can log in from GitHub on any device
    const defaultAccount = {
        name: "AZREEL ASHRAFF BIN TAIP",
        id: "2026113047",
        email: "2026113047@student.uitm.edu.my",
        password: "mypassword123",
        photo: "acapapa.jpeg"
    };

    const users = getRegisteredUsers();
    let matchedUser = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (!matchedUser && email === defaultAccount.email.toLowerCase() && password === defaultAccount.password) {
        matchedUser = defaultAccount;
    }

    if (matchedUser) {
        currentUser = { name: matchedUser.name, id: matchedUser.id, email: matchedUser.email, photo: matchedUser.photo || "acapapa.jpeg"};

        if (rememberMe) {
            saveData('uitm_current_session', currentUser);
        } else {
            localStorage.removeItem('uitm_current_session');
        }

        updateAuthUI();
        showToast(`Welcome back, ${currentUser.name}! Login successful.`, "success");
        navigateTo('dashboard');
    } else {
        showToast("Invalid email or password. Please register or check your credentials.", "danger");
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const id = document.getElementById('reg-id').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value.trim();

    if (!name || !id || !email || !password) {
        showToast("Please fill in all registration fields.", "danger");
        return;
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email)) {
        showToast("This email is already registered. Please log in instead.", "danger");
        return;
    }

    const newUserAccount = { name, id, email, password };
    users.push(newUserAccount);
    saveData('uitm_registered_users', users);

    currentUser = { name, id, email };
    saveData('uitm_current_session', currentUser);

    const loginEmailEl = document.getElementById('login-email');
    const loginPassEl = document.getElementById('login-password');
    if (loginEmailEl) loginEmailEl.value = email;
    if (loginPassEl) loginPassEl.value = password;
    document.getElementById('form-register')?.reset();

    updateAuthUI();
    showToast("Account registered & saved! Auto-logged in.", "success");
    navigateTo('dashboard');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('uitm_current_session');
    updateAuthUI();
    showToast("Logged out successfully.", "info");
    navigateTo('auth');
}

function updateAuthUI() {
    const navLinks = document.getElementById('nav-links-container');
    const profileHeader = document.getElementById('user-profile-header');
    const btnLogout = document.getElementById('btn-logout-nav');
    const btnLogin = document.getElementById('btn-login-nav');

    if (currentUser) {
        if (navLinks) navLinks.style.display = 'flex';
        if (profileHeader) profileHeader.style.display = 'block';
        if (btnLogout) btnLogout.style.display = 'block';
        if (btnLogin) btnLogin.style.display = 'none';

        const navDisplay = document.getElementById('nav-user-display');
        const navId = document.getElementById('nav-user-id');
        const dashDisplay = document.getElementById('dash-user-display');
        const dashId = document.getElementById('dash-id-display');

        if (navDisplay) navDisplay.textContent = currentUser.name;
        if (navId) navId.textContent = `ID: ${currentUser.id}`;
        if (dashDisplay) dashDisplay.textContent = currentUser.name;
        if (dashId) dashId.textContent = currentUser.id;

        const avatarKey = `uitm_profile_pic_${currentUser.email}`;
        const savedAvatar = localStorage.getItem(avatarKey);
        const defaultAvatar = "acapapa.jpeg";
        const finalAvatar = savedAvatar || defaultAvatar;

        const imgEl = document.getElementById('sidebar-profile-img');
        const pageImgEl = document.getElementById('page-profile-img');
        if (imgEl) imgEl.src = finalAvatar;
        if (pageImgEl) pageImgEl.src = finalAvatar;
    } else {
        if (navLinks) navLinks.style.display = 'none';
        if (profileHeader) profileHeader.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
        if (btnLogin) btnLogin.style.display = 'block';
    }
}

function handleProfilePicUpload(event) {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        document.getElementById('sidebar-profile-img').src = base64Image;
        const pageImg = document.getElementById('page-profile-img');
        if (pageImg) pageImg.src = base64Image;

        localStorage.setItem(`uitm_profile_pic_${currentUser.email}`, base64Image);
        showToast("Profile picture auto-saved!", "success");
    };
    reader.readAsDataURL(file);
}

function loadStudentProfilePage() {
    if (!currentUser) return;

    const bio = loadData(`uitm_student_bio_${currentUser.email}`, {});
    const sidebarImg = document.getElementById('sidebar-profile-img')?.src;

    document.getElementById('page-profile-name').textContent = currentUser.name;
    document.getElementById('page-profile-id').textContent = currentUser.id;
    document.getElementById('page-profile-email').textContent = currentUser.email;
    document.getElementById('page-matric-barcode').textContent = `*${currentUser.id}*`;
    if (sidebarImg) document.getElementById('page-profile-img').src = sidebarImg;

    document.getElementById('prof-name').value = currentUser.name;
    document.getElementById('prof-id').value = currentUser.id;
    document.getElementById('prof-email').value = currentUser.email;
    document.getElementById('prof-phone').value = bio.phone || "+60 13-482 9104";
    document.getElementById('prof-advisor').value = bio.advisor || "Dr. Azlan Sha bin Mohamed";
    document.getElementById('prof-state').value = bio.state || "Shah Alam, Selangor";
    document.getElementById('prof-skills').value = bio.skills || "Web Design (HTML/CSS/JS), Information Architecture, Database Management";
    document.getElementById('prof-bio').value = bio.bio || "Final-year Information Systems Management student preparing for Semester 6 industrial training.";
}

function saveStudentProfileDetails(event) {
    event.preventDefault();
    if (!currentUser) return;

    const updatedName = document.getElementById('prof-name').value.trim();
    const updatedId = document.getElementById('prof-id').value.trim();

    currentUser.name = updatedName;
    currentUser.id = updatedId;
    saveData('uitm_current_session', currentUser);

    const users = getRegisteredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (idx !== -1) {
        users[idx].name = updatedName;
        users[idx].id = updatedId;
        saveData('uitm_registered_users', users);
    }

    const bioData = {
        phone: document.getElementById('prof-phone').value.trim(),
        advisor: document.getElementById('prof-advisor').value.trim(),
        state: document.getElementById('prof-state').value.trim(),
        skills: document.getElementById('prof-skills').value.trim(),
        bio: document.getElementById('prof-bio').value.trim()
    };
    saveData(`uitm_student_bio_${currentUser.email}`, bioData);

    updateAuthUI();
    loadStudentProfilePage();
    showToast("Student profile & Digital Matric updated!", "success");
}



function updateCgpaSimulator(targetGpa) {
    const gpaNum = parseFloat(targetGpa);
    document.getElementById('sim-gpa-display').textContent = gpaNum.toFixed(2);

    // Current: 72 credits @ 3.78 CGPA + 18 credits @ targetGpa
    const totalPoints = (72 * 3.78) + (18 * gpaNum);
    const projectedCgpa = (totalPoints / 90).toFixed(2);

    document.getElementById('sim-projected-cgpa').textContent = projectedCgpa;
    const badge = document.getElementById('sim-honors-badge');
    if (gpaNum >= 3.50) {
        badge.textContent = "Dean's List Eligible";
        badge.className = "badge badge-uitm";
    } else {
        badge.textContent = "Good Standing (LU)";
        badge.className = "badge bg-secondary text-white";
    }
}

// --- 5. DATA VIEW 1: COURSES TABLE (FILTER + SORT) ---
function renderCoursesTable() {
    const tbody = document.getElementById('courses-table-body');
    if (!tbody) return;
    const searchVal = document.getElementById('course-search-input')?.value.toLowerCase() || '';
    const gradeVal = document.getElementById('course-grade-select')?.value || 'ALL';
    const sortVal = document.getElementById('course-sort-select')?.value || 'default';

    let filtered = coursesData.filter(item => {
        const matchesSearch = item.code.toLowerCase().includes(searchVal) || 
                              item.title.toLowerCase().includes(searchVal) ||
                              item.instructor.toLowerCase().includes(searchVal);
        const matchesGrade = (gradeVal === 'ALL') || (item.grade === gradeVal);
        return matchesSearch && matchesGrade;
    });

    if (sortVal === 'code-asc') {
        filtered.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortVal === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'title-desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortVal === 'score-desc') {
        filtered.sort((a, b) => b.score - a.score);
    } else if (sortVal === 'score-asc') {
        filtered.sort((a, b) => a.score - b.score);
    }

    tbody.innerHTML = filtered.map(c => `
        <tr>
            <td class="ps-4 fw-bold text-purple">${c.code}</td>
            <td class="fw-semibold">${c.title}</td>
            <td class="text-center">${c.credits}</td>
            <td class="text-center"><span class="fw-bold">${c.score}</span> / 60</td>
            <td class="text-center"><span class="badge bg-purple-subtle text-purple border border-purple px-2 py-1">${c.grade}</span></td>
            <td><small class="text-muted"><i class="fa-solid fa-user-tie me-1"></i>${c.instructor}</small></td>
            <td class="text-end pe-4">
                <button class="btn btn-outline-secondary btn-sm" onclick="showToast('Course Syllabus for ${c.code} is up-to-date.', 'info')">
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
            </td>
        </tr>
    `).join('');

    const countText = document.getElementById('courses-count-text');
    if (countText) countText.textContent = `Showing ${filtered.length} of ${coursesData.length} courses`;
}

function filterCoursesTable() {
    renderCoursesTable();
}

// --- 6. DATA VIEW 2: TASKS & INTERNSHIP TABLE (FILTER + SORT) ---
function renderTasksTable() {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;
    const searchVal = document.getElementById('task-search-input')?.value.toLowerCase() || '';
    const statusVal = document.getElementById('task-status-select')?.value || 'ALL';
    const sortVal = document.getElementById('task-sort-select')?.value || 'default';

    let filtered = tasksData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchVal) || 
                              item.category.toLowerCase().includes(searchVal) ||
                              item.notes.toLowerCase().includes(searchVal);
        const matchesStatus = (statusVal === 'ALL') || (item.status === statusVal);
        return matchesSearch && matchesStatus;
    });

    if (sortVal === 'date-asc') {
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortVal === 'date-desc') {
        filtered.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (sortVal === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'title-desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortVal === 'status') {
        filtered.sort((a, b) => a.status.localeCompare(b.status));
    }

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td class="ps-4 fw-bold text-body">${t.title}</td>
            <td><span class="badge bg-light text-dark border">${t.category}</span></td>
            <td><small><i class="fa-regular fa-calendar me-1"></i>${t.deadline}</small></td>
            <td class="text-center">${getStatusBadge(t.status)}</td>
            <td><small class="text-muted">${t.notes}</small></td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditTaskModal(${t.id})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTaskRecord(${t.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterTasksTable() {
    renderTasksTable();
}

function getStatusBadge(status) {
    switch(status) {
        case 'Completed': return '<span class="badge bg-success"><i class="fa-solid fa-check me-1"></i>Completed</span>';
        case 'In Progress': return '<span class="badge bg-primary"><i class="fa-solid fa-spinner me-1"></i>In Progress</span>';
        case 'Offered': return '<span class="badge bg-warning text-dark"><i class="fa-solid fa-star me-1"></i>Offered</span>';
        case 'Pending': return '<span class="badge bg-secondary"><i class="fa-solid fa-clock me-1"></i>Pending</span>';
        default: return `<span class="badge bg-light text-dark">${status}</span>`;
    }
}

// --- 7. ACADEMIC PORTAL VIEWS RENDERERS (TIMETABLE, RESULTS BY SEMESTER, CALENDAR) ---
function renderTimetableTable() {
    const tbody = document.getElementById('timetable-table-body');
    if (!tbody) return;
    const sortVal = document.getElementById('timetable-sort-select')?.value || 'day';
    const dayOrder = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };

    let sorted = [...timetableData];
    if (sortVal === 'day') {
        sorted.sort((a, b) => (dayOrder[a.day] || 9) - (dayOrder[b.day] || 9));
    } else if (sortVal === 'course-asc') {
        sorted.sort((a, b) => a.course.localeCompare(b.course));
    } else if (sortVal === 'course-desc') {
        sorted.sort((a, b) => b.course.localeCompare(a.course));
    } else if (sortVal === 'type') {
        sorted.sort((a, b) => a.type.localeCompare(b.type));
    }

    tbody.innerHTML = sorted.map(item => `
        <tr>
            <td class="ps-4 fw-bold text-body">${item.day}</td>
            <td><small class="fw-medium"><i class="fa-regular fa-clock me-1 text-primary"></i>${item.time}</small></td>
            <td class="fw-semibold text-body">${item.course}</td>
            <td><span class="badge ${item.type === 'Lab' ? 'bg-warning text-dark' : 'bg-info text-dark'}">${item.type}</span></td>
            <td><small class="text-muted">${item.venue}</small></td>
            <td><small class="text-muted">${item.lecturer}</small></td>
        </tr>
    `).join('');
}

function switchTimetableView(mode) {
    const gridWrap = document.getElementById('timetable-grid-wrapper');
    const listWrap = document.getElementById('timetable-list-wrapper');
    const sortSelect = document.getElementById('timetable-sort-select');
    const btnGrid = document.getElementById('btn-tt-grid');
    const btnList = document.getElementById('btn-tt-list');

    if (mode === 'grid') {
        if (gridWrap) gridWrap.style.display = 'block';
        if (listWrap) listWrap.style.display = 'none';
        if (sortSelect) sortSelect.style.display = 'none';
        btnGrid?.classList.replace('btn-outline-primary', 'btn-primary');
        btnList?.classList.replace('btn-primary', 'btn-outline-primary');
    } else {
        if (gridWrap) gridWrap.style.display = 'none';
        if (listWrap) listWrap.style.display = 'block';
        if (sortSelect) sortSelect.style.display = 'inline-block';
        btnList?.classList.replace('btn-outline-primary', 'btn-primary');
        btnGrid?.classList.replace('btn-primary', 'btn-outline-primary');
    }
}

function parseTimeTo24Hour(timeStr) {
    // Converts "02:00 PM" -> 14.0, "09:30 AM" -> 9.5
    const [timePart, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours + (minutes / 60);
}

function formatDecimalToIcressTime(dec) {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60);
    return `${h}.${m.toString().padStart(2, '0')}`;
}

function renderIcressTimetableGrid() {
    const container = document.getElementById('icress-timetable-grid');
    if (!container) return;

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const startHour = 8;  // 08:00
    const endHour = 17;   // 17:00
    const totalHalfHours = (endHour - startHour) * 2; // 18 columns

    let html = `<div class="icress-corner" style="grid-row: 1; grid-column: 1;"></div>`;

    // Top Time Axis Header (08:00 to 17:00)
    for (let h = startHour; h <= endHour; h++) {
        const colStart = 2 + (h - startHour) * 2;
        const label = `${h.toString().padStart(2, '0')}:00`;
        html += `<div class="icress-time-header" style="grid-row: 1; grid-column: ${colStart} / span 2;">${label}</div>`;
    }

    // Day Rows + Half-Hour Background Gridlines
    days.forEach((dayName, idx) => {
        const rowNum = idx + 2;
        html += `<div class="icress-day-cell" style="grid-row: ${rowNum}; grid-column: 1;">${dayName}</div>`;

        for (let slot = 0; slot < totalHalfHours; slot++) {
            const colNum = slot + 2;
            const isHourDivider = slot % 2 === 1 ? 'hour-divider' : '';
            html += `<div class="icress-slot-bg ${isHourDivider}" style="grid-row: ${rowNum}; grid-column: ${colNum};"></div>`;
        }
    });

    // Spanned Class Blocks
    timetableData.forEach(item => {
        const dayIndex = days.indexOf(item.day.toUpperCase());
        if (dayIndex === -1) return;

        const rowNum = dayIndex + 2;
        const [startStr, endStr] = item.time.split(' - ');
        const startDec = parseTimeTo24Hour(startStr);
        const endDec = parseTimeTo24Hour(endStr);

        const colStart = Math.round((startDec - startHour) * 2) + 2;
        const colSpan = Math.max(1, Math.round((endDec - startDec) * 2));

        const courseCode = item.course.split(' - ')[0].trim();
        const shortVenue = item.venue.split(',')[0].trim();
        const timeRange24 = `${formatDecimalToIcressTime(startDec)}-${formatDecimalToIcressTime(endDec)}`;

        html += `
            <div class="icress-event-block"
                 style="grid-row: ${rowNum}; grid-column: ${colStart} / span ${colSpan};"
                 onclick="showToast('${item.course} (${item.type}) • ${item.venue} • ${item.lecturer}', 'info')"
                 title="${item.course} | ${item.venue} | ${item.lecturer}">
                <div class="icress-event-code">${courseCode}</div>
                <div class="icress-event-venue">${shortVenue}</div>
                <div class="icress-event-time">${timeRange24}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderSeparatedSemesterResults() {
    const container = document.getElementById('semester-results-container');
    if (!container) return;

    const semFilter = document.getElementById('subject-sem-filter')?.value || 'ALL';
    const sortVal = document.getElementById('results-sort-select')?.value || 'sem-desc';

    let semesters = resultsData.filter(r => semFilter === 'ALL' || r.semester === semFilter);

    if (sortVal === 'sem-desc') {
        semesters.sort((a, b) => b.semester.localeCompare(a.semester));
    } else if (sortVal === 'sem-asc') {
        semesters.sort((a, b) => a.semester.localeCompare(b.semester));
    } else if (sortVal === 'gpa-desc') {
        semesters.sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa));
    } else if (sortVal === 'gpa-asc') {
        semesters.sort((a, b) => parseFloat(a.gpa) - parseFloat(b.gpa));
    }

    container.innerHTML = semesters.map(sem => {
        const semSubjects = subjectResultsData.filter(s => s.semester === sem.semester);

        const subjectRows = semSubjects.map(s => `
            <tr>
                <td class="ps-4 fw-bold text-purple">${s.code}</td>
                <td class="fw-semibold text-body">${s.title}</td>
                <td class="text-center">${s.credit}</td>
                <td class="text-center"><span class="badge bg-purple-subtle text-purple border border-purple px-2 py-1">${s.grade}</span></td>
                <td class="text-center fw-bold text-primary">${s.point}</td>
                <td class="text-end pe-4"><span class="badge bg-success">${s.status}</span></td>
            </tr>
        `).join('');

        return `
            <div class="card card-custom overflow-hidden w-100">
                <div class="card-header bg-light border-bottom py-3 px-3 px-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div style="min-width: 0;">
                        <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 mb-2">
                            <h5 class="fw-bold mb-0 text-body text-nowrap">${sem.semester}</h5>
                            <span class="badge badge-uitm text-wrap text-start">${sem.award}</span>
                        </div>
                        <small class="text-muted d-block">Academic Session: <strong>${sem.session}</strong> • Total Credits: <strong>${sem.credits} Hours</strong></small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div class="px-3 py-1 rounded border text-center flex-fill">
                            <small class="text-muted d-block" style="font-size: 0.7rem;">GPA</small>
                            <span class="fw-bold text-primary fs-6">${sem.gpa}</span>
                        </div>
                        <div class="px-3 py-1 rounded border text-center flex-fill">
                            <small class="text-muted d-block" style="font-size: 0.7rem;">CGPA</small>
                            <span class="fw-bold text-success fs-6">${sem.cgpa}</span>
                        </div>
                    </div>
                </div>
                <div class="table-responsive w-100">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light border-bottom text-secondary small text-uppercase">
                            <tr>
                                <th class="ps-3 ps-md-4">Course Code</th>
                                <th>Subject Title</th>
                                <th class="text-center">Credit</th>
                                <th class="text-center">Grade</th>
                                <th class="text-center">Grade Point</th>
                                <th class="text-end pe-3 pe-md-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjectRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

function renderCalendarTable() {
    const tbody = document.getElementById('calendar-table-body');
    if (!tbody) return;
    const sortVal = document.getElementById('calendar-sort-select')?.value || 'date-asc';

    const parseStartDate = (rangeStr) => new Date(rangeStr.split(' - ')[0]);

    let sorted = [...calendarData];
    if (sortVal === 'date-asc') {
        sorted.sort((a, b) => parseStartDate(a.dates) - parseStartDate(b.dates));
    } else if (sortVal === 'date-desc') {
        sorted.sort((a, b) => parseStartDate(b.dates) - parseStartDate(a.dates));
    } else if (sortVal === 'activity-asc') {
        sorted.sort((a, b) => a.activity.localeCompare(b.activity));
    } else if (sortVal === 'activity-desc') {
        sorted.sort((a, b) => b.activity.localeCompare(a.activity));
    } else if (sortVal === 'status') {
        sorted.sort((a, b) => a.status.localeCompare(b.status));
    }

    tbody.innerHTML = sorted.map(c => `
        <tr>
            <td class="ps-4 fw-semibold text-body">${c.activity}</td>
            <td><small><i class="fa-regular fa-calendar me-1"></i>${c.dates}</small></td>
            <td><small class="text-muted">${c.duration}</small></td>
            <td class="text-end pe-4">
                <span class="badge ${c.status === 'Completed' ? 'bg-success' : c.status === 'Upcoming' ? 'bg-warning text-dark' : 'bg-secondary'}">${c.status}</span>
            </td>
        </tr>
    `).join('');
}

// --- 8. MODAL CRUD HANDLERS (WITH AUTO-SAVE) ---
function openAddTaskModal() {
    document.getElementById('modalTaskTitle').textContent = "Add Task / Internship Record";
    document.getElementById('form-task').reset();
    document.getElementById('task-id').value = '';
    new bootstrap.Modal(document.getElementById('modalTask')).show();
}

function openEditTaskModal(id) {
    const task = tasksData.find(t => t.id === id);
    if (!task) return;

    document.getElementById('modalTaskTitle').textContent = "Edit Task / Internship Record";
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-category').value = task.category;
    document.getElementById('task-deadline').value = task.deadline;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-notes').value = task.notes;

    new bootstrap.Modal(document.getElementById('modalTask')).show();
}

function saveTaskRecord(event) {
    event.preventDefault();
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value.trim();
    const category = document.getElementById('task-category').value;
    const deadline = document.getElementById('task-deadline').value;
    const status = document.getElementById('task-status').value;
    const notes = document.getElementById('task-notes').value.trim();

    if (id) {
        const index = tasksData.findIndex(t => t.id == id);
        if (index !== -1) {
            tasksData[index] = { id: Number(id), title, category, deadline, status, notes };
            showToast("Record updated & auto-saved!", "success");
        }
    } else {
        const newId = tasksData.length ? Math.max(...tasksData.map(t => t.id)) + 1 : 1;
        tasksData.push({ id: newId, title, category, deadline, status, notes });
        showToast("New record added & auto-saved!", "success");
    }

    autoSaveTasks();
    bootstrap.Modal.getInstance(document.getElementById('modalTask')).hide();
    renderTasksTable();
    renderDashboardRecentTasks();
    if (document.getElementById('view-dashboard').classList.contains('active')) {
        initCharts();
    }
}

function deleteTaskRecord(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        tasksData = tasksData.filter(t => t.id !== id);
        autoSaveTasks();
        renderTasksTable();
        renderDashboardRecentTasks();
        if (document.getElementById('view-dashboard').classList.contains('active')) {
            initCharts();
        }
        showToast("Record deleted & auto-saved.", "info");
    }
}

// --- 9. DASHBOARD RECENT TASKS SUMMARY ---
function renderDashboardRecentTasks() {
    const tbody = document.getElementById('dash-recent-tasks');
    if (!tbody) return;

    const recent = tasksData.slice(0, 4);
    tbody.innerHTML = recent.map(r => `
        <tr>
            <td class="fw-semibold text-body">${r.title}</td>
            <td><small class="text-muted">${r.category}</small></td>
            <td><small>${r.deadline}</small></td>
            <td>${getStatusBadge(r.status)}</td>
            <td class="text-end">
                <button class="btn btn-link btn-sm text-decoration-none p-0" onclick="navigateTo('internship')">View →</button>
            </td>
        </tr>
    `).join('');
}

// --- 10. CHART.JS VISUALIZATIONS ---
function initCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    const ctxBar = document.getElementById('chartGradesBar')?.getContext('2d');
    if (ctxBar) {
        if (chartInstanceBar) chartInstanceBar.destroy();
        chartInstanceBar = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: coursesData.map(c => c.code),
                datasets: [{
                    label: 'Achieved Score (Max 60)',
                    data: coursesData.map(c => c.score),
                    backgroundColor: '#0284c7',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { beginAtZero: true, max: 60, ticks: { color: textColor }, grid: { color: gridColor } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    const ctxDoughnut = document.getElementById('chartTaskDoughnut')?.getContext('2d');
    if (ctxDoughnut) {
        if (chartInstanceDoughnut) chartInstanceDoughnut.destroy();

        const statusCounts = {
            Completed: tasksData.filter(t => t.status === 'Completed').length,
            'In Progress': tasksData.filter(t => t.status === 'In Progress').length,
            Offered: tasksData.filter(t => t.status === 'Offered').length,
            Pending: tasksData.filter(t => t.status === 'Pending').length
        };

        chartInstanceDoughnut = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#6b7280'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    }
                }
            }
        });
    }
}

function initGpaChart() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    const ctxGpa = document.getElementById('chartGpaTrend')?.getContext('2d');
    if (!ctxGpa) return;

    if (chartInstanceGpa) chartInstanceGpa.destroy();
    const chronological = [...resultsData].reverse();

    chartInstanceGpa = new Chart(ctxGpa, {
        type: 'line',
        data: {
            labels: chronological.map(r => r.semester),
            datasets: [
                {
                    label: 'Semester GPA',
                    data: chronological.map(r => parseFloat(r.gpa)),
                    borderColor: '#0284c7',
                    backgroundColor: 'rgba(2, 132, 199, 0.15)',
                    tension: 0.35,
                    fill: true,
                    pointRadius: 5
                },
                {
                    label: 'Cumulative CGPA',
                    data: chronological.map(r => parseFloat(r.cgpa)),
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.35,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { min: 3.4, max: 4.0, ticks: { color: textColor }, grid: { color: gridColor } }
            },
            plugins: {
                legend: { labels: { color: textColor } }
            }
        }
    });
}

// --- 11. UTILITY TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-dark';

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body small fw-medium">
                    <i class="fa-solid fa-circle-info me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', toastHTML);

    setTimeout(() => {
        const el = document.getElementById(toastId);
        if (el) el.remove();
    }, 3500);
}