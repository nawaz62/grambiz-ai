import sys

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

ow.app.toggleView('dashboard')"><i class="ph ph-squares-four"></i> Overview
                        </li>
                        <li class="active"><i class="ph ph-bell-ringing"></i> Reminders</li>
                        <li><i class="ph ph-activity"></i> Vitals</li>
                        <li><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>"""

reminders_nav_new = """                    <ul class="sidebar-nav">
                        <li onclick="window.app.toggleView('dashboard')"><i class="ph ph-squares-four"></i> Overview</li>
                        <li class="active"><i class="ph ph-bell-ringing"></i> Reminders</li>
                        <li onclick="window.app.toggleView('emergency')"><i class="ph ph-warning-circle"></i> Emergency</li>
                        <li onclick="window.app.toggleView('mental-wellbeing')"><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li onclick="window.app.toggleView('nutrition')"><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>"""


emergency_nav_old = """                    <ul class="sidebar-nav">
                        <li onclick="window.app.toggleView('dashboard')"><i class="ph ph-squares-four"></i> Overview
                        </li>
                        <li onclick="window.app.toggleView('reminders')"><i class="ph ph-bell-ringing"></i> Reminders
                        </li>
                        <li class="active"><i class="ph ph-warning-circle"></i> Emergency</li>
                        <li><i class="ph ph-activity"></i> Vitals</li>
                        <li><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>"""

emergency_nav_new = """                    <ul class="sidebar-nav">
                        <li onclick="window.app.toggleView('dashboard')"><i class="ph ph-squares-four"></i> Overview</li>
                        <li onclick="window.app.toggleView('reminders')"><i class="ph ph-bell-ringing"></i> Reminders</li>
                        <li class="active"><i class="ph ph-warning-circle"></i> Emergency</li>
                        <li onclick="window.app.toggleView('mental-wellbeing')"><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li onclick="window.app.toggleView('nutrition')"><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>"""

html = html.replace(dashboard_nav_old, dashboard_nav_new)
html = html.replace(reminders_nav_old, reminders_nav_new)
html = html.replace(emergency_nav_old, emergency_nav_new)

# Insert new views

new_views = """
        <!-- ======================= -->
        <!-- NUTRITION VIEW          -->
        <!-- ======================= -->
        <section id="nutrition-view" class="view">
            <div class="dashboard-layout">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h2>Dashboard</h2># 1. Update sidebars
dashboard_nav_old = """                    <ul class="sidebar-nav">
                        <li class="active"><i class="ph ph-squares-four"></i> Overview</li>
                        <li><i class="ph ph-activity"></i> Vitals</li>
                        <li><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>"""

dashboard_nav_new = """                    <ul class="sidebar-nav">
                        <li class="active"><i class="ph ph-squares-four"></i> Overview</li>
                        <li onclick="window.app.toggleView('reminders')"><i class="ph ph-bell-ringing"></i> Reminders</li>
                        <li onclick="window.app.toggleView('emergency')"><i class="ph ph-warning-circle"></i> Emergency</li>
                        <li onclick="window.app.toggleView('mental-wellbeing')"><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li onclick="window.app.toggleView('nutrition')"><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>"""

reminders_nav_old = """                    <ul class="sidebar-nav">
                        <li onclick="wind
                    </div>
                    <ul class="sidebar-nav">
                        <li onclick="window.app.toggleView('dashboard')"><i class="ph ph-squares-four"></i> Overview</li>
                        <li onclick="window.app.toggleView('reminders')"><i class="ph ph-bell-ringing"></i> Reminders</li>
                        <li onclick="window.app.toggleView('emergency')"><i class="ph ph-warning-circle"></i> Emergency</li>
                        <li onclick="window.app.toggleView('mental-wellbeing')"><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li class="active" onclick="window.app.toggleView('nutrition')"><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>
                    <div class="sidebar-footer">
                        <button class="btn-secondary full-width" onclick="window.app.toggleView('landing')">
                            <i class="ph ph-sign-out"></i> Exit App
                        </button>
                    </div>
                </aside>

                <div class="dashboard-content">
                    <header class="dash-header">
                        <div class="greeting">
                            <h1>Your Diet & Nutrition Plan 🥗</h1>
                            <p>Here is what you need to eat to stay healthy.</p>
                        </div>
                    </header>

                    <div class="dash-grid diet-grid">
                        <div class="widget glass-panel span-2">
                            <div class="widget-header">
                                <h3><i class="ph ph-sun"></i> Morning / Breakfast</h3>
                            </div>
                            <ul class="diet-list">
                                <li><strong>Oatmeal with Berries:</strong> High fiber and antioxidants for energy.</li>
                                <li><strong>Boiled Eggs (2):</strong> Great source of protein.</li>
                                <li><strong>Green Tea:</strong> Boosts metabolism naturally.</li>
                            </ul>
                        </div>
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-drop"></i> Hydration Track</h3>
                            </div>
                            <div class="hydration-circle">
                                <h2>1.5L</h2>
                                <p>out of 2.5L</p>
                            </div>
                        </div>

                        <div class="widget glass-panel span-2">
                            <div class="widget-header">
                                <h3><i class="ph ph-bowl-food"></i> Lunch</h3>
                            </div>
                            <ul class="diet-list">
                                <li><strong>Grilled Chicken or Tofu Salad:</strong> Lean protein with mixed greens.</li>
                                <li><strong>Quinoa / Brown Rice:</strong> Complex carbohydrates for sustained energy.</li>
                                <li><strong>Greek Yogurt:</strong> Probiotics for gut health.</li>
                            </ul>
                        </div>
                        <div class="widget glass-panel" style="background: linear-gradient(135deg, var(--accent-green), #2db575); color: white;">
                            <div class="widget-header">
                                <h3 style="color: white;"><i class="ph ph-leaf"></i> Diet Tip</h3>
                            </div>
                            <p style="opacity: 0.9;">Eat slowly and chew your food thoroughly to improve digestion and prevent overeating.</p>
                        </div>

                        <div class="widget glass-panel span-3">
                            <div class="widget-header">
                                <h3><i class="ph ph-moon-stars"></i> Dinner</h3>
                            </div>
                            <ul class="diet-list">
                                <li><strong>Baked Salmon or Lentil Soup:</strong> Rich in Omega-3 or plant-based protein.</li>
                                <li><strong>Steamed Vegetables:</strong> Broccoli, carrots, and spinach.</li>
                                <li><strong>Avoid heavy carbs</strong> before bedtime to improve sleep quality.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ======================= -->
        <!-- MENTAL WELLBEING VIEW   -->
        <!-- ======================= -->
        <section id="mental-wellbeing-view" class="view">
            <div class="dashboard-layout">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h2>Dashboard</h2>
                    </div>
                    <ul class="sidebar-nav">
                        <li onclick="window.app.toggleView('dashboard')"><i class="ph ph-squares-four"></i> Overview</li>
                        <li onclick="window.app.toggleView('reminders')"><i class="ph ph-bell-ringing"></i> Reminders</li>
                        <li onclick="window.app.toggleView('emergency')"><i class="ph ph-warning-circle"></i> Emergency</li>
                        <li class="active" onclick="window.app.toggleView('mental-wellbeing')"><i class="ph ph-brain"></i> Mental Wellbeing</li>
                        <li onclick="window.app.toggleView('nutrition')"><i class="ph ph-apple-logo"></i> Nutrition</li>
                        <li><i class="ph ph-gear"></i> Settings</li>
                    </ul>
                    <div class="sidebar-footer">
                        <button class="btn-secondary full-width" onclick="window.app.toggleView('landing')">
                            <i class="ph ph-sign-out"></i> Exit App
                        </button>
                    </div>
                </aside>

                <div class="dashboard-content">
                    <header class="dash-header">
                        <div class="greeting">
                            <h1>Mental Wellbeing ❤️</h1>
                            <p>Track your mood, reduce stress, and find inner peace.</p>
                        </div>
                    </header>

                    <div class="dash-grid mw-grid" style="grid-template-columns: repeat(3, 1fr);">
                        
                        <!-- 1. Mood Tracking -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-smiley"></i> 1. Mood Tracking</h3>
                            </div>
                            <p class="mb-3 text-muted">How are you feeling right now?</p>
                            <div class="mood-selectors">
                                <button class="mood-btn" onclick="app.setMood('Happy', this)">😊<span>Happy</span></button>
                                <button class="mood-btn" onclick="app.setMood('Calm', this)">😌<span>Calm</span></button>
                                <button class="mood-btn" onclick="app.setMood('Sad', this)">😢<span>Sad</span></button>
                                <button class="mood-btn" onclick="app.setMood('Stressed', this)">😫<span>Stressed</span></button>
                            </div>
                            <div class="mt-4">
                                <h4>Mood Trend</h4>
                                <div class="mock-chart">Graph tracking mood over time</div>
                            </div>
                        </div>

                        <!-- 2. Stress Level -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-thermometer"></i> 2. Stress Monitor</h3>
                            </div>
                            <div class="stress-form form-group">
                                <label style="display: block; margin-bottom: 0.5rem;" class="text-muted">How stressed do you feel today? (1-10)</label>
                                <input type="range" min="1" max="10" value="5" class="slider" id="stress-slider" oninput="document.getElementById('stress-val').innerText = this.value">
                                <div class="slider-val">Score: <span id="stress-val">5</span>/10</div>

                                <label class="mt-3 text-muted" style="display: block;">How many hours did you sleep?</label>
                                <select class="form-control" id="sleep-hours">
                                    <option value="good">> 8 hours</option>
                                    <option value="ok">6-8 hours</option>
                                    <option value="bad">< 6 hours</option>
                                </select>

                                <button class="btn-primary mt-3 w-100 justify-center" onclick="app.calcStress()">Check Stress Score</button>
                                <div id="stress-result" class="mt-3 text-center fw-bold text-primary"></div>
                            </div>
                        </div>

                        <!-- 3. Mental Health Questionnaire -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-clipboard-text"></i> 3. Clinical Screenings</h3>
                            </div>
                            <p class="text-muted mb-3">Short validated tests to detect early issues.</p>
                            <div class="screening-tests" style="display: flex; flex-direction: column; gap: 1rem;">
                                <div class="test-card" style="display: flex; justify-content: space-between; align-items: center; text-align: left;">
                                    <div>
                                        <h4 style="margin:0;">PHQ-9</h4>
                                        <p style="margin:0; font-size:0.8rem;">Depression Screening</p>
                                    </div>
                                    <button class="btn-secondary small" onclick="alert('Starting PHQ-9 Questionnaire...')">Start Test</button>
                                </div>
                                <div class="test-card" style="display: flex; justify-content: space-between; align-items: center; text-align: left;">
                                    <div>
                                        <h4 style="margin:0;">GAD-7</h4>
                                        <p style="margin:0; font-size:0.8rem;">Anxiety Screening</p>
                                    </div>
                                    <button class="btn-secondary small" onclick="alert('Starting GAD-7 Questionnaire...')">Start Test</button>
                                </div>
                            </div>
                        </div>

                        <!-- 4. Meditation & Breathing -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-wind"></i> 4. Meditation 🧘</h3>
                            </div>
                            <div class="meditation-box text-center">
                                <div class="timer-display" id="med-timer">02:00</div>
                                <p class="mb-3 text-muted" id="med-instruction">Guided breathing & relaxation.</p>
                                <div class="btn-group gap-2 justify-center" style="display: flex;">
                                    <button class="btn-primary small" onclick="app.startTimer(120)">2 Min</button>
                                    <button class="btn-primary small" onclick="app.startTimer(300)">5 Min</button>
                                    <button class="btn-secondary small" onclick="app.stopTimer()"><i class="ph ph-stop"></i></button>
                                </div>
                            </div>
                        </div>

                        <!-- 5. Sleep Tracking -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-moon"></i> 5. Sleep Tracking 😴</h3>
                            </div>
                            <div class="sleep-stats">
                                <div class="stat-row mb-2">
                                    <span class="text-muted">Last Night:</span>
                                    <strong>7h 30m</strong>
                                </div>
                                <div class="progress-bar-bg mt-2 mb-3">
                                    <div class="progress-fill positive" style="width: 85%;">Quality: 85%</div>
                                </div>
                                <div class="suggestion-box mt-3">
                                    <i class="ph ph-lightbulb text-orange mt-1" style="font-size: 1.2rem;"></i>
                                    <span>Avoid screens 1h before bed for better deep sleep.</span>
                                </div>
                            </div>
                        </div>

                        <!-- 6. Daily Journal -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-book-open"></i> 6. Thought Diary</h3>
                            </div>
                            <textarea id="journal-text" class="journal-input" placeholder="Write your feelings or thoughts here... Helps emotional release."></textarea>
                            <button class="btn-primary small mt-2 w-100 justify-center" onclick="app.saveJournal()">Save Entry</button>
                        </div>

                        <!-- 7. AI Suggestions -->
                        <div class="widget glass-panel" style="background: linear-gradient(135deg, var(--bg-main), #e0e7ff);">
                            <div class="widget-header">
                                <h3><i class="ph ph-sparkle"></i> 7. AI Insights</h3>
                            </div>
                            <div class="ai-suggestion">
                                <p class="quote" id="ai-quote">"Peace comes from within. Do not seek it without."</p>
                                <ul class="tips-list">
                                    <li><i class="ph ph-check-circle"></i> Try a 5-min breathing exercise right now.</li>
                                    <li><i class="ph ph-check-circle"></i> Your stress is slightly elevated, consider herbal tea.</li>
                                </ul>
                            </div>
                        </div>

                        <!-- 8. Emergency Help -->
                        <div class="widget glass-panel emergency-urgent text-center flex-column justify-center" style="display: flex; flex-direction: column;">
                            <div class="widget-header" style="justify-content: center;">
                                <h3 class="text-red" style="margin: 0;"><i class="ph ph-phone-call"></i> 8. Emergency Help</h3>
                            </div>
                            <p class="mb-3 mt-2 text-muted">Feeling overwhelmed? Reach out immediately.</p>
                            <button class="btn-primary w-100 bg-red mb-2 text-white justify-center" style="background: var(--accent-red);" onclick="alert('Calling Mental Health Helpline...')"><i class="ph ph-phone text-white"></i> Call Helpline (104)</button>
                            <button class="btn-secondary w-100 justify-center" onclick="window.app.toggleView('emergency')">Contact Trusted Person</button>
                        </div>

                        <!-- 9. Progress Dashboard -->
                        <div class="widget glass-panel">
                            <div class="widget-header">
                                <h3><i class="ph ph-chart-line-up"></i> 9. Weekly Progress 📊</h3>
                            </div>
                            <div class="progress-summary" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0;">
                                <div class="ps-card" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem;">
                                    <h4 style="margin: 0;">Mood Trend</h4>
                                    <p class="text-green" style="margin: 0; font-size: 1rem;">Mostly Happy <i class="ph ph-trend-up"></i></p>
                                </div>
                                <div class="ps-card" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem;">
                                    <h4 style="margin: 0;">Avg. Stress Level</h4>
                                    <p class="text-orange" style="margin: 0; font-size: 1rem;">Moderate (4/10)</p>
                                </div>
                                <div class="ps-card" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem;">
                                    <h4 style="margin: 0;">Avg. Sleep</h4>
                                    <p class="text-green" style="margin: 0; font-size: 1rem;">7.2 hrs/night</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
"""

if 'id="nutrition-view"' not in html:
    html = html.replace('    </main>', new_views + '\n    </main>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
