import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfile: any;
  profileForm!: FormGroup;
  errorMessage!: string;
  loaded: boolean = false;

  editing: boolean = false;
  constructor(private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    const userProfile$ = this.dataService.getUser(localStorage.getItem('username')!, localStorage.getItem('password')!);

    forkJoin([userProfile$]).subscribe((
      [userProfileResponse]) => {
      console.log(userProfileResponse);
      this.userProfile = userProfileResponse.user;
      this.profileForm = this.formBuilder.group({
        email: [this.userProfile.email, Validators.required],
        name: [this.userProfile.name, Validators.required],
        password: [this.userProfile.password, Validators.required],
        username: [this.userProfile.username, Validators.required]
      });

      this.loaded = true
    })


  }


  onEditSubmit() {
    this.dataService.updateUser(localStorage.getItem('username')!,
      {
        password: this.profileForm.get('password')?.value,
        name: this.profileForm.get('name')?.value,
        email: this.profileForm.get('email')?.value,
      }
    ).subscribe((respones)=>{
      console.log(respones);
      if(respones.result){
        AppComponent.notification.message = 'Profile updated successfully'
        AppComponent.notification.show = true;
        localStorage.setItem('password', this.profileForm.get('password')?.value);
        setTimeout(() => {
          AppComponent.notification.show = false;
        }, 2000);
      }
    })
  }
}
