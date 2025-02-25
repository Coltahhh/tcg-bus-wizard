import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TournamentCard = ({ tournament }) => {
    // Safe data extraction
    const tournamentName = tournament?.name || 'Unnamed Tournament';
    const organizer = tournament?.organizer || {};
    const participants = Array.isArray(tournament?.participants) ? tournament.participants : [];
    const date = tournament?.date ? new Date(tournament.date) : null;

    // Safe date formatting
    const formattedDate = date ?
        date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) :
        'Date not set';

    return (
        <div className="col-md-4 mb-4">
            <div className="tournament-card card bg-secondary text-white">
                <div className="card-body">
                    <h5 className="card-title">{tournamentName}</h5>

                    <p className="card-text">
                        <i className="bi bi-calendar me-2"></i>
                        {formattedDate}
                    </p>

                    <p className="card-text">
                        <i className="bi bi-person me-2"></i>
                        Organizer: {' '}
                        {organizer._id ? (
                            <Link
                                to={`/user/${organizer._id}`}
                                className="text-warning text-decoration-none"
                            >
                                {organizer.username || 'Unknown Organizer'}
                            </Link>
                        ) : (
                            <span className="text-muted">System</span>
                        )}
                    </p>

                    <p className="card-text">
                        <i className="bi bi-people me-2"></i>
                        Participants: {participants.length}
                    </p>
                </div>
            </div>
        </div>
    );
};
TournamentCard.propTypes = {
    tournament: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        date: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date)
        ]),
        organizer: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string
        }),
        participants: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string,
                username: PropTypes.string
            })
        )
    }).isRequired
};


export default TournamentCard;
