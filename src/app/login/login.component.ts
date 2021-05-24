import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ipc!: IpcRenderer;
  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
        console.log('LOGIN.COMPONENT.TS-> IPC-> LINE 16',this.ipc)
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
    console.log('LOGIN.COMPONENT.TS-> IPC-> Line 23',this.ipc)
   }

  ngOnInit(): void {
    console.log('')
  }

  signIn() {
    this.ipc.send("LOGIN","test")
  }

}
