export const API = {
    getTournaments: async () => {
        const response = await fetch('/api/tournaments');
        return response.json();
    },

    login: async (credentials) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    }
};