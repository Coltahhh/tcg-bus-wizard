import { Bracket } from 'react-bracket-maker';

export default function TournamentBracket({ matches }) {
    const initialMatches = matches || [
        {
            teams: [{ name: 'Team 1' }, { name: 'Team 2' }],
            score: [0, 0],
        },
        // Add more match objects as needed
    ];

    return (
        <div className="overflow-x-auto py-4">
            <Bracket
                matches={initialMatches}
                onMatchClick={(match) => console.log('Match clicked:', match)}
                options={{
                    style: {
                        connectorColor: '#94a3b8',
                        connectorColorHighlight: '#3b82f6',
                        fontFamily: 'inherit',
                    },
                }}
            />
        </div>
    );
}