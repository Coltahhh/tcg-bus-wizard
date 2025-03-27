// All your existing JavaScript code from the <script> tag
const tournaments = [/*...*/];
const rankings = [/*...*/];

function initTournamentList() { /*...*/ }
function showBracket(tournamentId) { /*...*/ }
function showTournamentList() { /*...*/ }
function initRankings() { /*...*/ }
function showSection(sectionId) { /*...*/ }
function initApp() { /*...*/ }

// Add your new API call functions
async function loadTournaments() {
    try {
        const response = await fetch('/api/tournaments');
        return await response.json();
    } catch (error) {
        console.error('Error loading tournaments:', error);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);