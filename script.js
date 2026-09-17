// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

/**
 * Application State & Core Functions
 * ----------------------------------
 * Centralized object to hold the application's state, current view,
 * and key global methods used across different modules.
 */
    window.app = {
        currentView: 'landing', // Tracks active view ('landing', 'dashboard', 'tracking', etc.)

        // Add Account Features
        openAddAccountModal: function() {
            const modal = document.getElementById('add-account-modal');
            if (modal) modal.classList.add('show');
        },

        closeAddAccountModal: function() {
            const modal = document.getElementById('add-account-modal');
            if (modal) modal.classList.remove('show');
        },

        saveNewAccount: function() {
            const nameInput = document.getElementById('new-acc-name').value.trim();
            const ageInput = document.getElementById('new-acc-age').value.trim();

            if (!nameInput || !ageInput) {
                alert('Please enter both name and age.');
                return;
            }

            // Update UI with new account info
            const navName = document.querySelector('.nav-user-name');
            if (navName) navName.innerText = nameInput;
            
            const navAge = document.querySelector('.nav-user-age');
            if (navAge) navAge.innerText = `Age: ${ageInput}`;
            
            // Generate initials
            const words = nameInput.split(' ');
            let initials = '';
            if (words.length > 1) {
                initials = words[0][0] + words[1][0];
            } else {
                initials = nameInput.substring(0, 2);
            }
            initials = initials.toUpperCase();
            
            const navAvatar = document.querySelector('.nav-avatar');
            if (navAvatar) navAvatar.innerText = initials;
            
            // Update Dashboard Greeting
            const dashGreeting = document.querySelector('.dash-header h1');
            if (dashGreeting) dashGreeting.innerHTML = `Hello, ${nameInput}! 👋`;
            
            const dashAvatar = document.querySelector('.dash-header .avatar');
            if (dashAvatar) dashAvatar.innerText = initials;

            // Close modal
            this.closeAddAccountModal();
            
            // Switch to dashboard view automatically
            this.toggleView('dashboard');
            
            // Clear inputs
            document.getElementById('new-acc-name').value = '';
            document.getElementById('new-acc-age').value = '';
        },
        
        // Mental Wellbeing Features
        setMood: function(mood, btnElement) {
            const btns = document.querySelectorAll('.mood-btn');
            btns.forEach(btn => btn.classList.remove('selected'));
            btnElement.classList.add('selected');
            
            // Simple visual feedback
            const chart = document.querySelector('.mock-chart');
            if (chart) {
                chart.innerHTML = `Mood logged: <strong>${mood}</strong>. Graph updated.`;
                chart.style.background = 'linear-gradient(to right, rgba(88,195,137,0.1), rgba(88,195,137,0.3))';
                chart.style.borderColor = 'rgba(88,195,137,0.5)';
            }
        },

        calcStress: function() {
            const stressLevel = parseInt(document.getElementById('stress-slider').value);
            const sleepHours = document.getElementById('sleep-hours').value;
            
            let score = stressLevel;
            if (sleepHours === "bad") score += 2;
            if (sleepHours === "good") score -= 1;
            
            score = Math.max(1, Math.min(10, score));
            
            const res = document.getElementById('stress-result');
            res.innerText = `Estimated Stress Score: ${score}/10`;
            if (score > 7) {
                res.style.color = "var(--accent-red)";
                res.innerText += " - High stress. Consider reaching out.";
            } else if (score > 4) {
                res.style.color = "var(--accent)";
                res.innerText += " - Moderate stress. Try meditating.";
            } else {
                res.style.color = "var(--accent-green)";
            }
        },

        timerInterval: null,
        startTimer: function(seconds) {
            this.stopTimer();
            let remaining = seconds;
            const display = document.getElementById('med-timer');
            const inst = document.getElementById('med-instruction');
            inst.innerText = "Breathe in slowly... and out...";
            
            const updateDisplay = () => {
                const m = Math.floor(remaining / 60).toString().padStart(2, '0');
                const s = (remaining % 60).toString().padStart(2, '0');
                display.innerText = `${m}:${s}`;
            };
            
            updateDisplay();
            this.timerInterval = setInterval(() => {
                remaining--;
                if(remaining < 0) {
                    this.stopTimer();
                    display.innerText = "00:00";
                    inst.innerText = "Session complete. Great job!";
                    return;
                }
                updateDisplay();
                
                if (remaining % 8 < 4) {
                    inst.innerText = "Breathe in...";
                } else {
                    inst.innerText = "Breathe out...";
                }
            }, 1000);
        },

        stopTimer: function() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            document.getElementById('med-instruction').innerText = "Session stopped.";
        },

        saveJournal: function() {
            const text = document.getElementById('journal-text').value;
            if (text.trim() === '') return;
            
            alert('Journal entry saved successfully!');
            document.getElementById('journal-text').value = '';
        },

        /**
         * View Controller
         * Handles routing between different single-page views (SPA approach).
         * Hides all sections and displays the target one, while handling specific
         * side-effects like initializing charts when navigating to the tracking view.
         * 
         * @param {string} viewId - The ID prefix of the view section to show.
         */
        toggleView: function (viewId) {
            if (this.currentView === viewId) return;

            // Get all views
            const views = document.querySelectorAll('.view');

            // Hide all views
            views.forEach(view => {
                view.classList.remove('active-view');
            });

            // Show target view
            const targetView = document.getElementById(`${viewId}-view`);
            if (targetView) {
                targetView.classList.add('active-view');
                this.currentView = viewId;

                // Extra actions on view change
                if (viewId === 'dashboard' || viewId === 'tracking') {
                    window.scrollTo(0, 0);
                    animateDashboardData();
                    
                    if (viewId === 'tracking' && !window.app.vitalsChartInstance) {
                        setTimeout(initVitalsChart, 100); // Small delay to ensure canvas is visible
                    }
                } else if (viewId === 'landing') {
                    window.scrollTo(0, 0);
                }
            }
        }
    };

    // Smooth Scrolling for anchor links in Landing Page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Global click listener to close dropdowns
    window.addEventListener('click', (e) => {
        const dropdown = document.getElementById('profile-dropdown');
        const profileTarget = e.target.closest('.user-profile-nav');
        if (dropdown && dropdown.classList.contains('show') && !profileTarget) {
            dropdown.classList.remove('show');
        }
    });

    /**
     * Dashboard Data Simulation
     * -------------------------
     * Simulates real-time tracking of vitals by subtly updating
     * the heart rate numbers after short intervals.
     */
    function animateDashboardData() {
        // Find Heart Rate value element
        const hrElement = document.querySelector('.dash-grid .kpi-card:nth-child(1) h3');
        if (!hrElement) return;

        // Simple interval to slightly change the HR value to simulate "live tracking"
        setInterval(() => {
            const baseHR = 72;
            const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newHR = baseHR + variance;
            hrElement.innerHTML = `${newHR} <span class="unit">bpm</span>`;
        }, 3000);
        
        // Initialize Vitals Chart if visiting tracking view
        if (window.app.currentView === 'tracking' && !window.app.vitalsChartInstance) {
            initVitalsChart();
        }
    }

    /**
     * Vitals Chart Manager (Chart.js)
     * -------------------------------
     * Initializes and configures the tracking chart for heart rate
     * and blood pressure trends across the last month.
     */
    window.app.vitalsChartInstance = null;
    
    function initVitalsChart() {
        const ctx = document.getElementById('vitalsChart');
        if (!ctx) return;

        const data = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Heart Rate (bpm)',
                    data: [70, 75, 72, 68],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4
                },
                {
                    label: 'Systolic BP (mmHg)',
                    data: [122, 118, 120, 115],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4
                },
                {
                    label: 'Diastolic BP (mmHg)',
                    data: [82, 79, 80, 78],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4
                }
            ]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        };

        window.app.vitalsChartInstance = new Chart(ctx, config);
    }

    // Add new vital data to the chart
    window.app.addVitalData = function() {
        const dateInput = document.getElementById('vital-date').value;
        const hrInput = document.getElementById('vital-hr').value;
        const sysInput = document.getElementById('vital-sys').value;
        const diaInput = document.getElementById('vital-dia').value;

        if (!dateInput || !hrInput || !sysInput || !diaInput) {
            alert('Please fill in all the vital data fields (Date, Heart Rate, Systolic BP, Diastolic BP) to add data to the graph.');
            return;
        }

        // Format Date (simple format to just show MM/DD)
        const dateObj = new Date(dateInput);
        const dateString = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

        if (window.app.vitalsChartInstance) {
            const chart = window.app.vitalsChartInstance;
            
            // Add Label
            chart.data.labels.push(dateString);
            
            // Add Data
            chart.data.datasets[0].data.push(parseInt(hrInput));
            chart.data.datasets[1].data.push(parseInt(sysInput));
            chart.data.datasets[2].data.push(parseInt(diaInput));
            
            // Update Chart
            chart.update();
            
            // Clear inputs
            document.getElementById('vital-date').value = '';
            document.getElementById('vital-hr').value = '';
            document.getElementById('vital-sys').value = '';
            document.getElementById('vital-dia').value = '';
            
            alert('New health data added to the graph successfully!');
        } else {
             alert('Graph not initialized yet.');
        }
    };


    // Toggle Checkboxes for Reminders
    function attachCheckboxListeners() {
        const checkButtons = document.querySelectorAll('.btn-check');
        checkButtons.forEach(btn => {
            // Remove existing to avoid duplicates
            btn.removeEventListener('click', toggleCheck);
            btn.addEventListener('click', toggleCheck);
        });
    }

    function toggleCheck() {
        if (this.style.backgroundColor === 'var(--accent-green)') {
            // Uncheck
            this.style.backgroundColor = 'white';
            this.style.borderColor = '#cbd5e1';
            this.style.color = 'transparent';
            this.closest('.reminder-item').style.opacity = '1';
        } else {
            // Check
            this.style.backgroundColor = 'var(--accent-green)';
            this.style.borderColor = 'var(--accent-green)';
            this.style.color = 'white';
            this.closest('.reminder-item').style.opacity = '0.6';
        }
    }

    attachCheckboxListeners();

    /**
     * Smart Reminders & Medications Engine
     * ------------------------------------
     * Handles the creation, tracking, and execution of medication reminders.
     * Includes an escalation mechanism: if a dose is missed multiple times,
     * it triggers an automated emergency alert to saved contacts.
     */
    const saveReminderBtn = document.getElementById('save-reminder-btn');
    const dashboardReminderList = document.getElementById('dashboard-reminder-list');
    const fullReminderList = document.getElementById('full-reminder-list');
    const reminderNameInput = document.getElementById('reminder-name');
    const reminderTimeInput = document.getElementById('reminder-time');

    let reminders = []; // Array to hold reminder objects

    if (saveReminderBtn) {
        // Save New Reminder
        saveReminderBtn.addEventListener('click', () => {
            const name = reminderNameInput.value.trim();
            const timeVal = reminderTimeInput.value;

            if (!name || !timeVal) {
                alert('Please enter both medication name and time.');
                return;
            }

            // Create a date object for the reminder time today
            const now = new Date();
            const [hours, minutes] = timeVal.split(':');
            const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

            // If time has already passed today, set it for tomorrow
            if (reminderTime < now) {
                reminderTime.setDate(reminderTime.getDate() + 1);
            }

            const newReminder = {
                id: Date.now(),
                name: name,
                time: reminderTime,
                timeString: formatAMPM(reminderTime),
                triggered: false,
                completed: false,
                missedCount: 0,
                nextAlertTime: null
            };

            reminders.push(newReminder);
            renderReminders();

            // Reset form
            reminderNameInput.value = '';
            reminderTimeInput.value = '';

            // Redirect back to dashboard to see it on the widget
            window.app.toggleView('dashboard');
        });
    }

    // Format time to 12-hour AM/PM
    function formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    // Helper to generic HTML for a reminder item
    function createReminderHTML(rem) {
        return `
            <div class="rem-info">
                <h4>${rem.name}</h4>
                <p class="time-remaining" id="time-rem-${rem.id}">Calculating...</p>
            </div>
            <div class="rem-time">${rem.timeString}</div>
            <button class="btn-check" data-id="${rem.id}"><i class="ph ph-check"></i></button>
        `;
    }

    // Render reminders to the DOM
    function renderReminders() {
        if (reminders.length === 0) return;

        if (dashboardReminderList) dashboardReminderList.innerHTML = '';
        if (fullReminderList) fullReminderList.innerHTML = '';

        // Sort by time
        reminders.sort((a, b) => a.time - b.time);

        reminders.forEach(rem => {
            // Add to dashboard widget (limit to 3 maybe)
            if (dashboardReminderList) {
                const dashLi = document.createElement('li');
                dashLi.className = `reminder-item ${rem.triggered ? 'over-due' : 'pending'} dash-rem-${rem.id}`;
                dashLi.innerHTML = createReminderHTML(rem);
                dashboardReminderList.appendChild(dashLi);
            }

            // Add to full page view
            if (fullReminderList) {
                const fullLi = document.createElement('li');
                fullLi.className = `reminder-item ${rem.triggered ? 'over-due' : 'pending'} full-rem-${rem.id}`;
                fullLi.innerHTML = createReminderHTML(rem);
                fullReminderList.appendChild(fullLi);
            }
        });

        attachCheckboxListeners();
        updateTimeRemaining(); // initial update
    }

    // Update time remaining text and check for alerts
    function updateTimeRemaining() {
        if (reminders.length === 0) return;

        const now = new Date();

        reminders.forEach(rem => {
            if (rem.completed) return;

            // Which time are we counting down to? The initial time, or the next missed alert time?
            const targetTime = rem.nextAlertTime ? rem.nextAlertTime : rem.time;
            const timeDiffMs = targetTime - now;

            // We need to update all instances of the time-rem id since there are duplicates now
            const timeSpanElements = document.querySelectorAll(`#time-rem-${rem.id}`);

            let timeStr = "";
            let color = "";

            if (timeDiffMs <= 0) {
                // Time is up!
                if (!rem.triggered) {
                    rem.triggered = true;
                    rem.missedCount += 1;

                    if (rem.missedCount === 1) {
                        // First time it goes off
                        alert(`⏰ TIME FOR MEDICATION: It's time to take your ${rem.name}!`);
                    } else if (rem.missedCount <= 3) {
                        // 2nd or 3rd warning
                        alert(`⚠️ MISSED MEDICATION (${rem.missedCount}/3): You still haven't taken your ${rem.name}!`);
                    } else {
                        // Escalation! Missed 3 times (initial + 30m + 60m + 90m = 4th trigger)
                        triggerEmergencyCall(rem.name);
                        rem.completed = true; // Stop tracking after escalation
                        renderReminders();
                        return;
                    }

                    // Set next alert time for 30 minutes from now if not escalated
                    if (rem.missedCount <= 3) {
                        rem.nextAlertTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 mins
                        rem.triggered = false; // Reset trigger for next countdown
                    }

                    renderReminders(); // re-render to change style to overdue
                }

                timeStr = rem.missedCount > 0 ? `Missed! Next alert in: ` : "Time is up!";
                color = "var(--accent-red)";
            } else {
                // Calculate hours, minutes, seconds for countdown
                const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiffMs % (1000 * 60)) / 1000);

                if (rem.missedCount > 0) {
                    timeStr = `Missed (x${rem.missedCount}). Next alert: `;
                    color = "var(--accent-red)";
                } else {
                    color = "var(--text-muted)";
                }

                if (hours > 0) timeStr += `${hours}h `;
                if (minutes > 0) timeStr += `${minutes}m `;
                timeStr += `${seconds}s`;
            }

            if (timeSpanElements.length > 0) {
                timeSpanElements.forEach(el => {
                    el.textContent = timeStr;
                    el.style.color = color;
                });
            }
        });
    }

    // Emergency Contacts Logic
    let contacts = [];
    const saveContactBtn = document.getElementById('save-contact-btn');
    const contactNameInput = document.getElementById('contact-name');
    const contactNumberInput = document.getElementById('contact-number');
    const contactsList = document.getElementById('contacts-list');

    if (saveContactBtn) {
        saveContactBtn.addEventListener('click', () => {
            const name = contactNameInput.value.trim();
            const number = contactNumberInput.value.trim();

            if (!name || !number) {
                alert('Please enter both Contact Name and Mobile Number.');
                return;
            }

            contacts.push({ name, number });

            contactNameInput.value = '';
            contactNumberInput.value = '';

            renderContacts();
        });
    }

    function renderContacts() {
        if (!contactsList) return;

        if (contacts.length === 0) {
            contactsList.innerHTML = `
                <li class="reminder-item pending">
                    <div class="rem-info" style="color: var(--text-muted);">
                        No emergency contacts saved yet.
                    </div>
                </li>
            `;
            return;
        }

        contactsList.innerHTML = '';
        contacts.forEach((contact, index) => {
            contactsList.innerHTML += `
                <li class="reminder-item">
                    <div class="rem-info">
                        <h4>${contact.name}</h4>
                        <p style="color: var(--text-muted); font-family: monospace;">${contact.number}</p>
                    </div>
                    <button class="btn-icon" style="color: var(--accent-red);" onclick="removeContact(${index})"><i class="ph ph-trash"></i></button>
                </li>
            `;
        });
    }

    // Assign globally to be called from inline onclick
    window.removeContact = function (index) {
        contacts.splice(index, 1);
        renderContacts();
    }

    // Trigger Emergency Call
    function triggerEmergencyCall(medName) {
        if (contacts.length === 0) {
            alert(`🚨 EMERGENCY ESCALATION FAILED 🚨\nYou missed '${medName}' 3 times, but no emergency contacts are saved!`);
        } else {
            const contact = contacts[0]; // Just call the first one for demo
            alert(`🚨 AUTOMATIC EMERGENCY CALL 🚨\nCalling ${contact.name} (${contact.number})...\n\nMessage: "Your relative has missed their '${medName}' dosage 3 times in a row."`);
        }
    }

    // Timer to update remaining time every second
    setInterval(updateTimeRemaining, 1000);

    // Initial dummy data to show functionality right away if they type nothing
    const now = new Date();
    // Add a demo reminder 10 seconds from now
    // Add a demo reminder specifically for escalating really fast (every 5 seconds) to demo it
    const fastDemoTime = new Date(now.getTime() + 5000);
    reminders.push({
        id: Date.now() + 1,
        name: "Demo Fast Pill (Fast Escalation)",
        time: fastDemoTime,
        timeString: formatAMPM(fastDemoTime),
        triggered: false,
        completed: false,
        missedCount: 0,
        nextAlertTime: null
    });

    // Add another demo reminder farther in the future
    const demoTime2 = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    reminders.push({
        id: Date.now() + 2,
        name: "Evening Supplement",
        time: demoTime2,
        timeString: formatAMPM(demoTime2),
        triggered: false,
        completed: false,
        missedCount: 0,
        nextAlertTime: null
    });

    // Render initial state
    renderReminders();

    // End of Smart Reminders Logic

    // Navigation Active State Update on Scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        if (window.app.currentView !== 'landing') return;

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            } else if (current === 'landing-view' && a.getAttribute('href') === '#') {
                a.classList.add('active');
            }
        });
    });
});
