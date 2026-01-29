// Dashboard JavaScript - Integrated with Backend

document.addEventListener('DOMContentLoaded', async function () {
    // 1. Security Check
    if (typeof Api === 'undefined') {
        // Fallback if api.js not loaded
        console.error('API Utility not loaded');
        window.location.href = 'login.html';
        return;
    }

    // Check if user is logged in
    if (!Api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Initial Setup
    const user = JSON.parse(localStorage.getItem('user'));

    // Update User Profile in UI
    const userNameEls = document.querySelectorAll('.user-name');
    const userRoleEls = document.querySelectorAll('.user-role');
    const userAvatarEls = document.querySelectorAll('.user-avatar');

    if (user) {
        userNameEls.forEach(el => el.textContent = user.fullName);
        userRoleEls.forEach(el => el.textContent = user.role === 'PRACTITIONER' ? 'Ayurveda Specialist' : 'Patient');

        // Initials for avatar
        const initials = user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        userAvatarEls.forEach(el => el.textContent = initials);
    }

    // Sign Out Handler
    const signOutBtns = document.querySelectorAll('a[href="index.html"]'); // Assuming sign out links
    signOutBtns.forEach(btn => {
        if (btn.textContent.includes('Sign Out')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                Api.logout();
            });
        }
    });

    // Sidebar Navigation logic (Keep existing UI logic)
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const dashboardViews = document.querySelectorAll('.dashboard-view');
    const viewTitle = document.getElementById('viewTitle');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    const viewTitles = {
        'overview': 'Dashboard Overview',
        'patients': 'Patient Management',
        'appointments': 'Appointments',
        'prescriptions': 'Prescriptions',
        'analytics': 'Analytics & Reports',
        'settings': 'Settings'
    };

    // Sidebar Interactions
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const viewId = this.dataset.view;

            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            dashboardViews.forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`view-${viewId}`);
            if (targetView) targetView.classList.add('active');

            if (viewTitle) viewTitle.textContent = viewTitles[viewId] || 'Dashboard';

            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active'); // Close on mobile
            }
        });
    });

    // --- Booking Modal Logic ---
    const bookBtn = document.getElementById('btn-book-appointment');
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const toast = document.getElementById('toast');

    if (bookBtn && bookingModal) {
        bookBtn.addEventListener('click', () => {
            bookingModal.classList.add('active');
        });

        // Close Modal Handlers
        bookingModal.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                bookingModal.classList.remove('active');
            });
        });

        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) bookingModal.classList.remove('active');
        });

        // Form Submission
        if (bookingForm) {
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = bookingForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Booking...';
                submitBtn.disabled = true;

                try {
                    const formData = new FormData(bookingForm);
                    const data = Object.fromEntries(formData.entries());

                    // API Call
                    await Api.post('/appointments', data);

                    // Success Feedback
                    bookingModal.classList.remove('active');
                    bookingForm.reset();

                    showToast('Appointment booked successfully!');

                    // Refresh Data
                    await loadDashboardData(user.role);

                } catch (error) {
                    console.error('Booking failed:', error);
                    showToast('Failed to book appointment. Please try again.');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }

    // --- Notification Logic ---
    const notifBtn = document.getElementById('btn-notifications');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            // Scroll to notifications card if in view
            const notifCard = document.querySelector('.notifications-list');
            if (notifCard) {
                notifCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Highlight effect
                notifCard.parentElement.style.transition = 'box-shadow 0.3s ease';
                notifCard.parentElement.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.2)';
                setTimeout(() => {
                    notifCard.parentElement.style.boxShadow = '';
                }, 1500);
            } else {
                showToast('You have 3 unread notifications');
            }
        });
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // 3. Fetch Real Data
    try {
        await loadDashboardData(user.role);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
});

async function loadDashboardData(role) {
    // Fetch Appointments
    try {
        const response = await Api.get('/appointments');
        const appointments = response.data.appointments;

        renderAppointments(appointments, role);
        updateStats(appointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
    }

    // If Practitioner, fetch Patients
    if (role === 'PRACTITIONER') {
        // Implementation for patient list would go here
        // const patients = await Api.get('/practitioners/patients');
    }
}

function renderAppointments(appointments, role) {
    const listContainer = document.querySelector('.appointments-list');
    if (!listContainer) return;

    if (appointments.length === 0) {
        listContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No scheduled appointments found.</div>';
        return;
    }

    const html = appointments.map(apt => {
        const date = new Date(apt.scheduledAt);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const name = role === 'PRACTITIONER' ? apt.patient.user.fullName : apt.practitioner.user.fullName;
        const type = apt.type === 'VIDEO' ? 'Video Consultation' : 'In-Person Visit';

        return `
            <div class="appointment-card">
                <div class="appointment-time">
                    <div class="time-indicator ${apt.status === 'CONFIRMED' ? 'active' : ''}"></div>
                    <span>${timeStr}</span>
                </div>
                <div class="appointment-info">
                    <div class="patient-name">${name}</div>
                    <div class="appointment-type">${type}</div>
                </div>
                <div class="appointment-actions">
                    ${role === 'PRACTITIONER' ? '<button class="action-btn primary">Start</button>' : ''}
                    <button class="action-btn">Reschedule</button>
                    ${apt.meetingLink ? `<a href="${apt.meetingLink}" target="_blank" class="action-btn" style="text-decoration:none; color:inherit;">Join</a>` : ''}
                </div>
            </div>
        `;
    }).join('');

    listContainer.innerHTML = html;
}

function updateStats(appointments) {
    // Simple logic to mock stats update for now based on fetched length
    const todayCount = appointments.filter(a => {
        const d = new Date(a.scheduledAt);
        const now = new Date();
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    }).length;

    const todayStat = document.querySelector('.stat-value:nth-of-type(2)'); // "Today's Appointments" which was 2nd card
    // Note: The HTML structure of stats cards is tricky to target blindly. 
    // In original HTML: 
    // 1. Total Patients
    // 2. Today's Appointments

    // We'll traverse carefully
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 2) {
        // Update 2nd card (Today's Appts)
        const valEl = statCards[1].querySelector('.stat-value');
        if (valEl) valEl.textContent = todayCount;
    }
}
