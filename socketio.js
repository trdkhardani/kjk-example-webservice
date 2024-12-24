const { Server } = require('socket.io');

let io;

function sokcetioServer(server){
    io = new Server(server);
    
    io.on("connection", (socket) => {
        console.log(`An user has been connected with id ${socket.id}`)
        
        socket.on("new_user_notification", (message) => {
            console.log(`New user has successfully registered`)
            io.emit("new_user", message);
        });

        socket.on("password_changed_notification", (message) => {
            console.log(`An user has successfully changed their password`)
            io.emit("password_changed", message);
        });
    })
}

function getIo(){
    if(!io){
        throw new Error(`Socket.io has not been initialized`)
    }

    return io;
}

module.exports = { sokcetioServer, getIo };