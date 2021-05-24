import { IpcRenderer } from 'electron';
import { Component,NgZone,OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { BrowserWindow } from 'electron';
//import { ElectronService} from 'ngx-electron';
//const {app, BrowserWindow, ipcMain} = require('electron')
//const electron = require('electron');
//import { } from 'electron';
//const {app} = require('electron')
//const electron = require('electron');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'electron-demo';
  // constructor(private _electronService: ElectronService) {
    //electron.ipcRenderer.on('other-custom-signal', (event,arg) => {
      //console.log('Received acknowledged from backend about receipt of our signal.');
      //console.log(event);
      //console.log(arg);   })

  //   console.log('Sending message to backend.');
  //   _electronService.ipcRenderer.send('message', 'hello, are you there?');
  //  }

  //   public playPingPong() {
  //       if(this._electronService.isElectronApp) {
  //           let pong: string = this._electronService.ipcRenderer.sendSync('ping');
  //           console.log(pong);
  //       }
  //   }
  // title = 'electron-demo';
  // constructor(private _electronService: ElectronService) {
  //electron.ipcRenderer.on('other-custom-signal', (event,arg) => {
  //console.log('Received acknowledged from backend about receipt of our signal.');
  //console.log(event);
  //console.log(arg);   })
  //   console.log('Sending message to backend.');
  //   _electronService.ipcRenderer.send('message', 'hello, are you there?');
  //  }
  //   public playPingPong() {
  //       if(this._electronService.isElectronApp) {
  //           let pong: string = this._electronService.ipcRenderer.sendSync('ping');
  //           console.log(pong);
  //       }
  //   }
  test=[];
  ipc!: IpcRenderer;
      constructor(private _router: Router, private zone: NgZone){
        if ((<any>window).require) {
          try {
            this.ipc = (<any>window).require('electron').ipcRenderer;

          } catch (e) {
            throw e;
          }
        } else {
          console.warn('App not running inside Electron!');
        }
        this.ipc.send('getLandingPage')
        
      }
      ngOnInit(){

        this.ipc.on('landingPage',(event,data)=> {
          console.log('APP.COMPONENT.TS -> Landing Page event found', event,data)
          if(data.page == 'login')
            this.ipc.send('LOGIN',"intiate login process")
          else if(data.page == 'dashboard')
            this.zone.run(()=>{this._router.navigate(['/dashboard',  { 'userName': data?.account?.name  }])})
        })

                
        this.ipc.on('other-custom-signal',(event,data)=>{
            console.log(data)
            this.test=data;
            console.log("test data : ",this.test)
        })
      }
      click(){
        this.ipc.send('Insert',"test")
      }
      fetch(){
        this.ipc.send('Fetch',"test")
      }
}
