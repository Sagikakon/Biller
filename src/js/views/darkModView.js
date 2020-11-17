import { DOM } from '../models/DOM'

const disableDarkMode = () => {
    const buttonIcon = DOM.darkModeDOM.firstChild;

    document.body.classList.remove('dark-mode');
    buttonIcon.className = "fas fa-moon";
    localStorage.setItem("darkMode", false);
}

const activateDarkMode = () => {
    const buttonIcon = DOM.darkModeDOM.firstChild;

    document.body.classList.add('dark-mode');
    buttonIcon.className = "fas fa-sun";
    localStorage.setItem("darkMode", true);
}

export const initDarkMode = () => {
    const active = localStorage.getItem("darkMode");

    if (active == "true")
        activateDarkMode();
}

DOM.darkModeDOM.addEventListener('click', () => {
    const buttonIcon = DOM.darkModeDOM.firstChild;
    const isActive = buttonIcon.className.includes("sun");

    if (isActive)
        disableDarkMode();

    else
        activateDarkMode();
});