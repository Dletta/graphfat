const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 1200})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/Graph.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  for(var i = 0;i < timerList.length;i++){
    clearInterval(timerList[i])
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

const fs = require('fs')
const os = require('os')

var file1 = {}
var file2 = {}
var timerList = []
var gData1 = []
var gData2 = []

console.log("Started");

ipcMain.on('ready', (ev, filepath, file2path) => {
  console.log(`received ${filepath} and ${file2path}`);
  if(filepath != 'None'){
    file1['path'] = filepath
    file1['mess'] = 'file1'
    setupWatcher(file1)
  }

  if(file2path != 'None'){
    file2['path'] = file2path
    file2['mess'] = 'file2'
    setupWatcher(file2)
  }

})

var setupWatcher = function(fileObj) {
  fileObj['pos'] = fs.statSync(fileObj.path).size
  fileObj['fd'] = fs.openSync(fileObj.path, 'r')
  console.log('Watching: ' + fileObj);

  var timer = setInterval(() => {
    var end = fs.statSync(fileObj.path).size
    var length = end - fileObj.pos
    var data = Buffer.alloc(length)

    /*console.log(`Read ${path} change of ${length} detected.`);*/
    if(length > 2) {
        fs.read(fileObj.fd,data, 0, length, fileObj.pos, (err, bytesRead, data) => {
          data = data.toString()
          fileObj['pos'] = fs.statSync(fileObj.path).size
          var array = data.split(os.EOL)
          for(var i = 0; i < array.length; i++){
            var time = new Date().getTime()
            var test = array[i].split(',')
            if(gData1[11] != test[11]){
              win.webContents.send('newData', fileObj.mess, array[i], time)
              gData1 = array[i]
            }
          }
        })
    }
  }, 500)
  timerList.push(timer)
}
