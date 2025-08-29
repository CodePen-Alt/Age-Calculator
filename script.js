// Age Calculator JavaScript
// Author: GitHub Copilot
// Handles age calculation, UI updates, dark mode, validation, copy/share, and animations

// DOM Elements
const dobInput = document.getElementById('dob');
const ageForm = document.getElementById('age-form');
const resultSection = document.getElementById('result-section');
const resultCard = document.getElementById('result-card');
const exactAge = document.getElementById('exact-age');
const ageMonths = document.getElementById('age-months');
const ageWeeks = document.getElementById('age-weeks');
const ageDays = document.getElementById('age-days');
const todayDate = document.getElementById('today-date');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');

// Set max date for DOB input (today)
const today = new Date();
dobInput.max = today.toISOString().split('T')[0];

// Show today's date
function formatDate(date) {
    return date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });
}
todayDate.textContent = `Today: ${formatDate(today)}`;

// Age calculation logic
function calculateAge(dobStr) {
    const dob = new Date(dobStr);
    const now = new Date();
    if (dob > now) return null;

    // Years, months, days
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Total months, weeks, days
    const totalMonths = years * 12 + months;
    const diffMs = now - dob;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    return {
        years, months, days, totalMonths, totalWeeks, totalDays
    };
}

// Fade-in animation for result card
function showResultCard() {
    resultSection.hidden = false;
    resultCard.style.animation = 'none';
    void resultCard.offsetWidth; // trigger reflow
    resultCard.style.animation = null;
}

// Handle form submit
ageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const dobValue = dobInput.value;
    if (!dobValue) return;
    const age = calculateAge(dobValue);
    if (!age) {
        exactAge.textContent = 'Please select a valid date of birth.';
        ageMonths.textContent = '';
        ageWeeks.textContent = '';
        ageDays.textContent = '';
        showResultCard();
        return;
    }
    exactAge.textContent = `${age.years} years, ${age.months} months, ${age.days} days`;
    ageMonths.textContent = `Total Months: ${age.totalMonths}`;
    ageWeeks.textContent = `Total Weeks: ${age.totalWeeks}`;
    ageDays.textContent = `Total Days: ${age.totalDays}`;
    showResultCard();
});

// Dark/Light mode toggle
function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeIcon.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('agecalc-theme', dark ? 'dark' : 'light');
}
// Load theme from localStorage
setTheme(localStorage.getItem('agecalc-theme') === 'dark');
themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
});

// Copy result to clipboard
copyBtn.addEventListener('click', () => {
    const text = `${exactAge.textContent}\n${ageMonths.textContent}\n${ageWeeks.textContent}\n${ageDays.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 1200);
    });
});

// Share result (Web Share API)
shareBtn.addEventListener('click', () => {
    const text = `${exactAge.textContent}\n${ageMonths.textContent}\n${ageWeeks.textContent}\n${ageDays.textContent}`;
    if (navigator.share) {
        navigator.share({
            title: 'My Age',
            text,
            url: window.location.href
        });
    } else {
        shareBtn.textContent = 'Not Supported';
        setTimeout(() => shareBtn.textContent = 'Share', 1200);
    }
});

// Accessibility: focus on DOB input on load
window.addEventListener('DOMContentLoaded', () => {
    dobInput.focus();
});
