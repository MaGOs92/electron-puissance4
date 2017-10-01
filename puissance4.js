'use strict';

module.exports =  class Puissance4 {

  constructor(board){
    this.board = board || this.createBoard();
    this.gameOver = 0;
  }

  createBoard() {
    var board = new Array();
    for (var i = 0; i < 7; i++){
      board[i] = new Array();
      for (var j = 0; j < 6; j++){
        board[i][j] = 0;
      }
    }
    return board;
  }

  isMoveLegal(column){
    if (this.board[column][5] === 0){
      return true;
    }
  }

  updateBoard(column, player){
    for (let i=0; i<6; i++){
      if (this.board[column][i] === 0){
        return this.board[column][i] = player;
      }
    }
  }

  checkWin(){
    let tieGame = true;
    let result = 0;
    this.board.map((column, i) => {
      column.map((jeton, j) => {
        if (jeton === 0) {
          tieGame = false;
          return;
        }
        // Vérification gauche
        let countToWin = 1;
        let casesToVerify = 3;
        for (let k = i-1; k >= 0; k--){
          if (casesToVerify <= 0){
            break;
          }
          else if (this.board[k][j] === jeton){
            countToWin++;
          }
          casesToVerify--;
        }
        if (countToWin === 4){
          return result = jeton;
        }
        // Vérification droite
        countToWin = 1;
        casesToVerify = 3;
        for (let k = i+1; k < this.board.length; k++){
          if (casesToVerify <= 0){
            break;
          }
          else if (this.board[k][j] === jeton){
            countToWin++;
          }
          casesToVerify--;
        }
        if (countToWin === 4){
          return result = jeton;
        }
        // Vérification haut
        countToWin = 1;
        casesToVerify = 3;
        for (let k = j+1; k <= column.length; k++){
          if (casesToVerify <= 0){
            break;
          }
          else if (this.board[i][k] === jeton){
            countToWin++;
          }
          casesToVerify--;
        }
        if (countToWin === 4){
          return result = jeton;
        }
        // Vérification diagonale gauche
        countToWin = 1;
        casesToVerify = 3;
        let l = j+1;
        for (let k = i-1; k >= 0; k--){
          if (casesToVerify <= 0 || l >= column.length){
            break;
          }
          if (this.board[k][l] === jeton){
            countToWin++;
          }
          casesToVerify--;
          l++;
        }
        if (countToWin === 4){
          return result = jeton;
        }
        // Vérification diagonale droite
        countToWin = 1;
        casesToVerify = 3;
        l = j+1;
        for (let k = i+1; k < this.board.length; k++){
          if (casesToVerify <= 0 || l >= column.length){
            break;
          }
          else if (this.board[k][l] === jeton){
            countToWin++;
          }
          casesToVerify--;
          l++;
        }
        if (countToWin === 4){
          return result = jeton;
        }
      });
    });
    if (result === 1 || result === 2){
      this.gameOver = result;
    }
    else if (tieGame){
      this.gameOver = 3;
    }
  }
}
