const express = require("express");
const http = require("http");
const path = require("path");
const routes = require("./routes");
const {commented} = require('./api');
const {addComment} = require('./utils');

const app = express();
const server = http.createServer(app);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

app.use("*", (req, res) => {
    res.render('404', {image: "/images/day-dog.svg", title: "Pagina No Encontrada", message: "El recurso que busco no existe o no se encontro verifica que la URL este bien escrita."});
})
server.listen(process.env.PORT || 3000);

// Socket
const {Server} = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    let roomID;

    socket.on('enter:room', async(id) => {
        roomID = id;

        
        socket.join(roomID);
        
        const sockets = await io.in(roomID).fetchSockets();
        let users = 0;
        sockets.map(socket => users++);
        io.to(roomID).emit('users:live', users);
    });

    socket.on('disconnect', async(reason) => {
        const sockets = await io.in(roomID).fetchSockets();
        let users = 0;
        sockets.map(socket => users++);
        io.to(roomID).emit('users:live', users);
    });

    socket.on('post:comment', (comment) => {
        commented(roomID, comment).then((res) => {
            io.to(roomID).emit('load:comment', addComment(res.comment));
        }).catch((err) => {

        });
    });
});