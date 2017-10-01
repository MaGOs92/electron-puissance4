const ipcRemote = require('electron').remote.require('./main');
const ipcRenderer = require('electron').ipcRenderer;

var board;
var humanCanPlay;


function updateCase(id, player){
  var node = document.getElementById(id).childNodes[0];
  switch(player){
    case 1:
      node.classList.remove("vide");
      node.classList.remove("jaune");
      node.classList.add("rouge");
      break;
    case 2: 
      node.classList.remove("vide");
      node.classList.remove("rouge");
      node.classList.add("jaune");
      break;
    default:
      node.classList.remove("jaune");
      node.classList.remove("rouge");
      node.classList.add("vide");
  }
}

function updateGrid(board){
  for (var i=0; i<7; i++){
    for (var j=0; j<6; j++){
      var id = i + '' + j;
      updateCase(id, board[i][j]);
    }
  }
}

function displayGameOver(player){
  humanCanPlay = false;
  displayTurn(0);
  var gameOverDiv = document.getElementById('gameover');
  gameOverDiv.classList.remove('hidden');
  var text;
  switch(player){
    case 1:
      text = 'Vous avez gagné!';
      break;
    case 2: 
      text = 'Electron a gagné!';
      break;
    default:
      text = 'Match nul!';
      break;
  }
  gameOverDiv.childNodes[0].textContent = text;
}

function displayTurn(turn){
  const displayHumanTurnDiv = document.getElementById('humanTurn');
  const displayIaTurnDiv = document.getElementById('iaTurn');
  switch(turn) {
    case 1:
      displayHumanTurnDiv.classList.remove('hidden');
      displayIaTurnDiv.classList.add('hidden');
      break;
    case 2:
      displayHumanTurnDiv.classList.add('hidden');
      displayIaTurnDiv.classList.remove('hidden');
    break;
    default:
      displayHumanTurnDiv.classList.add('hidden');
      displayIaTurnDiv.classList.add('hidden');
      break;
  }
}

function hideGameOver(){
  var gameOverDiv = document.getElementById('gameover');
  gameOverDiv.classList.add('hidden');
}

function newGame(){
  ipcRemote.newGame().then((data) => {
    board = data.board;
    updateGrid(board);
    displayTurn(1);    
    humanCanPlay = true;
    hideGameOver();
  });
}

function checkMoveLegal(column){
  if (board[column][5] === 0){
    return true;
  }
}

function play(column){
  console.log('play' + column);
  if (humanCanPlay && checkMoveLegal(column)){
    humanCanPlay = false;
    ipcRemote.humanPlays({
      column: column
    });
  }
}

ipcRenderer.on('humanMoved', (event, data) => {
  console.log('Event : humanMoved');
  updateGrid(data.board);
  displayTurn(2);  
  if (data.gameOver !== 0){
    displayGameOver(data.gameOver);
  }
});

ipcRenderer.on('iaMoved', (event, data) => {
  console.log('Event : iaMoved');
  updateGrid(data.board);
  if (data.gameOver !== 0){
    displayGameOver(data.gameOver);
  }
  humanCanPlay = true;
  displayTurn(1);  
});

newGame();
