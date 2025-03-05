import { Bracket } from 'react-bracket-maker';

export default function TournamentBracket({ matches }) {
    return (
        <Bracket
            matches={matches}
            onMatchClick={(match) => console.log('Match clicked:', match)}
        />
    );
}