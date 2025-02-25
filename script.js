// Initialize map
let map;
let marker;

// Login state management
let isLoggedIn = false;
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');

function initMap() {
    map = L.map('map').setView([28.2096, 83.9856], 13); // Default center in Pokhara
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // Add click event to map
    map.on('click', function(e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
        document.getElementById('location').value = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
    });
}

// Navigation
function showSection(sectionId) {
    if (sectionId === 'report-section' && !isLoggedIn) {
        openLoginModal();
        return;
    }

    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update active nav link
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });

    // Initialize map if showing report section
    if (sectionId === 'report-section' && !map) {
        initMap();
    }

    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('active');
}

// Mobile navigation toggle
function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Form submission
document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('problem-type').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };

    // Here you would typically send the data to your backend
    console.log('Report submitted:', formData);
    alert('Report submitted successfully!');
    this.reset();
    if (marker) {
        map.removeLayer(marker);
    }
});

// Login functionality
function openLoginModal() {
    loginModal.style.display = 'block';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you would typically make an API call to validate credentials
    // For demo purposes, we'll just set isLoggedIn to true
    isLoggedIn = true;
    loginBtn.textContent = 'Logout';
    loginBtn.onclick = handleLogout;
    closeLoginModal();
    updateUIBasedOnAuth();
}

function handleLogout() {
    isLoggedIn = false;
    loginBtn.textContent = 'Login';
    loginBtn.onclick = openLoginModal;
    showSection('home-section');
    updateUIBasedOnAuth();
}

function updateUIBasedOnAuth() {
    const reportSection = document.getElementById('report-section');
    const reportForm = document.getElementById('report-form');
    
    if (!isLoggedIn) {
        // If user tries to access report section while not logged in
        if (reportSection.classList.contains('active')) {
            showSection('home-section');
            alert('Please login to report issues');
        }
        
        // Disable report form
        if (reportForm) {
            reportForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                element.disabled = true;
            });
        }
    } else {
        // Enable report form
        if (reportForm) {
            reportForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                element.disabled = false;
            });
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === loginModal) {
        closeLoginModal();
    }
}

// Initialize UI based on auth state when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateUIBasedOnAuth();
});

// Initialize map when the page loads
window.addEventListener('load', function() {
    if (document.getElementById('map').offsetParent !== null) {
        initMap();
    }
});

// Function to format relative time
function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Function to create a report card
function createReportCard(report) {
    return `
        <div class="report-card">
            <div class="report-header">
                <span class="report-type">${report.type}</span>
                <span class="report-status ${report.status}">${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
            </div>
            <div class="report-content">
                <img src="${report.image}" alt="Report Image" class="report-image">
                <div class="report-details">
                    <h3>${report.title}</h3>
                    <p class="location">📍 ${report.location}</p>
                    <p class="description">${report.description}</p>
                    <p class="timestamp">Reported: ${getRelativeTime(report.timestamp)}</p>
                </div>
            </div>
        </div>
    `;
}

// Function to display reports
function displayReports(reports) {
    const reportsList = document.getElementById('reports-list');
    if (reports && reports.length > 0) {
        reportsList.innerHTML = reports.map(report => createReportCard(report)).join('');
    } else {
        reportsList.innerHTML = '<p class="no-reports">No reports available.</p>';
    }
}

// Initialize reports list when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayReports([]);
});
