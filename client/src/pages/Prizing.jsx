const Prizing = () => {
    const prizes = [
        {
            title: "1st Place",
            items: ["Exclusive promo card", "Booster box", "Trophy"],
            color: "var(--primary-color)"
        },
        {
            title: "2nd Place",
            items: ["Booster box", "Playmat"],
            color: "var(--secondary-color)"
        },
        {
            title: "3rd-4th Place",
            items: ["Booster packs", "Deck box"],
            color: "#666" // Custom color
        }
    ];

    return (
        <div className="container mt-4">
            <h2>Tournament Prizes</h2>
            <div className="row">
                {prizes.map((prize, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div
                            className="card text-white"
                            style={{ backgroundColor: prize.color, border: 'none' }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">{prize.title}</h5>
                                <ul className="card-text">
                                    {prize.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Prizing;
