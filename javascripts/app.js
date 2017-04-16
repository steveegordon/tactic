var game = {
  games: [],
  currentGame: null,
  updateInfo: function(name, p1, p2){
    this.currentGame.name = name;
    this.currentGame.p1 = p1;
    this.currentGame.p2 = p2;
  },
  createGame: function(){
    var newGame = {
      board:[],
      totalTurn: 0,
      turn: 1,
      p1: '',
      p2: '',
      p1wins: 0,
      p2wins: 0,
      name: Math.floor((Math.random() * 10000) + 1),
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
  selectGame: function(name){
    for (var i = 0; i < this.games.length; i++){
      if (this.games[i].name === name) {
        this.currentGame = this.games[i];
      }
    }
  },
  resetGame: function(){
    this.currentGame.board.forEach(function(box){
      box.user = 0;
    });
    this.currentGame.totalTurn = 0;
  },
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

var handlers = {
  logIn: function(name, password){
    auth.logIn(name, password);
    if (auth.loggedIn()){
      view.toggleAuthOverlay(true);
      view.displayUserData();
    }
    else{view.toggleAuthOverlay(false);
    }
  },
  updateInfo: function(name, p1, p2){
    game.updateInfo(name, p1, p2);
    view.updateInfo(game.currentGame.name, game.currentGame.p1, game.currentGame.p2);
  },
  // New game
  startGame: function(){
    game.createGame();
    view.displayGame();
    view.setUpEventListeners();
  },
  // Reset game
  resetGame: function(){
    game.resetGame();
    view.resetBoxes();
  },
  // Take turn
  takeTurn: function(id, square){
    if (square.classList.length === 1){
      view.changeBox(square);
      game.changeBox(id);
    }
  },
  quitGame: function(){
    game.quitGame();
    view.quitGame();
  },
  logout: function(){
    game.quitGame();
    auth.logout();
    this.logIn();
  }
};

var view = {
  displayUserData: function(){
    this.createLogoutButton();
  },
  displayGame: function(){
    var container = document.getElementById('container');
    var startGameButton = document.getElementById('startGameButton');
    var header = document.querySelector('header');
    var title = document.createElement('h1');
    title.textContent = "New Game";
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
      board.appendChild(box);
    });
    container.removeChild(startGameButton);
    header.appendChild(title);
    container.appendChild(player1Data);
    container.appendChild(board);
    container.appendChild(player2Data);
    this.createSettingsButton(header);
    this.createQuitButton(header);
  },
  quitGame: function(){
    var container = document.getElementById('container');
    var header = document.querySelector('header');
    while(container.hasChildNodes()){
      container.removeChild(container.lastChild);
    }
    while(header.hasChildNodes()){
      header.removeChild(header.lastChild);
    }
    container.appendChild(this.createStartButton());
  },
  updateInfo: function(name, p1, p2){
    var gameName = document.querySelector('h1');
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input){
      input.value = '';
    });
    gameName.textContent = name;
    this.toggleOverlay();
  },
  changeBox: function(square){
    var box = game.currentGame.board;
    if (game.currentGame.turn === 1){
      square.classList.add('p1');
    }
    else {
      square.classList.add('p2');
    }
  },
  resetBoxes: function(){
    var boxes = document.querySelectorAll('div.square');
    boxes.forEach(function(box){
      box.classList.remove('p1', 'p2');
    });
  },
  createStartButton: function(){
    var startGameButton = document.createElement('button');
    startGameButton.id = 'startGameButton';
    startGameButton.textContent = 'Start Game';
    startGameButton.onclick = function(){
      handlers.startGame();
    };
    return  startGameButton;
  },
  createQuitButton: function(header){
    var quitButton = document.createElement('button');
    quitButton.id = 'quitButton';
    quitButton.textContent = "Quit Game";
    quitButton.onclick = function(){
      handlers.quitGame();
    };
    header.appendChild(quitButton);
  },
  createSettingsButton: function(header){
    var settingsButton = document.createElement('button');
    settingsButton.className = 'settings';
    settingsButton.textContent = 'Settings';
    settingsButton.onclick = function(){view.toggleOverlay();};
    header.appendChild(settingsButton);
  },
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
  toggleOverlay: function(){
   document.body.classList.toggle('settingsOverlay');
  },
  setUpEventListeners: function(){
    var area = document.getElementById('board');
    area.addEventListener('click', function(event){
      var square = event.target;
      handlers.takeTurn(square.id, square);
    });
  },
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
        var inputdiv = document.createElement('div');
        var form = document.createElement('form');
        authOverlay.id = 'authOverlay';
        input1.name = 'name';
        input2.name = 'password';
        input3.value = 'Submit';
        input3.type = 'submit';
        input1.className = 'authInput';
        input2.className = 'authInput';
        input3.className = 'authInput';
        form.id = 'authForm';
        form.appendChild(input1);
        form.appendChild(input2);
        form.appendChild(input3);
        authOverlay.appendChild(form);
        form.onsubmit = function(){
          var name = input1.value;
          var password = input2.value;
          handlers.logIn(name, password);
          return false;
        };
        document.body.insertBefore(authOverlay, document.body.firstChild);
      }
    }
  },
};



var auth = {
  users: [],
  currentUser: null,
  loggedIn: function(){
  if (this.currentUser){
    return true;
  }
  else {
    return false;
  }
  },
  newUser: function(name, password){
    var user = {
      name: name,
      password: password
    };
    this.users.push(user);
  },
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
  logout: function(){
    this.currentUser = null;
    this.loggedIn();
  },
  findUser: function(input){
    for (var i = 0; i < this.users.length; i++){
      if (this.users[i].name === input){
        return this.users[i];
      }
    }
  }
};

window.onload = function(){
  handlers.logIn();
};