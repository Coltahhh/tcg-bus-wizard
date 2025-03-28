// script.js
// Initialize data storage and application state
let currentUser = null;

// Data initialization
if (!localStorage.getItem('tournaments')) {
    localStorage.setItem('tournaments', JSON.stringify([
        {
            id: 1,
            name: "Grand Line Cup 2023",
            date: "2023-11-15",
            participants: 8,
            bracket: {
                final: {
                    match1: {
                        players: ["Player A", "Player B"],
                        winner: "Player A",
                        children: ["semifinal1", "semifinal2"]
                    }
                },
                semifinal: {
                    semifinal1: {
                        players: ["Player A", "Player C"],
                        winner: "Player A",
                        children: ["quarterfinal1", "quarterfinal2"]
                    },
                    semifinal2: {
                        players: ["Player B", "Player D"],
                        winner: "Player B",
                        children: ["quarterfinal3", "quarterfinal4"]
                    }
                },
                quarterfinal: {
                    quarterfinal1: { players: ["Player A", "Player E"], winner: "Player A" },
                    quarterfinal2: { players: ["Player C", "Player F"], winner: "Player C" },
                    quarterfinal3: { players: ["Player B", "Player G"], winner: "Player B" },
                    quarterfinal4: { players: ["Player D", "Player H"], winner: "Player D" }
                }
            }
        }
    ]));
}

if (!localStorage.getItem('rankings')) {
    localStorage.setItem('rankings', JSON.stringify([
        { player: "Player A", points: 450, wins: 15 },
        { player: "Player B", points: 380, wins: 12 },
        { player: "Player C", points: 320, wins: 10 }
    ]));
}

// Core application functions
function showSection(sectionId, event) {
    if (event) event.preventDefault();
    const validSections = ['home', 'tournaments', 'ranking', 'prizing'];
    const targetSection = validSections.includes(sectionId) ? sectionId : 'home';

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(targetSection).classList.add('active');
    document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
    window.location.hash = targetSection;
}

function initTournamentList() {
    const container = document.getElementById('tournamentList');
    container.innerHTML = '';
    const tournaments = JSON.parse(localStorage.getItem('tournaments'));

    tournaments.forEach(tournament => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
      <div class="tournament-card card" onclick="showBracket(${tournament.id})">
        <div class="card-body">
          <h5 class="card-title">${tournament.name}</h5>
          <p class="card-text">${tournament.date}</p>
          <p class="card-text">${tournament.participants} Participants</p>
        </div>
      </div>
    `;
        container.appendChild(card);
    });
}

function showBracket(tournamentId) {
    const tournaments = JSON.parse(localStorage.getItem('tournaments'));
    const tournament = tournaments.find(t => t.id === tournamentId);

    document.getElementById('tournamentList').classList.add('d-none');
    document.getElementById('bracketView').classList.remove('d-none');

    const container = document.getElementById('bracketContainer');
    container.innerHTML = '';

    const rounds = ['quarterfinal', 'semifinal', 'final'];
    rounds.forEach(round => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        roundDiv.innerHTML = `<h4 class="text-center mb-4">${round.charAt(0).toUpperCase() + round.slice(1)}</h4>`;

        Object.values(tournament.bracket[round]).forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            match.players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = `player ${player === match.winner ? 'winner' : ''}`;
                playerDiv.textContent = player;
                matchDiv.appendChild(playerDiv);
            });
            roundDiv.appendChild(matchDiv);
        });
        container.appendChild(roundDiv);
    });
}

function showTournamentList() {
    document.getElementById('tournamentList').classList.remove('d-none');
    document.getElementById('bracketView').classList.add('d-none');
}

function updateRankings() {
    const tbody = document.getElementById('rankingBody');
    tbody.innerHTML = '';
    const rankings = JSON.parse(localStorage.getItem('rankings'));

    rankings.sort((a, b) => b.points - a.points).forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.player}</td>
      <td>${player.points}</td>
      <td>${player.wins}</td>
    `;
        tbody.appendChild(row);
    });
}

function handleTournamentSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const newTournament = {
        id: Date.now(),
        name: form[0].value,
        date: form[1].value,
        participants: parseInt(form[2].value),
        bracket: generateSimpleBracket(parseInt(form[2].value))
    };

    const tournaments = JSON.parse(localStorage.getItem('tournaments'));
    tournaments.push(newTournament);
    localStorage.setItem('tournaments', JSON.stringify(tournaments));

    form.reset();
    initTournamentList();
    bootstrap.Modal.getInstance(document.getElementById('createTournamentModal')).hide();
}

function generateSimpleBracket(participantCount) {
    return {
        final: {
            match1: {
                players: ["TBD", "TBD"],
                winner: null,
                children: []
            }
        }
    };
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    currentUser = "Guest";
    updateAuthState();
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
}

function handleSignup(e) {
    e.preventDefault();
    currentUser = "Guest";
    updateAuthState();
    bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
}

function updateAuthState() {
    const authBtn = document.querySelector('#loginDropdown');
    authBtn.textContent = currentUser ? `Welcome ${currentUser}` : 'Login/Signup';
}

// Event listeners and initialization
function initApp() {
    // Navigation
    window.addEventListener('hashchange', () => {
        const sectionId = window.location.hash.substring(1) || 'home';
        showSection(sectionId);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId, e);
        });
    });

    // Initial state
    const initialSection = window.location.hash.substring(1) || 'home';
    showSection(initialSection);
    initTournamentList();
    updateRankings();

    // Form handlers
    document.getElementById('tournamentForm').addEventListener('submit', handleTournamentSubmit);
    document.querySelector('#loginModal form').addEventListener('submit', handleLogin);
    document.querySelector('#signupModal form').addEventListener('submit', handleSignup);
}

// Start application
document.addEventListener('DOMContentLoaded', initApp);