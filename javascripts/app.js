var game = {
  board: [],
  turn: 1,
  p1: '',
  p2: '',
  p1wins: 0,
  p2wins: 0,
  name: '',
  updateInfo: function(name, p1, p2){
    this.name = name;
    this.p1 = p1;
    this.p2 = p2;
  },
  createGame: function(){
    for (var i = 0; i < 9; i++){
      this.board.push({
        square: i,
        user: 0
      });
    }
  },
  resetGame: function(){
    this.board.forEach(function(box){
      box.user = 0;
    });
  },
  changeBox: function(number){
    var square = this.board[number];
    var playerTurn = this.turn;
    if (square.user === 0){
      if (playerTurn === 1){
        square.user = 1;
        this.turn = 2;
        this.checkWin(playerTurn);
      }
      else {
        square.user = 2;
        this.turn = 1;
        this.checkWin(playerTurn);
      }
    }
  },
  checkWin: function(player){
    var square = this.board;
    if (square[0].user === square[1].user && square[2].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[3].user === square[4].user && square[4].user === square[5].user && square[3].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[6].user === square[7].user && square[7].user === square[8].user && square[6].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[0].user === square[3].user && square[6].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[1].user === square[4].user && square[7].user === square[1].user && square[1].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[2].user === square[5].user && square[8].user === square[2].user && square[2].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[0].user === square[4].user && square[8].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (square[6].user === square[4].user && square[2].user === square[6].user && square[6].user !== 0){
      console.log(player + " wins!");
      handlers.resetGame();}
    else if (this.turn === 9){confirm("Cats Game. Play again?");
      handlers.resetGame();}
    else {return;}
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
    game.board.forEach(function(square, index){
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
    var box = game.board;
    if (game.turn === 1){
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