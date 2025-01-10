import { Component } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'taskify';
  tasks: any[] = [];
  constructor(
    private app: AppService
  ){}


  // login(){
  //   this.app.signIn()
  // }
}
