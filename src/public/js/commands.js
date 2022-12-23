let help = [
    "social                muestra las redes sociales del creador.",
    "welcome               muestra el mensaje de bienvenida.",
    "trakingIP (ipAdress)  optiene informacion a partir de una ip(sin parentecis el argumento ipAdress).",
    "clear | cls           limpia la terminal."
];

const icommands = {};

// {command = trakerIp args = ipAdress callback} 
function addCommands(commands){
    if(commands.command){
        icommands[commands.command] = commands;
    }else{
        return false;
    }
}

function getCommand(command){
    if(icommands[command]){
        return icommands[command];
    }else{
        return false;
    }
}

addCommands({command: "clear", callback: clear});
addCommands({command: "cls", callback: clear});
addCommands({command: "help", callback: (terminal) => {
    loopLines(help, "message", 0, 30);
}});
addCommands({command: "welcome", callback: (terminal) => {
    loopLines(["                                                 ",
               "    __^__                                      __^__",
               "   ( ___ )------------------------------------( ___ )",
               "    | / |                                      | \\ |",
               "    | / |    Fucking Terminal Hacking Tools    | \\ |",
               "    |___|                                      |___|",
               "   (_____)------------------------------------(_____)" ], "message", 0, 5);
}});

addCommands({command: "social", callback: (terminal) => {
    loopLines(["Youtube          <a href=\"http://youtube.com/@mirabal_g\" >Yotube Channel</a>",
               "Facebook         <a href=\"https://facebook.com/antonio.mirabalgarcia\" >Facebook Profile</a>",
               "Telegram         <a href=\"https://t.me/mirantonio\" >Telegram Profile</a>",
               "Gmail            <a href=\"mailto:antonio.dev.garcia@gmail.com\" >Gmail</a>",
               "Github           <a href=\"https://github.com/ByteLost\" >Github Profie</a>" ], "message",0, 5);
}});

// Aditional commands
addCommands({command: "trakingip", args: ["ipAdress"], callback: (args, terminal) => {
    getIPInfo(args.ipAdress).then(res => res.json()).
    then(response => {
        addLine("Obteniendo informacion de usuario basado en la direccion ip....<br>Informacion obtenida ingresando al sistema...<br>Sistema descifrado mostrando Informacion...", "success", 0, writing_speed);
        setTimeout(() => {
            loopLines([JSON.stringify(response,null, 4), "No nos hacemos cargo del uso que se le de a esta herramienta todo es bajo su responsabilidad."], "data", 1, writing_speed);
        }, 1900);
    }).catch((reason) => addLine(reason,"error", writing_speed ));
}});

function clear(terminal){
    addLine("Limpiando Terminal", "todo", 0, writing_speed);
    setTimeout(() => {
      terminal.innerHTML = '';
    },600);
}