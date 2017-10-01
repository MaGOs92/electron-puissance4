const {dialog, BrowserWindow, app, ipcMain} = require('electron')
const Puissance4 = require('./puissance4');
const minMaxWorker = require('child_process').fork('./minmax');

let browserWindow, game;

const createBrowserWindow = () => {
    browserWindow = new BrowserWindow();
    browserWindow.maximize();
    browserWindow.loadURL(`file://${__dirname}/client/index.html`);
}

const newGame = () => {
    console.log('new game');    
    return new Promise((resolve) => {
        game = new Puissance4();
        resolve(game);        
    });
}

const humanPlays = (data) => {
    console.log('humanPlays');
    game.updateBoard(data.column, 1);
    game.checkWin();
    emitGameUpdate('humanMoved');
    if (game.gameOver === 0) {
        minMaxWorker.send(game.board);        
    }
}

const emitGameUpdate = (event) => {
    console.log('emitGameUpdate : ', event);
    browserWindow.webContents.send(event, {
      gameOver: game.gameOver,
      board: game.board
    });
}

app.on('ready', () => {
    createBrowserWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

minMaxWorker.on('message', (move) => {
    game.updateBoard(move, 2);
    game.checkWin();
    emitGameUpdate('iaMoved');
});

module.exports.humanPlays = humanPlays;
module.exports.newGame = newGame;