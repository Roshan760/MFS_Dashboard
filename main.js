
//const {ElectronService}=require('ngx-electron')
const {app, BrowserWindow, ipcMain, session} = require('electron')
const { IPC_MESSAGES } = require('./constants');
const { callEndpointWithToken } = require('./fetch');
require('dotenv').config()
const AuthProvider = require('./AuthProvider');


const authProvider = new AuthProvider();
  const url = require("url");
  const path = require("path");
const { resolveForwardRef } = require('@angular/core');
  var temp=[];
  var mainWindow;
  var landingPage='login';
  let test;
  var sqlite3 = require('sqlite3').verbose();
  var account = null;
  //var db = new sqlite3.Database('./table.db',sqlite3.OPEN_READWRITE,(err)=>{
  var db = new sqlite3.Database('C:\\Users\\INFRKX\\Downloads\\Angular-sqlite_NM_AD_WS\\Angular-sqlite_NM\\src\\assets\\synch\\infsay.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err){
  console.error(err.message);
  }
  console.log('connected')
  });
  

  function loadFile() {
    mainWindow.loadFile('./src/newBuild/index.html')
  }

  
  function createWindow () {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    
    loadFile()
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', createWindow)

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    if (mainWindow === null) createWindow()

  })
  console.log("inside main")

  ipcMain.on('getLandingPage', (event,data)=> {
    console.log('MAIN.JS--> getLandingPage event listened')
    mainWindow.webContents.send('landingPage',{'page': landingPage, 'account':account})
  })

  ipcMain.on('Insert',(event,data)=>{
    console.log("inside res")
    console.log("data: ",data)
    console.log('Print to the main process terminal (STDOUT) when signal received from renderer process.');
    var stmt = db.prepare("INSERT INTO demo(Name) VALUES (?)");
    for (var i = 0; i < 1; i++) {
        stmt.run("Ipsum " + data);
    }
    // mainWindow.webContents.send('other-custom-signal', array);
    stmt.finalize();

  })
  ipcMain.on('Fetch',(event,data)=>{
    console.log("inside Fetch")
    console.log("data: ",data)
    const sqlStatement="SELECT * FROM mfs_task_details"
      db.all(sqlStatement,[],(err, rows ) => {
        if (err) {
          throw err;
        }
      mainWindow.webContents.send('other-custom-signal', rows); 
    });
      
      mainWindow.webContents.send('landingPage',{'page':landingPage, 'account': account})
  })
  ipcMain.on('test',(event,data)=>{
    console.log("inside test")
    console.log("data: ",data)
    var result;
    var exec = require('child_process').exec, child;
    console.log('calling java');
    //console.log(exec.caller);
    //const childPorcess = exec('java -jar C:\\Node_Trails\\hello-world\\invoke-jar.jar "Jar is invoked by Node js"', function(err, stdout, stderr) {
    child = exec('java -jar C:\\Users\\INFRKX\\Downloads\\Angular-sqlite_NM_AD_WS\\Angular-sqlite_NM\\src\\assets\\synch\\MFS_Sync_Service.jar 430610 ',
    function(err, stdout, stderr) {
        if (err) {
          result="failed"
            console.log(err)
            mainWindow.webContents.send('synchresult', result);
        }
        console.log(stdout);
        if(stdout!=null){
          console.log("inside stdout")
          result="completed";
          mainWindow.webContents.send('synchresult', result);
        }
    });
    //console.log('Print to the main process terminal (STDOUT) when signal received from renderer process.');

  })
ipcMain.on(IPC_MESSAGES.LOGOUT, async() => {
  try{
    if(account != null) {      
      await authProvider.logout();
      session.defaultSession.clearStorageData([], (data) => {}) 
      account = null;
    }

    loadFile();
    landingPage='login'
    mainWindow.webContents.send('landingPage',{'page': landingPage, 'account': account})
  }catch (e){
    console.log('Logout failed due to :'+e)
  }
    
});

ipcMain.on(IPC_MESSAGES.LOGIN, async() => {
  try{
    console.log('MAIN.JS-> Line 84 received login')
  account = await authProvider.login(mainWindow);
  loadFile();
  landingPage='dashboard'  
  mainWindow.webContents.send('landingPage', {'page':landingPage, 'account': account});
  }catch(e){
    console.log('Exception found',e)
  }
  
});



ipcMain.on(IPC_MESSAGES.GET_PROFILE, async() => {
    
  const tokenRequest = {
      scopes: ['User.Read'],
  };

  const token = await authProvider.getToken(mainWindow, tokenRequest);
  const account = authProvider.account

  await loadFile();

  const graphResponse = await callEndpointWithToken(`${process.env.GRAPH_ENDPOINT_HOST}${process.env.GRAPH_ME_ENDPOINT}`, token);

  mainWindow.webContents.send(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, account);
  mainWindow.webContents.send(IPC_MESSAGES.SET_PROFILE, graphResponse);
});
