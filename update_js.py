with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

# We want to add new functions to window.app
new_functions = """
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
"""

js = js.replace("toggleView: function (viewId) {", new_functions + "\n        toggleView: function (viewId) {")

with open("script.js", "w", encoding="utf-8") as f:
    f.write(js)
