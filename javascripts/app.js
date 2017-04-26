
// Object holds Games and game logic
var game = {
  gamesRef: null,
  games: [],
  currentGameRef: null,
  currentGame: null,
  userGames: [],
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
      turn: 1,
      p1: authentication.currentUser.displayName,
      p2: '',
      p1wins: 0,
      p2wins: 0,
      name: gameId,
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
        view.quitGame();
        view.displayGame(this.currentGame);
      });
    });
  },
  // Searches through games array and finds users games
  findUserGames: function(user){
    var allGames = firebase.database().ref("games").orderByChild("p1").equalTo(user.displayName);
    var showGames = new Promise(function(resolve, reject){
      allGames.on('child_added', function(snapshot){
        game.userGames.push(snapshot.val());
        resolve(game.userGames);
      });
    });
    showGames.then(function(val){
      if (authentication.inGame === false){
        handlers.loadGames();
      }
    });
  },
  // Sets game by name to currentGame
  selectGame: function(name){
      var gameId = null;
      var finder = new Promise(function(resolve, reject){
        firebase.database().ref("games").orderByChild("name").equalTo(name.toString())
        .once('value', function(snapshot){
        gameId = Object.keys(snapshot.val()).toString();
        console.log(gameId);
        // game.currentGame = snapshot.child(gameId).val();
        game.currentGameRef = firebase.database().ref('/games/' + gameId);
        resolve(game.currentGameRef);
      });
      });
        finder.then(function(val){
          val.on('value', function(snapshot){
            game.currentGame = snapshot.toJSON();
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
    this.currentGame.turn = 1;
    this.currentGameRef.update(this.currentGame);
  },
  // Logic for taking turns
  changeBox: function(number){
    var square = this.currentGame.board[number];
    var playerTurn = this.currentGame.turn;
    if (square.user === 0){
      if (playerTurn === 1){
        square.user = 1;
        this.currentGame.turn = 2;
        this.currentGame.totalTurn++;
        this.checkWin(playerTurn);
      }
      else {
        square.user = 2;
        this.currentGame.turn = 1;
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
      handlers.resetGame();}
    this.currentGameRef.update(this.currentGame);
  },
  // Gives winner a win
  addWin: function(player){
    if (player === 1){
      this.currentGame.p1wins++;
    }
    else {
      this.currentGame.p2wins++;
    }
  },
  quitGame: function(){
    if (this.currentGame === true){
    this.currentGameRef.off();
    this.currentGame = null;
    this.currentGameRef = null;
  }
}
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
      view.toggleAuthOverlay(true);
      view.createStartButton();
      view.displayUserData();
  },
  logIn: function(){
    authentication.signIn();
  },
  // Finds and displays user games on log in and quit game
  loadGames: function(){
    view.displayUserGames();
  },
  // Changes users/game name, linked to settingsOverlay submit
  updateInfo: function(name, p1, p2){
    game.updateInfo(name, p1, p2);
    view.updateInfo(game.currentGame.name, game.currentGame.p1, game.currentGame.p2);
  },
  // Creates a new game, linked to start button
  startGame: function(){
    authentication.inGame = true;
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
    if (square.classList.length === 1){
      view.changeBox(square);
      game.changeBox(id);
    }
  },
  // Quits current game, Linked to quitGame button
  quitGame: function(logout){
    authentication.inGame = false;
    var board = document.getElementById('board');
    game.quitGame();
    view.quitGame();
    view.createStartButton();
    if (logout !== true){
    this.loadGames();
    }
  },
  // Logs currentUser out, Linked to logout button
  logout: function(){
    this.quitGame(true);
    game.userGames = [];
    authentication.signOut();
    view.removeStartButton();
    view.removeUserGames();
    view.removeLogoutButton();
  },
  // Selects game from games, run on startGame and view.setUpEventListeners
  selectGame: function(picked){
    authentication.inGame = true;
    var startbutton = document.getElementById('startGameButton');
    view.removeStartButton();
    view.removeUserGames();
    game.selectGame(picked);
    // view.displayGame();
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
    var container = document.getElementById('gameData');
    var gameContainer = document.createElement('div');
    gameContainer.id = 'gamesContainer';
    game.userGames.forEach(function(item){
      var div = document.createElement('div');
      div.className = 'game';
      var p = document.createElement('p');
      p.innerHTML = item.name;
      div.appendChild(p);
      gameContainer.appendChild(div);
    });
    container.appendChild(gameContainer);
  },
  // Clears other games when game loads
  removeUserGames: function(){
    var gameContainer = document.getElementById('gamesContainer');
    if (gameContainer){
      gameContainer.parentNode.removeChild(gameContainer);
    }
  },
  // Displays game board and data on startGame and selectGame
  displayGame: function(){
    var container = document.getElementById('gameContainer');
    var gameData = document.getElementById('gameData');
    var title = document.createElement('h1');
    title.textContent = game.currentGame.name;
    var player1Data = document.createElement('div');
    player1Data.className = 'playerData';
    var player2Data = document.createElement('div');
    player2Data.className = 'playerData';
    var board = document.createElement('div');
    board.id = 'board';
    for(let index in game.currentGame.board){
    element = game.currentGame.board[index];
      var box = document.createElement('div');
      box.id = index;
      box.className = 'square';
      if (element.user === 1) {
        box.classList.add('p1');
      }
      if (element.user === 2) {
        box.classList.add('p2');
      }
      board.appendChild(box);
    }
    gameData.appendChild(title);
    container.appendChild(player1Data);
    container.appendChild(board);
    container.appendChild(player2Data);
    this.createSettingsButton(gameData);
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
    var gameName = document.querySelector('h1');
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input){
      input.value = '';
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
    quitButton.textContent = "Quit Game";
    quitButton.onclick = function(){
      handlers.quitGame();
    };
    elm.appendChild(quitButton);
  },
  // Creates a settings button
  createSettingsButton: function(elm){
    var settingsButton = document.createElement('button');
    settingsButton.className = 'settings';
    settingsButton.textContent = 'Settings';
    settingsButton.onclick = function(){view.toggleOverlay();};
    elm.appendChild(settingsButton);
  },
  // Creates a logout button
  createLogoutButton: function(){
    var header = document.querySelector('header');
    var logoutButton = document.createElement('button');
    logoutButton.id = 'logout';
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
  // Toggles the settings Overlay to be visible or not
  toggleOverlay: function(){
   document.body.classList.toggle('settingsOverlay');
  },
  // Sets up Event listeners
  setUpEventListeners: function(){
    if (this.eventListeners === false){
    var container = document.getElementById('container');
    container.addEventListener('click', function(event){
      var elementClicked = event.target;
      // If target is game, loads a game
      if (elementClicked.className === 'game'){
        handlers.selectGame(elementClicked.firstChild.innerHTML);
      }
      // If target is start button, starts a game
      if (elementClicked.id === 'startGameButton'){
        handlers.startGame();
      }
      // If target is a square, takes a turn
      if (elementClicked.className === 'square'){
        handlers.takeTurn(elementClicked.id, elementClicked);
      }
    });
    // prevents multiple loads of eventListeners
    this.eventListeners = true;
    }
  },
  // Toggles login page
  toggleAuthOverlay: function(answer){
    if (true){
      document.body.removeChild(document.body.firstChild);
    }
    else {
      if (document.body.firstChild.id != 'authOverlay'){
        var authOverlay = document.createElement('div');
        var input1 = document.createElement('input');
        var input2 = document.createElement('input');
        var input3 = document.createElement('input');
        var input4 = document.createElement('input');
        var inputdiv = document.createElement('div');
        var form = document.createElement('form');
        authOverlay.id = 'authOverlay';
        input1.name = 'name';
        input2.name = 'password';
        input3.value = 'Log In';
        input3.type = 'submit';
        input4.value = 'Create User';
        input4.type = 'button';
        input1.className = 'authInput';
        input2.className = 'authInput';
        input3.className = 'authInput';
        input4.className = 'authInput';
        form.id = 'authForm';
        form.appendChild(input1);
        form.appendChild(input2);
        form.appendChild(input3);
        form.appendChild(input4);
        authOverlay.appendChild(form);
        input4.onclick = function(){
          var name = input1.value;
          var password = input2.value;
          handlers.newUser(name, password);
        };
        form.onsubmit = function(){
          var name = input1.value;
          var password = input2.value;
          handlers.logIn(name, password);
          return false;
        };
        document.body.insertBefore(authOverlay, document.body.firstChild);
      }
    }
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
      if (user) {
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
            games: []
          });
          }
        });
      }
      else {
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