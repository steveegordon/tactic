
// Object holds Games and game logic
var game = {
  gamesRef: null,
  games: [],
  currentGameRef: null,
  allp1GamesRef: null,
  allp2GamesRef: null,
  openGamesRef: null,
  currentGame: null,
  userPosition: null,
  userGames: [],
  openGames: [],
  // Changes game info as long as it exists
  updateInfo: function(name, p1, p2){
    if (name.length > 0){
      this.currentGame.name = name;
    }
    if (p1.length > 0){
      this.currentGame.p1 = p1;
    }
    if (p2.length > 0){
    this.currentGame.p2 = p2;
    }
    this.currentGameRef.update(this.currentGame);
  },
  // Creates a new game object and loads to games array
  createGame: function(){
    var gameId = (Math.floor(Math.random() * 10000)).toString();
    var newGame = {
      board:[],
      totalTurn: 0,
      turn: authentication.currentUser.displayName,
      p1: authentication.currentUser.displayName,
      p2: '',
      p1wins: 0,
      p2wins: 0,
      draws: 0,
      name: gameId,
      gameId: gameId
    };
    for (var i = 0; i < 9; i++){
      newGame.board.push({
        square: i,
        user: 0
      });
    }
    firebase.database().ref('/games/' + gameId).set(newGame, function(){
      game.currentGameRef = firebase.database().ref('/games/' + gameId);
      game.currentGameRef.on('value', function(snapshot){
        game.currentGame = snapshot.toJSON();
        game.setPosition();
        view.quitGame();
        view.displayGame(this.currentGame);
      });
    });
  },
  // Searches through games array and finds users games
  findUserGames: function(user){
     this.allp1GamesRef = firebase.database().ref("games").orderByChild("p1").equalTo(user.displayName);
     this.allp2GamesRef = firebase.database().ref("games").orderByChild("p2").equalTo(user.displayName);
      this.allp1GamesRef.on('child_added', function(snapshot){
        game.userGames.push(snapshot.val());
        if (authentication.inGame === false){
          handlers.loadNewGames();
        }
      });
      this.allp2GamesRef.on('child_added', function(snapshot){
        game.userGames.push(snapshot.val());
        if (authentication.inGame === false){
          handlers.loadNewGames();
        }
      });

      // /////////////////CurrentTo Fix //////////////////////////////////
      this.allp2GamesRef.on('value', function(snapshot){
          snapshot.forEach(function(childSnapshot){
            game.userGames.forEach(function(instance, index){
              if (childSnapshot.val().gameId === instance.gameId){
                game.userGames[index] = childSnapshot.val();
              }
            });
        });
      });
      this.allp1GamesRef.on('value', function(snapshot){
          snapshot.forEach(function(childSnapshot){
            game.userGames.forEach(function(instance, index){
              if (childSnapshot.val().gameId === instance.gameId){
                game.userGames[index] = childSnapshot.val();
              }
            });
        });
      });
      // /////////////////////////////////////////////////////////////////

      game.findOpenGames(user);
  },
  findOpenGames: function(user){
      this.openGamesRef = firebase.database().ref("games").orderByChild("p2").equalTo("");
      this.openGamesRef.on('child_added', function(snapshot){
        if (snapshot.val()){
        if (snapshot.val().p1 !== authentication.currentUser.displayName){
          game.openGames.push(snapshot.val());
        }
        }
        if (authentication.inGame === false){
          handlers.loadNewGames();
        }
        }); 
      this.openGamesRef.on('child_removed', function(removedSnapshot){
        game.openGames.forEach(function(openGame, index){
          if (openGame.name === removedSnapshot.val().name){
            game.openGames.splice(index, 1);
          }
        });
      });
  },
  setPosition: function(){
    if (this.currentGame.p1 === authentication.currentUser.displayName){
      this.userPosition = 1;
    }
    else {
      this.userPosition = 2;
    }
  },
  // Sets game by name to currentGame
  selectGame: function(name, setP2){
      var gameId = null;
      var finder = new Promise(function(resolve, reject){
        firebase.database().ref("games").orderByKey().equalTo(name.toString())
        .once('value', function(snapshot){
        gameId = Object.keys(snapshot.val()).toString();
        console.log(gameId);
        game.currentGameRef = firebase.database().ref('/games/' + gameId);
        resolve(game.currentGameRef);
      });
      });
        finder.then(function(val){
          if (setP2 === true){
          val.child("p2").set(authentication.currentUser.displayName);
         }
         else {
         }
          val.on('value', function(snapshot){
            game.currentGame = snapshot.toJSON();
            game.setPosition();
            view.quitGame();
            view.displayGame(this.currentGame);
          });
        });
  },
  // Resets current game board
  resetGame: function(){
        for(let index in game.currentGame.board){
    element = game.currentGame.board[index];
      element.user = 0;
    }
    this.currentGame.totalTurn = 0;
    this.currentGame.turn = this.currentGame.p1;
    this.currentGameRef.update(this.currentGame);
  },
  // Logic for taking turns
  changeBox: function(number){
    var square = this.currentGame.board[number];
    var playerTurn = this.currentGame.turn;
    if (square.user === 0){
      if (playerTurn === this.currentGame.p1){
        square.user = 1;
        this.currentGame.turn = this.currentGame.p2;
        this.currentGame.totalTurn++;
        this.checkWin(playerTurn);
      }
      else {
        square.user = 2;
        this.currentGame.turn = this.currentGame.p1;
        this.currentGame.totalTurn++;
        this.checkWin(playerTurn);
      }
    }
  },
  // Logic for win conditions
  checkWin: function(player){
    var square = this.currentGame.board;
    if (square[0].user === square[1].user && square[2].user === square[0].user && square[0].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[3].user === square[4].user && square[4].user === square[5].user && square[3].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[6].user === square[7].user && square[7].user === square[8].user && square[6].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[0].user === square[3].user && square[6].user === square[0].user && square[0].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[1].user === square[4].user && square[7].user === square[1].user && square[1].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[2].user === square[5].user && square[8].user === square[2].user && square[2].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[0].user === square[4].user && square[8].user === square[0].user && square[0].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (square[6].user === square[4].user && square[2].user === square[6].user && square[6].user !== 0){
      this.addWin(player);
      handlers.resetGame();}
    else if (this.currentGame.totalTurn === 9){confirm("Cats Game. Play again?");
      this.currentGame.draws++;
      handlers.resetGame();}
    this.currentGameRef.update(this.currentGame);
  },
  // Gives winner a win
  addWin: function(player){
    if (player === game.currentGame.p2){
      this.currentGame.p2wins++;
    }
    else {
      this.currentGame.p1wins++;
    }
  },
  quitGame: function(){
    if (this.currentGame === true){
    this.userPosition = null;
    this.currentGameRef.off();
    this.currentGame = null;
    this.currentGameRef = null;
    }
    },

  logout: function(){
    this.allp1GamesRef.off();
    this.allp2GamesRef.off();
    this.openGamesRef.off();
    this.allp1GamesRef = null;
    this.allp2GamesRef = null;
    this.openGamesRef = null;
  },
};
// Object controls major actions
var handlers = {
  // Creates new user, linked to authOverlay button
  newUser: function(name, password){
    authentication.newUser(name, password);
    this.logIn(name, password);
  },
  // Logs in existing user, linked to authOverlay submit
  loadApp: function(){
      authentication.initialize();
      view.setUpEventListeners();
  },
  loadUser: function(user){
      view.showTitle();
      view.createStartButton();
      view.displayUserData();
  },
  logIn: function(){
    authentication.signIn();
  },
  // Finds and displays user games on log in and quit game
  loadGames: function(){
    view.displayUserGames();
    view.displayOpenGames();
  },
  loadNewGames: function(){
    view.removeUserGames();
    handlers.loadGames();
  },
  // Changes users/game name, linked to settingsOverlay submit
  updateInfo: function(name, p1, p2){
    game.updateInfo(name, p1, p2);
    view.updateInfo(game.currentGame.name, game.currentGame.p1, game.currentGame.p2);
  },
  // Creates a new game, linked to start button
  startGame: function(){
    authentication.inGame = true;
    view.removeTitle();
    view.removeStartButton();
    view.removeUserGames();
    game.createGame();
  },
  // Resets currentGame, runs on game.checkWin
  resetGame: function(){
    game.resetGame();
    view.resetBoxes();
  },
  // Takes turn, linked to view.setUpEventListeners
  takeTurn: function(id, square){
    if (game.currentGame.p2 !== ''){
    if (authentication.currentUser.displayName === game.currentGame.turn){
    if (square.classList.length === 2){
      view.changeBox(square);
      game.changeBox(id);
    }
    else {
      view.turnToast("Square already played");
    }
    }
    else {
    view.turnToast("Not your turn");
    }
    }
    else {
    view.turnToast('Waiting for Opponent');
    }
  },
  // Quits current game, Linked to quitGame button
  quitGame: function(logout){
    authentication.inGame = false;
    var board = document.getElementById('board');
    game.quitGame();
    view.quitGame();
    if (logout !== true){
    view.createStartButton();
    this.loadGames();
    view.showTitle();
    }
  },
  // Logs currentUser out, Linked to logout button
  logout: function(){
    if (authentication.inGame === false) {
    view.removeTitle();
    view.removeStartButton();
    view.removeUserGames();
    }
    this.quitGame(true);
    game.logout();
    game.userGames = [];
    game.openGames = [];
    authentication.signOut();
    view.removeLogoutButton();
  },
  // Selects game from games, run on startGame and view.setUpEventListeners
  selectGame: function(picked, answer){
    authentication.inGame = true;
    var startbutton = document.getElementById('startGameButton');
    view.removeTitle();
    view.removeStartButton();
    view.removeUserGames();
    game.selectGame(picked, answer);
  }
};
// Object holds all things related to DOM
var view = {
  eventListeners: false,
  // Loads User data and creates logout button
  displayUserData: function(){
    this.createLogoutButton();
  },
  // Displays users games, run on log in and quit game
  displayUserGames: function(){
    var container = document.getElementById('container');
    var gData = document.getElementById('gameData');
    var gameContainer = document.createElement('div');
    var label = document.createElement('h3');
    var holder = document.createElement('div');
    if (container.classList.contains('inGame')){
      container.classList.remove('inGame');
    }
    holder.className = 'games';
    label.innerHTML = 'My<br\/>Games';
    gameContainer.appendChild(label);
    gameContainer.id = 'gamesContainer';
    game.userGames.forEach(function(item){
      var thisGame = document.createElement('div');
      thisGame.className = 'hidden';
      thisGame.innerHTML = item.gameId;
      var div = document.createElement('div');
      div.className = 'game';
      var h4 = document.createElement('h4');
      h4.className = 'gameTitle';
      h4.innerHTML = item.name;
      var p = document.createElement('p');
      if (item.p1 === authentication.currentUser.displayName){
      p.innerHTML = 'VS. ' + item.p2 + '<br\/>Record: ' + item.p1wins + '-' + item.p2wins;
      }
      else {
        p.innerHTML = 'VS. ' + item.p1 + '<br\/>Record: ' + item.p2wins + '-' + item.p1wins;
      }
      div.appendChild(thisGame);
      div.appendChild(h4);
      div.appendChild(p);
      holder.appendChild(div);
    });
    gameContainer.appendChild(holder);
    gData.appendChild(gameContainer);
  },
  displayOpenGames: function(){
    var container = document.getElementById('gameData');
    var gameContainer = document.createElement('div');
    var label = document.createElement('h3');
    var holder = document.createElement('div');
    holder.className = 'openGames';
    label.innerHTML = 'Open<br\/>Games';
    gameContainer.appendChild(label);
    gameContainer.id = 'openGamesContainer';
    game.openGames.forEach(function(item){
      var thisGame = document.createElement('div');
      thisGame.className = 'hidden';
      thisGame.innerHTML = item.gameId;
      var div = document.createElement('div');
      div.className = 'openGame';
      var h4 = document.createElement('h4');
      h4.className = 'gameTitle';
      h4.innerHTML = item.name;
      var p = document.createElement('p');
      p.innerHTML = 'VS. ' + item.p1;
      div.appendChild(thisGame);
      div.appendChild(h4);
      div.appendChild(p);
      holder.appendChild(div);
    });
    gameContainer.appendChild(holder);
    container.appendChild(gameContainer);
  },
  // Clears other games when game loads
  removeUserGames: function(){
    var gameContainer = document.getElementById('gamesContainer');
    var openGamesContainer = document.getElementById('openGamesContainer');
    if (gameContainer){
      gameContainer.parentNode.removeChild(gameContainer);
    }
    if (openGamesContainer){
      openGamesContainer.parentNode.removeChild(openGamesContainer);
    }
  },
  // Displays game board and data on startGame and selectGame
  displayGame: function(){
    var gContainer = document.getElementById('gameContainer');
    var gameData = document.getElementById('gameData');
    var title = document.createElement('h2');
    var container = document.getElementById('container');
    var p1Name = document.createElement('h4');
    var p2Name = document.createElement('h4');
    p1Name.className = 'playerName';
    p2Name.className = 'playerName';
    p1Name.innerHTML = game.currentGame.p1;
    if (game.currentGame.p2 !== ''){
      p2Name.innerHTML = game.currentGame.p2;
    }
    else {
      p2Name.innerHTML = 'No Opponent';
    }
    container.classList.add('inGame');
    title.textContent = game.currentGame.name;
    var player1Data = document.createElement('div');
    player1Data.className = 'playerData player1';
    player1Data.appendChild(p1Name);
    var player2Data = document.createElement('div');
    player2Data.className = 'playerData player2';
    player2Data.appendChild(p2Name);
    var board = document.createElement('div');
    board.id = 'board';
    for(let index in game.currentGame.board){
    element = game.currentGame.board[index];
      var box = document.createElement('div');
      box.id = index;
      box.className = 'square s' + index.toString();
      if (element.user === 1) {
        box.classList.add('p1');
      }
      if (element.user === 2) {
        box.classList.add('p2');
      }
      board.appendChild(box);
    }
    gameData.appendChild(title);
    gContainer.appendChild(player1Data);
    gContainer.appendChild(board);
    gContainer.appendChild(player2Data);
    this.createSettingsButton(gameData);
    // this.createScoreboard(gameData);
    this.createQuitButton(gameData);
  },
  // Removes game board on quit
  quitGame: function(){
    var container = document.getElementById('gameContainer');
    var gameData = document.getElementById('gameData');
    while(container.hasChildNodes()){
      container.removeChild(container.lastChild);
    }
    while(gameData.hasChildNodes()){
      gameData.removeChild(gameData.lastChild);
    }
  },
  // Clears inputs and displays changed game name
  updateInfo: function(name, p1, p2){
    var gameName = document.querySelector('h2');
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input, index){
      if (index < 3) {
      input.value = '';
      }
    });
    gameName.textContent = name;
    this.toggleOverlay();
  },
  // Changes box to show player control
  changeBox: function(square){
    var box = game.currentGame.board;
    if (game.currentGame.turn === 1){
      square.classList.add('p1');
    }
    else {
      square.classList.add('p2');
    }
  },
  // Resets all boxes to show neutral
  resetBoxes: function(){
    var boxes = document.querySelectorAll('div.square');
    boxes.forEach(function(box){
      box.classList.remove('p1', 'p2');
    });
  },
  // Creates a start button
  createStartButton: function(){
    var container = document.getElementById('gameContainer');
    var startGameButton = document.createElement('button');
    startGameButton.className = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
    startGameButton.id = 'startGameButton';
    startGameButton.textContent = 'Start Game';
    container.appendChild(startGameButton);
  },
  // Removes start button
  removeStartButton: function(){
    var container = document.getElementById('gameContainer');
    var startGameButton = document.getElementById('startGameButton');
    startGameButton = document.getElementById('startGameButton');
    container.removeChild(startGameButton);
  },
  // Creates a quit button
  createQuitButton: function(elm){
    var quitButton = document.createElement('button');
    quitButton.id = 'quitButton';
    quitButton.className = 'mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored';
    quitButton.innerHTML = '<i class="material-icons">exit_to_app</i>';
    quitButton.onclick = function(){
      handlers.quitGame();
    };
    elm.appendChild(quitButton);
  },
  createScoreboard: function(elm){
    var scoreboard = document.createElement('div');
    var score = document.createElement('h4');
    scoreboard.className = 'scoreboard';
    score.className = 'score';
    score.innerHTML = game.currentGame.p1wins + ' - ' + game.currentGame.draws + ' - ' + game.currentGame.p2wins;
    scoreboard.appendChild(score);
    elm.appendChild(scoreboard);
  },
  // Creates a settings button
  createSettingsButton: function(elm){
    var settingsButton = document.createElement('button');
    settingsButton.innerHTML = '<i class="material-icons">settings</i>';
    settingsButton.className = 'settings mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored';
    settingsButton.onclick = function(){view.toggleOverlay();};
    elm.appendChild(settingsButton);
  },
  // Creates a logout button
  createLogoutButton: function(){
    var header = document.querySelector('header');
    var logoutButton = document.createElement('button');
    logoutButton.id = 'logout';
    logoutButton.className = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
    logoutButton.textContent = 'Logout';
    logoutButton.onclick = function(){
      handlers.logout();
    };
    header.appendChild(logoutButton);
  },
  // Removes the logout button
  removeLogoutButton: function(){
    var header = document.querySelector('header');
    var logoutButton = document.getElementById('logout');
    header.removeChild(logoutButton);
  },
  removeTitle: function(){
    var container = document.getElementById('container');
    var header = document.querySelector('h1');
    container.removeChild(header);
  },
  showTitle: function(){
    var container = document.getElementById('container');
    var header = document.createElement('h1');
    header.innerHTML = 'TACTIC';
    container.insertBefore(header, container.firstChild);
  },
  turnToast: function(message){
  'use strict';
  var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = {message: message};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  },
  // Sets up Event listeners
  setUpEventListeners: function(){
    if (this.eventListeners === false){
    var container = document.getElementById('container');
    container.addEventListener('click', function(event){
      var elementClicked = event.target;
      // If target is game, loads a game
      if (elementClicked.className === 'game') {
        handlers.selectGame(elementClicked.firstChild.innerHTML, false);
      }
      if (elementClicked.className === 'openGame'){
        handlers.selectGame(elementClicked.firstChild.innerHTML, true);
      }
      if (elementClicked.parentNode && elementClicked.parentNode.className === 'game') {
        handlers.selectGame(elementClicked.parentNode.firstChild.innerHTML, false);
      }
      if (elementClicked.parentNode && elementClicked.parentNode.className === 'openGame') {
        handlers.selectGame(elementClicked.parentNode.firstChild.innerHTML, true);
      }
      // If target is start button, starts a game
      if (elementClicked.id === 'startGameButton'){
        handlers.startGame();
      }
      // If target is a square, takes a turn
      if (elementClicked.classList.contains('square')){
        handlers.takeTurn(elementClicked.id, elementClicked);
      }
    });
    // prevents multiple loads of eventListeners
    this.eventListeners = true;
    }
  },
  toggleOverlay: function(){
    document.body.classList.toggle('settingsOverlay');
  }
};


// Authorization object with user methods
var authentication = {
  inGame: false,
  userRef: null,
  users: [],
  currentUser: null,
  config: {
    apiKey: "AIzaSyDsmX3bGT-UqGRJdoYuzM0LnzbwLLsOewA",
    authDomain: "steves.firebaseapp.com",
    databaseURL: "https://steves.firebaseio.com",
    storageBucket: "firebase-steves.appspot.com",
    messagingSenderId: "726653008276"
  },
  initialize: function(){
    firebase.initializeApp(this.config);
    firebase.auth().onAuthStateChanged(function(user){
      console.log('initialized');
      //////// maybe here ///////
      if (user) {
        if (authentication.userRef === null) {
          game.gamesRef = firebase.database().ref('/games');
          authentication.currentUser = user;
          authentication.usersRef = firebase.database().ref('/users');
          handlers.loadUser(user);
          game.findUserGames(user);
          authentication.usersRef.orderByChild("name").equalTo(user.displayName)
          .once('value').then(function(datasnapshot){
          authentication.userRef = firebase.database().ref('/users/' + user.uid);
          if (datasnapshot.val() === null) {
            console.log('creating user');
            authentication.userRef.set({
            name: user.displayName,
            wins: 0,
            losses: 0,
            draws: 0,
          });
          }
        });
        }
     }
      else {
        console.log('loggedOut');
        authentication.currentUser = null;
        handlers.logIn();
      }
    });
  },
  signIn: function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  },
  signOut: function(){
    authentication.userRef = null;
    firebase.auth().signOut();
  },
  // Creates a new user and adds it to users array
  newUser: function(name, password){
    var user = {
      name: name,
      password: password
    };
    this.users.push(user);
  },
  // Finds user from the users array
  findUser: function(input){
    for (var i = 0; i < this.users.length; i++){
      if (this.users[i].name === input){
        return this.users[i];
      }
    }
  }
};
// On page load sets authorization
window.onload = function(){
  handlers.loadApp();
};