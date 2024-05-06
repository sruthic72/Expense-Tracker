import { Component } from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ExpenseTracker';

  public static loggedIn: boolean = false;

  public static notification:any = {
    show: false,
    message: 'Notificaion here'
  }
  
  constructor(private dataService: DataService, private router:Router) {
    if(localStorage.getItem('username')!=null){
      let l_username:any = localStorage.getItem('username');
      let l_password:any = localStorage.getItem('password');
      dataService.verifyUser(l_username,l_password).subscribe((response)=>{
        console.log('response', response);
        if(response.exists){
          AppComponent.loggedIn = true;
          DataService.username = l_username;
          DataService.password = l_password;
        }
        else{
          AppComponent.loggedIn = false;
          DataService.username = '';
          DataService.password = '';
          localStorage.clear();
        }
      })
    }
    else{
      AppComponent.loggedIn = false;
      DataService.username = '';
      DataService.password = '';
      localStorage.clear();
    }
  }

  logout(){
    localStorage.clear()
    DataService.username = null
    DataService.password = null
    AppComponent.loggedIn = false
    this.router.navigateByUrl('')
  }

  isLoggedIn(){
    return AppComponent.loggedIn;
  }

  showNotification(){
    return AppComponent.notification.show;
  }

  getNotificationMessage(){
    return AppComponent.notification.message;
  }
}
