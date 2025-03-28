// public/js/tournamentCreation.js
export class TournamentWizard {
    constructor() {
        this.steps = ['basic-info', 'participants', 'bracket-type'];
        this.currentStep = 0;
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateUI();
        }
    }
}