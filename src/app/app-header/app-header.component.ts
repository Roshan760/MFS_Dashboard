import { Component, Input, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
import { HometableService } from '../home-table/hometable.service';
declare const myCode: any;
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @Input() userName:string|undefined;
  ipc!: IpcRenderer;
  constructor(public hometableService:HometableService) { }
   

  ngOnInit(): void {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;

      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
    // this.ipc.send('test',"result")
    this.ipc.on('synchresult',(event,data)=>{
        console.log(data);
        if(data=="completed"){
          this.ipc.send('Fetch',"Home")
        }
        if(data=="failed"){
          alert("Synch process failed")
          this.hometableService.dataLoadEmitter.emit(false);
        }
    })
  }
  callFun(){
   // myCode();
   this.ipc.send('test',"result");
   this.hometableService.dataLoadEmitter.emit(true);
  }

  logOut(){
    console.log('Logout clicked')
    this.ipc.send('LOGOUT')
  }
}
