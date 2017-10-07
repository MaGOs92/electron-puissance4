const {dialog, BrowserWindow, app, ipcMain, Tray} = require('electron')
const Puissance4 = require('./puissance4');
const minMaxWorker = require('child_process').fork(`${__dirname}/minmax`);

let browserWindow, tray, game;

const createBrowserWindow = () => {
    browserWindow = new BrowserWindow();
    browserWindow.maximize();
    browserWindow.loadURL(`file://${__dirname}/client/index.html`);
}

const createTray = () => {
    tray = new Tray(`${__dirname}/client/img/red.png`);
    tray.setToolTip('A vous de jouer.');
}

const updateTray = (event) => {
    let image, tooltip;
    if (event === 'humanMoved') {
        image = `${__dirname}/client/img/yellow.png`
        tooltip = 'A Electron de jouer';
    } else {
        image = `${__dirname}/client/img/red.png`
        tooltip = 'A vous de jouer';
    }
    tray.setImage(image);
    tray.setToolTip(tooltip);
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
    updateTray(event);
}

app.on('ready', () => {
    createBrowserWindow();
    createTray();
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