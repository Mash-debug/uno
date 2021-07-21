
module.exports = class {

    static generateRoom() {
        let char = "0123456789abcdefghijklmnopqrstuvwxyz";
        let roomName = "";
        while (roomName == "" || (_.includes(Object.keys(io.sockets.adapter.rooms), roomName))) { //tant que room name existe déjà / roomName == "" sert à vérifier si c'est le premier passage
            roomName = "";
            for (let i = 0; i < 6; i++) {
                roomName += char[Math.floor((Math.random() * (char.length)) + 0)];
            }
        }

        return roomName;
    }

    static getUsersInRoom(roomName, io) {
        try {
            return Object.keys(io.sockets.adapter.rooms[roomName].sockets);
        }
        catch(err) {
            console.log("Can't get Users in room : " + err);
        }
    }

    static getUsernamesInRoom(roomName) {
        try {
            return getUsersInRoom(roomName).map(function (id) {
                return io.sockets.connected[id].pseudo
            });
        }
        catch(err) {
            console.log("Can't get Usernames in room : " + err);
        }
    }

    static getIdByPseudo(pseudo, room) {
        try {
            let pseudoIndex = _.indexOf(getUsernamesInRoom(room), pseudo); //cherche l'index du pseudo dans la liste qui est une transcription de la liste des ID en pseudo
            return getUsersInRoom(room)[pseudoIndex]; //retourne l'id avec l'index du pseudo correspondant
        } catch(err) {
            console.log("Can't get Id with pseudo : " + err);
        }
    }

    static socketFlush(socket) {  // Reset le socket et ses informations
        delete socket.pseudo;
        delete socket.room;
        delete socket.admin;
        delete socket.isConnected;
    }
}










