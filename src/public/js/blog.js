const commentList = document.getElementById('comments-list');
const usersLive = document.getElementById('users-live');
const inputName = document.getElementById('name-input');
const inputEmail = document.getElementById('email-input');
const inputWeb = document.getElementById('web-input');
const inputMessage = document.getElementById('message-input');
const counter = document.getElementById('counter');
const limit = Number(inputMessage.dataset.limit);
const sendCommentBtn = document.getElementById('send-comment');

counter.textContent =  "0/" + limit;
const user = localStorage.getItem("user");
const message = localStorage.getItem("message" + __DATAID);
var connected = false;
const socket = io();

const codeSyles = document.createElement('link');
codeSyles.setAttribute('rel', 'stylesheet');

if (mode === DARK_MODE) {
   codeSyles.setAttribute('href', '/css/github-dark.css');
   document.body.appendChild(codeSyles);
}else{
    codeSyles.setAttribute('href', '/css/github.css');
    document.body.appendChild(codeSyles);
}
mode_button.addEventListener('click', () => {
    if (document.body.classList.contains('dark')){
        codeSyles.setAttribute('href', '/css/github-dark.css');
        document.body.appendChild(codeSyles);
    } else {
        codeSyles.setAttribute('href', '/css/github.css');
        document.body.appendChild(codeSyles);
    }
});

socket.on('connect', () => {
    connected = socket.connected;
    if(connected){
        socket.emit('enter:room', __DATAID);
    }
});

hiddenInputs(user);
if(message){
    inputMessage.value = message;
}
inputMessage.addEventListener('input', (e) => {
    let textLength = e.target.value.length;
    counter.textContent = textLength + "/" + limit;

    if(textLength > limit){
        inputMessage.style.border = "2px solid var(--alert-error-color)";
        counter.style.color = "var(--alert-error-color)";
    }else{
        inputMessage.style.border = "none";
        counter.style.color = "var(--text-gray)";
    }
});

inputMessage.addEventListener('keyup', (e) => {
    localStorage.setItem('message' + __DATAID, e.target.value);
});

sendCommentBtn.addEventListener('click', (e) => {
    if(user){
        const data = JSON.parse(user);
        sendComment(data.name,data.email,data.web,inputMessage.value)
    }else{
        const name = inputName.value;
        const email = inputEmail.value;
        const web = inputWeb.value;
        const message = inputMessage.value;
        if(sendComment(name, email, web, message)){
            localStorage.setItem("user", JSON.stringify({name,email,web}));
            hiddenInputs(localStorage.getItem("user"));
        }
    }
});

socket.on('load:comment', (comment) => {
    commentList.innerHTML += comment;
});

socket.on('users:live', (users) => {
    let live = users > 1 ? users + " Personas estan viendo esto." : users + " Persona esta viendo esto."
    usersLive.innerText = live;
});

function sendComment(name, email, web, message){
    if(!validarNombreUsuario(name)){
        // alert("escribe un nombre de usuario correcto");
        showAlert("error", "nombre de usuario no valido.");
     }else if(!validarEmail(email)){
         //alert("escribe un email correcto");
         showAlert("error", "correo electronico no valido.");
     }else if(!validarUrl(web)){
         //alert("escribe un url correcto");
         showAlert("error", "Ingrese una URL valida.");
     }else if(message.length < 5){
         //alert("escribe al menos 5 palabras");
         showAlert("", "escribe al menos 5 caracteres.");
     }else if(message.length > 500){
        // alert("escribe menos de 500 palabras");
        showAlert("info", "escribe menos de 500 caracteres.");
     }else{
         showAlert("", "Se publico el comentario.");
 
         socket.emit('post:comment', {
         name: name,
         email: email,
         web: web,
         message: message
     });
     return true;
    }
    return false;
}

function hiddenInputs(user){
    if(user){
        inputName.style.display = "none";
        inputEmail.style.display = "none";
        inputWeb.style.display = "none";
    }
}
function validarEmail(email) {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
}

function validarUrl(url){
    return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2,6}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,@,?'\\+&%$#=~_-]+))*$/.test(url);
}

function validarNombreUsuario(nombre) {
    return /^[A-Z].*/g.test(nombre);
}