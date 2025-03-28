// public/js/router.js
export const initRouter = () => {
    window.addEventListener('hashchange', () => {
        const section = window.location.hash.substr(1) || 'home';
        showSection(section);
    });
};