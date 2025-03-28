export const Auth = {
    isLoggedIn: () => localStorage.getItem('token'),

    handleLogin: async (email, password) => {
        const { token } = await API.login({ email, password });
        localStorage.setItem('token', token);
        updateUI();
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.reload();
    }
};