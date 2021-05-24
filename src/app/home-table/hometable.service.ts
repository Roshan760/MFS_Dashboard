import { Injectable ,EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HometableService {
  dataLoadEmitter = new  EventEmitter();
  constructor() { }
}
