// public/js/utils.js
export const renderSection = (sectionId, template, data) => {
    const container = document.getElementById(sectionId);
    container.innerHTML = Handlebars.compile(template)(data);
};