// public/js/tournaments.js
export const renderTournaments = async () => {
    const container = document.getElementById('tournamentList');

    try {
        const response = await fetch('/api/tournaments');
        const tournaments = await response.json();

        container.innerHTML = tournaments.map(t => `
      <div class="col-md-4 mb-4">
        <div class="card tournament-card">
          <div class="card-body">
            <h5 class="card-title">${t.name}</h5>
            <p class="card-text">${new Date(t.date).toLocaleDateString()}</p>
            <p class="card-text">${t.participantCount} Participants</p>
          </div>
        </div>
      </div>
    `).join('');
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Error loading tournaments</div>`;
    }
};