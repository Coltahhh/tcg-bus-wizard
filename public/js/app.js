async function showBracket(tournamentId) {
    try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);
        const tournament = await response.json();

        const bracketHTML = tournament.bracket.rounds.map(round => `
      <div class="round">
        <h3>${round.roundType}</h3>
        ${Object.values(round.matches).map(match => `
          <div class="match">
            ${match.players.map(player => `
              <div class="player ${player._id === match.winner ? 'winner' : ''}">
                ${player.username}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `).join('');

        document.getElementById('bracketContainer').innerHTML = bracketHTML;
    } catch (error) {
        console.error('Error loading bracket:', error);
    }
}