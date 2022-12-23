const input = document.getElementById('input');
const typerCommand = document.getElementById('typer');

const escape = (text) => text.replace(/\n/g, '');
const pw = false;

input.addEventListener('input', (e) => {
    e = e || window.event;
    let text = input.value;
    if(!pw) typerCommand.innerHTML = escape(text);
})

