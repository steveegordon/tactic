// Object holds Games and game logic
var game = {
  games: [],
  currentGame: null,
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
  },
  // Creates a new game object and loads to games array
  createGame: function(){
    var newGame = {
      board:[],
      totalTurn: 0,
      turn: 1,
      p1: auth.currentUser.name,
      p2: '',
      p1wins: 0,
      p2wins: 0,
      name: Math.floor((Math.random() * 10000) + 1).toString(),
    };
    for (var i = 0; i < 9; i++){
      newGame.board.push({
        square: i,
        user: 0
      });
    }
    this.games.push(newGame);
    this.selectGame(newGame.name);
  },
  // Searches through games array and finds users games
  findUserGames: function(){
    var currentUser = auth.currentUser.name;
    var userGames = [];
    if (this.games.length > 0){
      for (var i = 0; i < this.games.length; i++){
        if (currentUser === this.games[i].p1 || this.games[i].p2){
          userGames.push(this.games[i]);
        }
      }
    }
    return userGames;
  },
  // Sets game by name to currentGame
  selectGame: function(name){
    for (var i = 0; i < this.games.length; i++){
      if (this.games[i].name === name) {
        this.currentGame = this.games[i];
      }
    }
  },
  // Resets current game board
  resetGame: function(){
    this.currentGame.board.forEach(function(box){
      box.user = 0;
    });
    this.currentGame.totalTurn = 0;
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
    else {return;}
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
    this.currentGame = null;
  }
};
// Object controls major actions
var handlers = {
  // Creates new user, linked to authOverlay button
  newUser: function(name, password){
    auth.newUser(name, password);
    this.logIn(name, password);
  },
  // Logs in existing user, linked to authOverlay submit
  logIn: function(name, password){
    auth.logIn(name, password);
    if (auth.loggedIn()){
      view.toggleAuthOverlay(true);
      view.createStartButton();
      view.displayUserData();
      view.setUpEventListeners();
      this.loadGames();
    }
    else{view.toggleAuthOverlay(false);
    }
  },
  // Finds and displays user games on log in and quit game
  loadGames: function(){
    view.displayUserGames(game.findUserGames());
  },
  // Changes users/game name, linked to settingsOverlay submit
  updateInfo: function(name, p1, p2){
    game.updateInfo(name, p1, p2);
    view.updateInfo(game.currentGame.name, game.currentGame.p1, game.currentGame.p2);
  },
  // Creates a new game, linked to start button
  startGame: function(){
    view.removeStartButton();
    view.removeUserGames();
    game.createGame();
    view.displayGame();
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
  quitGame: function(){
    var board = document.getElementById('board');
    game.quitGame();
    view.quitGame();
    view.createStartButton();
    this.loadGames();
  },
  // Logs currentUser out, Linked to logout button
  logout: function(){
    this.quitGame();
    auth.logout();
    view.removeStartButton();
    view.removeUserGames();
    view.removeLogoutButton();
    this.logIn();
  },
  // Selects game from games, run on startGame and view.setUpEventListeners
  selectGame: function(picked){
    var startbutton = document.getElementById('startGameButton');
    view.removeStartButton();
    view.removeUserGames();
    game.selectGame(picked);
    view.displayGame();
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
  displayUserGames: function(a){
    var container = document.getElementById('gameData');
    var gameContainer = document.createElement('div');
    gameContainer.id = 'gamesContainer';
    a.forEach(function(item){
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
    game.currentGame.board.forEach(function(square, index){
      var box = document.createElement('div');
      box.id = index;
      box.className = 'square';
      if (square.user === 1) {
        box.classList.add('p1');
      }
      if (square.user === 2) {
        box.classList.add('p2');
      }
      board.appendChild(box);
    });
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
    console.log(startGameButton);
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
        console.log(elementClicked);
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
    if (answer === true){
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
var auth = {
  users: [],
  currentUser: null,
  // Returns true if a user is logged in
  loggedIn: function(){
  if (this.currentUser){
    return true;
  }
  else {
    return false;
  }
  },
  // Creates a new user and adds it to users array
  newUser: function(name, password){
    var user = {
      name: name,
      password: password
    };
    this.users.push(user);
  },
  // Checks User Credentials and logs in or denies
  logIn: function(user, password){
    var checkUser = this.findUser(user);
    if (checkUser){
      if (checkUser.password === password){
        console.log('welcome user');
        this.currentUser = checkUser;
        this.loggedIn();
      }
      else {
        console.log('incorrect password');
      }
    }
    else {
      console.log('no user found');
    }
  },
  // Logs current user out
  logout: function(){
    this.currentUser = null;
    this.loggedIn();
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
  handlers.logIn();
};