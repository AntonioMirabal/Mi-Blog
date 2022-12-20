const mode_button = document.createElement('button');
mode_button.setAttribute('id', 'mode_button');
mode_button.setAttribute('class', 'dark-mode');
const DARK_MODE = 'Activar modo Oscuro';
const LIGHT_MODE = 'Activar modo claro';

const mode = localStorage.getItem('mode');

if (mode === DARK_MODE) {
    mode_button.innerText = LIGHT_MODE;
    document.body.classList.add('dark');
}else{
    mode_button.innerText = DARK_MODE;
    if(document.body.classList.contains('dark')) document.body.classList.remove('dark');
}
mode_button.addEventListener('click', () => {
    if (document.body.classList.contains('dark')){
        mode_button.innerText = DARK_MODE;
        document.body.classList.remove('dark');
        localStorage.setItem('mode', LIGHT_MODE);
    } else {
        mode_button.innerText = LIGHT_MODE;
        document.body.classList.add('dark');
        localStorage.setItem('mode', DARK_MODE);
    }
});

// add button from document

document.body.appendChild(mode_button);

