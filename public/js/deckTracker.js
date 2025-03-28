// public/js/deckTracker.js
export class DeckTracker {
    constructor() {
        this.cards = new Map();
    }

    addCard(card) {
        this.cards.set(card.id, { ...card, count: 1 });
    }
}