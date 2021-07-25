const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});

const cards = require('./cards.json');
const UnoUtils = require('./UnoUtils');



//to get a socket by its ID : io.sockets.connected[socket.id]







//Initialisation du paquet de carte
let deck = [];
//quadruples (les cartes chgmt de couleur et plus 4)
for (let i = 0; i < 4; i++) {
    deck.push(cards.plus4,cards.colorChange);
}
//doubles (toutes les cartes de couleurs sauf 0)
for (let i = 0; i < 2; i++) {
    deck.push(cards.oneRed,cards.twoRed,cards.threeRed,cards.fourRed,cards.fiveRed,cards.sixRed,cards.sevenRed,cards.eightRed,cards.nineRed,cards.blockRed,cards.turnRed,cards.plus2Red,cards.oneYellow,cards.twoYellow,cards.threeYellow,cards.fourYellow,cards.fiveYellow,cards.sixYellow,cards.sevenYellow,cards.eightYellow,cards.nineYellow,cards.blockYellow,cards.turnYellow,cards.plus2Yellow,cards.oneGreen,cards.twoGreen,cards.threeGreen,cards.fourGreen,cards.fiveGreen,cards.sixGreen,cards.sevenGreen,cards.eightGreen,cards.nineGreen,cards.blockGreen,cards.turnGreen,cards.plus2Green,cards.oneBlue,cards.twoBlue,cards.threeBlue,cards.fourBlue,cards.fiveBlue,cards.sixBlue,cards.sevenBlue,cards.eightBlue,cards.nineBlue,cards.blockBlue,cards.turnBlue,cards.plus2Blue);
}
//unique (les cartes ayant comme chiffre 0)
deck.push(cards.zeroRed,cards.zeroYellow,cards.zeroGreen,cards.zeroBlue);


io.on('connection', (socket) => {
    console.log("Nouvelle connexion ! " + socket.id)
    socket.emit('show-connexion')

    socket.on('create-room', function (data) {
        socket.tempPseudo = data.pseudo.trim().toString();
        if (socket.tempPseudo.length < 3 || socket.tempPseudo.length > 20) {
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Votre pseudo est invalide.",
                "variant": "danger",
                "toaster": "b-toaster-top-center"
            });
            delete socket.tempPseudo;
        } else {
            //Suppression des données temporaires
            UnoUtils.socketFlush(socket);
            socket.pseudo = socket.tempPseudo;
            delete socket.tempPseudo;

            socket.room = UnoUtils.generateRoom();
            socket.emit('hide-connexion');
            socket.join(socket.room);
            io.sockets.adapter.rooms[socket.room].mutedList = [];
            socket.emit('refresh-mutedList', io.sockets.adapter.rooms[socket.room].mutedList); //on envoit la liste des muted (théoriquement vide)
            console.log(io.sockets.adapter.rooms[socket.room])
            socket.isConnected = true;
            socket.emit('update-room', {"room" : socket.room});
            socket.admin = socket.room; //On défini sur quel room le socket est admin (créateur de la partie), cela évite un exploit qui consiste à changer de room en étant admin dans une autre et devenir admin de la nouvelle room

            //Affichage des éléments d'admin de la partie
            socket.emit('toggle-nav-el', {
                'element': 'OptionMenu',
                'option': true
            });
            socket.emit('toggle-nav-el', {
                'element': 'StartButton',
                'option': true
            });

            //Notifications de création de la partie
            socket.emit('show-toast', {
                "title": "Succès",
                "desc": "Vous avez bien créé la room #" + socket.room + ".",
                "variant": "success",
                "toaster": "b-toaster-bottom-center"
            });
            io.to(socket.room).emit('show-chat-message', {
                "sender": "",
                "message": socket.pseudo + " a créé la partie #" + socket.room,
                "style": "list-group-item-light"
            });

            //Actualisation de la liste des joueurs
            io.to(socket.room).emit('refresh-playerlist', {
                'playerList': UnoUtils.getUsernamesInRoom(socket.room)
            });
        }
    })

    socket.on('join-room', function (data) {
        socket.tempPseudo = data.pseudo.trim().toString();
        socket.tempRoom = data.room.trim().toString();
        if ((socket.tempPseudo.length < 3 || socket.tempPseudo.length > 20) || (socket.tempRoom.length != 6) || (!Object.keys(io.sockets.adapter.rooms).includes(socket.tempRoom))) { //Vérifie si le nom de la room et le pseudo sont conformes et qu'elle existe
            //Pseudo trop court, trop long, la room n'a pas 6 caractères ou elle n'existe pas
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Votre pseudo ou le nom de la room est invalide.",
                "variant": "danger",
                "toaster": "b-toaster-top-center"
            });
            delete socket.tempPseudo;
            delete socket.tempRoom;
        } else if (UnoUtils.getUsersInRoom(socket.tempRoom, io).includes(socket.id)) { //Vérifie si le socket essai de se reconnecter au même salon
            //Même salon
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Vous êtes déjà connecté dans ce salon.",
                "variant": "danger",
                "toaster": "b-toaster-top-center"
            });
            delete socket.tempPseudo;
            delete socket.tempRoom;
        } else if (UnoUtils.getUsernamesInRoom(socket.tempRoom).includes(socket.tempPseudo)) { //Vérifie si le pseudo que le socket souhaite utiliser est déjà utilisé dans le salon
            //Qlq a déjà le même pseudo dans cette room
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Votre pseudo est déjà utilisé dans ce salon.",
                "variant": "danger",
                "toaster": "b-toaster-top-center"
            });
            delete socket.tempPseudo;
            delete socket.tempRoom;
        } else {
            //Suppression des données temporaires
            UnoUtils.socketFlush(socket);
            socket.pseudo = socket.tempPseudo;
            socket.room = socket.tempRoom;
            delete socket.tempPseudo;
            delete socket.tempRoom;

            socket.emit('hide-connexion'); //Fermeture de la page de connexion
            socket.join(socket.room);
            console.log(io.sockets.adapter.rooms[socket.room]);
            socket.isConnected = true;
            socket.emit('update-room', {"room" : socket.room});

            //Actualisation de la liste des joueurs
            io.to(socket.room).emit('refresh-playerlist', {
                'playerList': UnoUtils.getUsernamesInRoom(socket.room)
            });

            //Notification de la connexion
            socket.emit('show-toast', {
                "title": "Succès",
                "desc": "Vous avez bien rejoint la room #" + socket.room + ".",
                "variant": "success",
                "toaster": "b-toaster-bottom-center"
            });
            socket.broadcast.to(socket.room).emit('show-toast', {
                "title": "Information",
                "desc": socket.pseudo + " a rejoint la partie.",
                "variant": "primary",
                "toaster": "b-toaster-bottom-left"
            });
            io.to(socket.room).emit('show-chat-message', {
                "sender": "",
                "message": socket.pseudo + " a rejoint la partie.",
                "style": "list-group-item-light"
            });
        }
    })

    socket.on('toggle-mute', function (mutedPseudo) {

        let mutedList = io.sockets.adapter.rooms[socket.room].mutedList;
        //Lorsqu'on reçoit l'information de désactiver ou activer le mute sur qlq
        if (socket.admin == socket.room) { //Vérification si admin
            if (socket.pseudo != mutedPseudo && UnoUtils.getUsernamesInRoom(socket.room).includes(mutedPseudo)) { //On empêche l'admin de se mute lui même et on vérifie si le joueur existe
                if (!mutedList.includes(mutedPseudo)) { //Si mutedList ne contient pas encore ce joueur
                    mutedList.push(mutedPseudo); //ajoute ce joueur à la liste
                    io.to(socket.room).emit('show-chat-message', {
                        "sender": "",
                        "message": mutedPseudo + " a été mute.",
                        "style": "list-group-item-warning"
                    });
                } else {
                    mutedList = mutedList.filter(function(element) {
                        return element != mutedPseudo;
                    }); //On retire le pseudo s'il est déjà dans la liste grâce à un filtre
                    io.to(socket.room).emit('show-chat-message', {
                        "sender": "",
                        "message": mutedPseudo + " a été démute.",
                        "style": "list-group-item-warning"
                    });
                }
                socket.emit('refresh-mutedList', mutedList); //on renvoit la liste des muted
            }
        } else {
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Vous devez être admin pour faire cela.",
                "variant": "danger",
                "toaster": "b-toaster-bottom-right"
            });
        }
    })

    socket.on('send-message', function (data) {

        let mutedList = io.sockets.adapter.rooms[socket.room].mutedList;

        if (socket.isConnected == false) {
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Vous devez être connecté pour faire cela.",
                "variant": "danger",
                "toaster": "b-toaster-bottom-right"
            });
        } else if (mutedList.includes(socket.pseudo)) {
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Vous ne pouvez pas parler car vous avez été mute par le créateur du salon.",
                "variant": "warning",
                "toaster": "b-toaster-bottom-right"
            });
        } else if (data.message.trim().toString() == "") {
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Votre message est vide.",
                "variant": "danger",
                "toaster": "b-toaster-bottom-right"
            });
        } else if (data.message.length > 300) {
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Votre message est trop long !",
                "variant": "danger",
                "toaster": "b-toaster-bottom-right"
            });
        }
        else {
            io.to(socket.room).emit('show-chat-message', {
                "sender": socket.pseudo,
                "message": data.message,
                "style": ""
            });
        }
    });

    socket.on('kick-player', function (kickedPseudo) {
        if (socket.admin == socket.room) { //Si le joueur qui demande le kick est l'admin
            if (socket.pseudo != kickedPseudo && UnoUtils.getUsernamesInRoom(socket.room).includes(kickedPseudo)) { //Si le joueur à kick n'est pas lui-même et si il existe bien
                
                let kickedSocket = io.sockets.connected[UnoUtils.getIdByPseudo(kickedPseudo, socket.room)];

                //Annonce au joueur kick
                kickedSocket.emit('show-toast', {
                    "title": "Information",
                    "desc": "Vous avez été kick de la partie.",
                    "variant": "danger",
                    "toaster": "b-toaster-top-center"
                });

                //Déconnexion du joueur kick
                kickedSocket.emit('show-connexion'); //On affiche la page de connexion au socket kicked
                kickedSocket.leave(socket.room);
                UnoUtils.socketFlush(kickedSocket);

                //Annonce à tout le monde
                io.to(socket.room).emit('show-toast', {
                    "title": "Information",
                    "desc": kickedPseudo + " a été kick de la partie.",
                    "variant": "danger",
                    "toaster": "b-toaster-bottom-left"
                });
                io.to(socket.room).emit('show-chat-message', {
                    "sender": "",
                    "message": kickedPseudo + " a été kick de la partie.",
                    "style": "list-group-item-danger"
                });
    
                //Actualisation de la liste des joueurs
                io.to(socket.room).emit('refresh-playerlist', {
                    'playerList': UnoUtils.getUsernamesInRoom(socket.room)
                });
            }
        } else { //S'il était simple joueur
            socket.emit('show-toast', {
                "title": "Erreur",
                "desc": "Vous devez être admin pour faire cela.",
                "variant": "danger",
                "toaster": "b-toaster-bottom-right"
            });
        }
    });

    socket.on('disconnect', function () {
        if (socket.admin == socket.room) { //Si le joueur qui a quitté était admin de la partie
            socket.broadcast.to(socket.room).emit('show-toast', {
                "title": "Information",
                "desc": "La partie a été fermée car le créateur de celle-ci est parti.",
                "variant": "warning",
                "toaster": "b-toaster-top-center"
            });
            socket.broadcast.to(socket.room).emit('show-connexion'); //On affiche la page de connexion aux sockets sauf à celui qui a quitté
            try {
                for (userID of UnoUtils.getUsersInRoom(socket.room, io)) {
                    let user = io.sockets.connected[userID]; //On récupère le socket et on le place dans user
                    user.leave(socket.room); //Fait quitter la room à tous les utilisateurs de celle-ci
                    UnoUtils.socketFlush(user); //On reset chaque socket présent dans la room
                }
            } catch(err) {
                console.log("Can't disconnect users in room : " + err);
            }
        } else { //Si il était simple joueur
            socket.broadcast.to(socket.room).emit('show-toast', {
                "title": "Information",
                "desc": socket.pseudo + " a quitté la partie.",
                "variant": "primary",
                "toaster": "b-toaster-bottom-left"
            });
            io.to(socket.room).emit('show-chat-message', {
                "sender": "",
                "message": socket.pseudo + " a quitté la partie.",
                "style": "list-group-item-light"
            });
    
            //Actualisation de la liste des joueurs
            io.to(socket.room).emit('refresh-playerlist', {
                'playerList': UnoUtils.getUsernamesInRoom(socket.room)
            });
        }
        
    });
})


http.listen(PORT, () => console.log("Server listening on port" + PORT))
let newDeck = deck;
let p1Deck;

p1Deck =  newDeck.slice(0, 7);
newDeck = newDeck.slice(7);

console.log(p1Deck);
console.log(newDeck);