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
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[3].user === square[4].user && square[4].user === square[5].user && square[3].user !== 0){
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[6].user === square[7].user && square[7].user === square[8].user && square[6].user !== 0){
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[0].user === square[3].user && square[6].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[1].user === square[4].user && square[7].user === square[1].user && square[1].user !== 0){
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[2].user === square[5].user && square[8].user === square[2].user && square[2].user !== 0){
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[0].user === square[4].user && square[8].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      this.addWin(player);
      handlers.resetGame();}
    else if (square[6].user === square[4].user && square[2].user === square[6].user && square[6].user !== 0){
      console.log(player + " wins!");
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
  updateInfo: function(name, p1, p2){
    game.updateInfo(name, p1, p2);
    view.updateInfo(game.name, game.p1, game.p2);
  },
  // New game
  startGame: function(){
    game.createGame();
    view.displayGame();
    this.boardClicks();
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
  boardClicks: function(){
    var area = document.getElementById('board');
    area.addEventListener('click', function(event){
      var square = event.target;
      handlers.takeTurn(square.id, square);
    });
  }
};

var view = {
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
  },
  updateInfo: function(name, p1, p2){
    var gameName = document.querySelector('h1');
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
  createSettingsButton: function(header){
    var settingsButton = document.createElement('button');
    settingsButton.className = 'settings';
    settingsButton.onclick = function(){view.toggleOverlay();};
    header.appendChild(settingsButton);
  },
  toggleOverlay: function(){
   document.body.classList.toggle('overlay');
  }
};



var auth = {
  users: [],
  currentUser: null,
  loggedIn: function(){
  if (this.currentUser){
    console.log('logged in');
  }
  else {
    console.log('please log in');
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
  auth.loggedIn();
};