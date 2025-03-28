// utils/rankingAlgorithms.js
export const getEloRating = (playerRating, opponentRating, result) => {
    const K_FACTOR = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const newRating = playerRating + K_FACTOR * (result - expectedScore);

    return {
        newRating: Math.round(newRating),
        ratingChange: Math.round(newRating - playerRating)
    };
};