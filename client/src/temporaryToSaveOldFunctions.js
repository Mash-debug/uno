// Tous les events (client => serveur)

socket.emit('send-message', {
    message: this.inputMessage
});
socket.emit('kick-player', joueur);
socket.emit('toggle-mute', joueur);
socket.emit('start-game');
socket.emit('join-room', {
    pseudo: this.pseudo,
    room: this.room
});
socket.emit('create-room', {
    pseudo: this.pseudo
});


// Tous les events (serveur => client)

socket.emit('show-connexion')
socket.emit('hide-connexion') // Fermeture de la page de connexion
socket.emit('update-room', {"room" : socket.room});

const titlesToast = [
    "Erreur",
    "Succès",
    "Information",
];

const descsToast = [
    "Votre pseudo est invalide.",
    "Votre pseudo ou le nom de la room est invalide.",
    "Vous êtes déjà connecté dans ce salon.",
    "Votre pseudo est déjà utilisé dans ce salon.",
    "Vous avez bien créé la room #" + socket.room + ".",
    "Vous devez être admin pour faire cela.",
    "Vous avez été kick de la partie.",
    kickedPseudo + " a été kick de la partie.",
    "La partie a été fermée car le créateur de celle-ci est parti.",
    socket.pseudo + " a quitté la partie.",
    socket.pseudo + " a rejoint la partie.",
]

const variantsToast = [
    "danger",
    "success",
    "warning",
    "primary",
]

socket.emit('show-toast', {
    "title": "Erreur",
    "desc": "Votre pseudo est invalide.",
    "variant": "danger",
    "toaster": "b-toaster-top-center"
});

socket.emit('show-toast', {
    "title": "Erreur",
    "desc": "Votre pseudo ou le nom de la room est invalide.",
    "variant": "danger",
    "toaster": "b-toaster-top-center"
});

socket.emit('show-toast', {
    "title": "Erreur",
    "desc": "Vous êtes déjà connecté dans ce salon.",
    "variant": "danger",
    "toaster": "b-toaster-top-center"
});

socket.emit('show-toast', {        // Notifications de création de la partie   
    "title": "Succès",
    "desc": "Vous avez bien créé la room #" + socket.room + ".",
    "variant": "success",
    "toaster": "b-toaster-bottom-center"
});

socket.emit('show-toast', {
    "title": "Erreur",
    "desc": "Votre pseudo est déjà utilisé dans ce salon.",
    "variant": "danger",
    "toaster": "b-toaster-top-center"
});

socket.emit('show-toast', {
    "title": "Erreur",
    "desc": "Vous devez être admin pour faire cela.",
    "variant": "danger",
    "toaster": "b-toaster-bottom-right"
});

kickedSocket.emit('show-toast', {
    "title": "Information",
    "desc": "Vous avez été kick de la partie.",
    "variant": "danger",
    "toaster": "b-toaster-top-center"
});

io.to(socket.room).emit('show-toast', {
    "title": "Information",
    "desc": kickedPseudo + " a été kick de la partie.",
    "variant": "danger",
    "toaster": "b-toaster-bottom-left"
});

socket.broadcast.to(socket.room).emit('show-toast', {
    "title": "Information",
    "desc": "La partie a été fermée car le créateur de celle-ci est parti.",
    "variant": "warning",
    "toaster": "b-toaster-top-center"
});



socket.broadcast.to(socket.room).emit('show-toast', {
    "title": "Information",
    "desc": socket.pseudo + " a quitté la partie.",
    "variant": "primary",
    "toaster": "b-toaster-bottom-left"
});

socket.broadcast.to(socket.room).emit('show-toast', {
    "title": "Information",
    "desc": socket.pseudo + " a rejoint la partie.",
    "variant": "primary",
    "toaster": "b-toaster-bottom-left"
});



io.to(socket.room).emit('refresh-playerlist', {
    'playerList': UnoUtils.getUsernamesInRoom(socket.room)
});

socket.emit('hide-connexion');

socket.emit('refresh-mutedList', io.sockets.adapter.rooms[socket.room].mutedList); //on envoit la liste des muted (théoriquement vide)

socket.emit('update-room', {"room" : socket.room});


socket.emit('toggle-nav-el', {     // Affichage des éléments d'admin de la partie
    'element': 'OptionMenu',
    'option': true
});

socket.emit('toggle-nav-el', {     // Affichage des éléments d'admin de la partie
    'element': 'StartButton',
    'option': true
});




io.to(socket.room).emit('show-chat-message', {
    "sender": "",
    "message": socket.pseudo + " a créé la partie #" + socket.room,
    "style": "list-group-item-light"
});

io.to(socket.room).emit('show-chat-message', {
    "sender": "",
    "message": mutedPseudo + " a été mute.",
    "style": "list-group-item-warning"
});

io.to(socket.room).emit('show-chat-message', {
    "sender": "",
    "message": mutedPseudo + " a été démute.",
    "style": "list-group-item-warning"
});

io.to(socket.room).emit('show-chat-message', {
    "sender": socket.pseudo,
    "message": data.message,
    "style": ""
});

io.to(socket.room).emit('show-chat-message', {
    "sender": "",
    "message": socket.pseudo + " a rejoint la partie.",
    "style": "list-group-item-light"
});

io.to(socket.room).emit('show-chat-message', {
    "sender": "",
    "message": socket.pseudo + " a quitté la partie.",
    "style": "list-group-item-light"
});

io.to(socket.room).emit('show-chat-message', {
    "sender": "",
    "message": kickedPseudo + " a été kick de la partie.",
    "style": "list-group-item-danger"
});


socket.emit('refresh-mutedList', io.sockets.adapter.rooms[socket.room].mutedList); //on renvoit la liste des muted



io.to(socket.room).emit('refresh-playerlist', {
    'playerList': UnoUtils.getUsernamesInRoom(socket.room)
});












