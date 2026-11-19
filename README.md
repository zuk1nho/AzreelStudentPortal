# AzreelStudentPortal
This is for IMS566 Individual Assignment Purpose

IMS566 | UiTM Academic & Internship Management Portal

a. Project Title & Description

Project Title: UiTM Academic & Internship Management Portal (IMS566 Individual Assignment Prototype)

Description:

A responsive, web-based academic management and industrial training tracking portal designed specifically for Universiti Teknologi MARA (UiTM) students. Built for the IMS566 (Advanced Web Design Development and Content Management) course, this single-page web application centralizes student records, course continuous assessments, an iCRESS-style weekly class timetable, semester examination slips, academic calendars, and internship application tracking into an intuitive interface with client-side data persistence.

b. Features Included

Authentication & Account Management (#view-auth):

User login portal with "Remember Me" session persistence (localStorage).

New student registration form that dynamically stores and authenticates new user accounts.

Academic & Internship Dashboard (#view-dashboard):

Real-time academic clock and Smart Schedule Pulse indicator showing upcoming classes.

Key performance summary cards (Current CGPA, Enrolled Courses, IMS566 Project Readiness, and Internship Offers).

Interactive Chart.js data visualizations: a bar chart for Course Continuous Assessment scores and a doughnut chart for Task & Internship statuses.

Quick overview table of recent activity and upcoming deadlines.

Registered Course Catalog (#view-courses):

Real-time search by course code, title, or instructor.

Filtering by grade (A+, A, A-, B+) and multi-criteria sorting (code, title, score).

Class Timetable — iCRESS Grid & List View (#view-timetable):

Interactive iCRESS Horizontal Hourly Matrix Grid (08:00 – 17:00) displaying color-coded, proportional class blocks across Monday to Friday with click-to-inspect details.

View switcher allowing users to toggle between the iCRESS Grid and a sortable List View.

Academic Examination & Results (#view-results):

Chart.js line graph tracking Semester GPA and Cumulative CGPA progression across Semesters 1 to 4.

Individual semester examination result slips with subject-level grades, grade points, and Dean's List badges.

Semester filtering, ordering controls, and print-ready stylesheet support (Print Slip).

Task & Internship Tracker (#view-internship):

Full CRUD (Create, Read, Update, Delete) functionality via modal forms, automatically saved to browser localStorage.

Live keyword search, status filtering (Completed, In Progress, Offered, Pending), and deadline/title sorting.

UiTM Academic Calendar (#view-calendar):

Schedule of key semester milestones (Course Registration, Mid-Semester Break, SuFO, Study Week, and Final Examinations) with sorting controls.

Student Profile, Digital Matric Card & CGPA Simulator (#view-profile):

Interactive 3D Flip Digital UiTM Matric Card displaying student photo, Matric ID, barcode, and campus credentials.

Custom profile photo upload and editable student biodata synced across the sidebar and dashboard.

Interactive Semester 5 CGPA Target Simulator slider forecasting cumulative CGPA and Dean's List eligibility.

Responsive UI & Theme Customization:

Full Light Mode / Dark Mode theme switcher persisted across sessions.

Mobile-first responsive layout with a collapsible off-canvas navigation drawer for screens below 992px.

c. Instructions to Test Login

Extract the project folder and ensure index.html, style.css, script.js, and README.md are in the same directory.

Open index.html using Google Chrome (or any modern web browser).

On the Login Portal screen, enter the pre-configured demo credentials:

UiTM Student Email: student@uitm.edu.my

Password: pass123

Click Sign In to access the full Academic & Internship Dashboard.

(Optional) To test new account creation, click the Register Account tab on the login card, enter any Full Name, Student ID, Email, and Password, and click Register & Save Account to automatically create and log into the new profile.

d. Frameworks & Libraries Used

HTML5 & CSS3: Semantic page structure, CSS Custom Properties (variables for Light/Dark themes), Flexbox, and CSS Grid (for the iCRESS timetable matrix).

JavaScript (ES6+): Client-side routing, DOM manipulation, dynamic filtering/sorting, CRUD operations, and localStorage data persistence.

Bootstrap 5.3.2 (CDN): Responsive grid system, navigation components, modals, forms, badges, and utility classes.

Chart.js (CDN): Interactive bar, doughnut, and line charts for academic score breakdowns and GPA trends.

Font Awesome 6.4.2 (CDN): Vector UI icons across navigation, cards, tables, and action buttons.

Google Fonts: Inter (primary UI typeface) and JetBrains Mono (monospace typeface for Matric IDs, barcodes, and live clock).
