const terminal = document.getElementById('terminal');
const commandPanel = document.getElementById('command');
const commands = [];
const writing_speed = 20;

window.onload = () =>{
  fetch("https://api.ipify.org/").then((res) => res.text()).then((ip) => {
    document.getElementById("instance").innerText = "instace of: " + ip;
    command("welcome");
  });
}

function command(cmd){
   cmd = cmd.toLowerCase().split(" ");
   let icommand = getCommand(cmd[0]);
   if(icommand){
    if(icommand.args){
      let args = {};
      icommand.args.map((value, i) => {
        args[value] = cmd[i+1];
      });
      if(icommand.callback) icommand.callback(args, terminal);
    }else{
      if(icommand.callback) icommand.callback(terminal);
    }
   }else{
    addLine("El comando no existe para consultar los comandos existentes escriba el comando <span class=\"command\">'help'</span>.","error", 0, writing_speed);
   }
}

commandPanel.addEventListener('click', () => input.focus());
window.addEventListener('keyup', (e) => {
    const key = e.keyCode;
    if(key == 13){
        commands.push(typerCommand.innerHTML);
        git = commands.length;
        addLine("@HackingTerminal:~$ " + typerCommand.innerHTML, "no-animation", 0, 0);
        command(typerCommand.innerHTML.toLowerCase());
        typerCommand.innerHTML = '';
        input.value = "";

    }
    if(key == 38 && git != 0){
      git -= 1;
      input.value = commands[git];
      typerCommand.innerHTML = input.value;
    }
    if(key == 40 && git != commands.length){
      git += 1;
      if(commands[git] === undefined) input.value = '';
      else input.value = commands[git];

      typerCommand.innerHTML = input.value;
    }
});

function newTab(link) {
    setTimeout(function() {
      window.open(link, "_blank");
    }, 600);
  }
  
  function addLine(text, style, mode = 0, time) {
    var t = "";
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      if(mode == 0){
        t += "&nbsp;&nbsp;";
        i++;
      }
      } else {
        t += text.charAt(i);
      }
    }
    //setTimeout(function() {
      var next = document.createElement("p");
      next.className = style;
      terminal.appendChild(next);

      writing(t, next, mode, time);
      window.scrollTo(0, document.body.offsetHeight);
    
  }
  
  function loopLines(name, style, mode, time) {
    name.forEach(function(item, index) {
      addLine(item, style, mode, index * time);
    });
  }

  function writing(text, parent, mode, time){
    let arr = [...text];
    let index = 0;

    let intervalPrinter = setInterval(() => {
      if(index <= text.length){
        if(mode == 0){
          parent.innerHTML =  text.substring(0, index);
        }else{
          parent.innerText =  text.substring(0, index);
        }
        index++;
      }else{
        clearInterval(intervalPrinter);
      }
    }, time);
  }