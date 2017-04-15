var game = {
  board: [],
  turn: 1,
  p1: '',
  p2: '',
  p1wins: 0,
  p2wins: 0,
  name: '',
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
    // debugger;
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
      this.resetGame();}
    else if (square[3].user === square[4].user && square[4].user === square[5].user && square[3].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (square[6].user === square[7].user && square[7].user === square[8].user && square[6].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (square[0].user === square[3].user && square[6].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (square[1].user === square[4].user && square[7].user === square[1].user && square[1].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (square[2].user === square[5].user && square[8].user === square[2].user && square[2].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (square[0].user === square[4].user && square[8].user === square[0].user && square[0].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (square[6].user === square[4].user && square[2].user === square[6].user && square[6].user !== 0){
      console.log(player + " wins!");
      this.resetGame();}
    else if (this.turn === 9){confirm("Cats Game. Play again?");
      this.resetGame();}
    else {return;}
  }
};

var handlers = {
  // Change player name
  changePlayerName: function(){

  },
  // Change game name
  changeGameName: function(){

  },
  // New game
  newGame: function(){

  },
  // Reset game
  resetGame: function(){

  },
  // Take turn
  takeTurn: function(){
    
  }
};