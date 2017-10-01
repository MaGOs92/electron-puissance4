const Puissance4 = require('./puissance4');
const DEPTH = process.argv[2] || 4;

class MinMax {

  minmax(board) {
    let moveToPlay;
    let bestMax = -Infinity;
    let game = new Puissance4(board);
    game.board.forEach((col, index) => {
      if (game.isMoveLegal(index)){
        let cloneBoard = this.copyBoard(game.board);
        let child = new Puissance4(cloneBoard);
        child.updateBoard(index, 2);
        let curMax = this.min(child, DEPTH);
        console.log('minmax: curMax => ', curMax, 'index => ', index);
        if (curMax > bestMax){
          bestMax = curMax;
          moveToPlay = index;
        }
      }
    });
    console.log('bestMax: ', bestMax, 'moveToPlay => ', moveToPlay);
    return moveToPlay;
  }

  min(game, depth){
    game.checkWin();
    if (game.gameOver === 1){
      return -depth;
    }
    else if (game.gameOver === 2){
      return depth;
    }
    else if (game.gameOver === 3 || depth <= 0){
      return 0;
    }

    let bestMin = Infinity;
    for (let i = 0; i < 7; i++){
      if (game.isMoveLegal(i)){
        const cloneBoard = this.copyBoard(game.board);
        let child = new Puissance4(cloneBoard);
        child.updateBoard(i, 1);
        const nextDepth = depth - 1;
        let curMin = this.max(child, nextDepth);
        if (curMin < bestMin) bestMin = curMin;
      }
    }
    return bestMin;
  }

  max(game, depth){
    game.checkWin();
    if (game.gameOver === 1){
      return -depth;
    }
    else if (game.gameOver === 2){
      return depth;
    }
    else if (game.gameOver === 3 || depth <= 0){
      return 0;
    }

    let bestMax = -Infinity;
    for (let i = 0; i < 7; i++){
      if (game.isMoveLegal(i)){
        const cloneBoard = this.copyBoard(game.board);
        let child = new Puissance4(cloneBoard);
        child.updateBoard(i, 2);
        const nextDepth = depth - 1;
        let curMax = this.min(child, nextDepth);
        if (curMax > bestMax) bestMax = curMax;
      }
    }
    return bestMax;
  }

  copyBoard(oldBoard) {
    let board = new Array();
    for (let i = 0; i < 7; i++){
      board[i] = new Array();
      for (let j = 0; j < 6; j++){
        board[i][j] = oldBoard[i][j];
      }
    }
    return board;
  }
}

const ia = new MinMax();

process.on('message', (game) => {
  const move = ia.minmax(game);
  process.send(move);
});
