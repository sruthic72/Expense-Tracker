import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  loggedIn:boolean = false;
  constructor(private dataService: DataService) {
    if(localStorage.getItem('username')!=null){
      let l_username:any = localStorage.getItem('username');
      let l_password:any = localStorage.getItem('password');
      dataService.verifyUser(l_username,l_password).subscribe((response)=>{
        console.log('response', response);
        if(response.exists){
          this.loggedIn = true;
          DataService.username = l_username;
          DataService.password = l_password;
        }
        else{
          this.loggedIn = false;
          DataService.username = '';
          DataService.password = '';
          localStorage.clear();
        }
      })
    }
    else{
      this.loggedIn = false;
      DataService.username = '';
      DataService.password = '';
      localStorage.clear();
    }
    
  }
}
