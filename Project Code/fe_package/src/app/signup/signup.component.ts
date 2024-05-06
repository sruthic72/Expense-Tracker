import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router:Router) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2:['', Validators.required],
      email: ['', Validators.required],
      name: ['',Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const username = this.signupForm.get('username')?.value;
    const password = this.signupForm.get('password')?.value;
    const password2 = this.signupForm.get('password2')?.value;
    const email = this.signupForm.get('email')?.value;
    const name = this.signupForm.get('name')?.value;

    if(password!=password2){
      this.errorMessage='Passwords need to match';
      return;
    }

    // Call your login service function here and handle the response
    this.dataService.createUser({
      username:username,
      password:password,
      email:email,
      name:name
    }).subscribe(
      (response) => {
        if (response.result) {
          // Successful login, you can redirect or perform other actions
          console.log('Sign up successful');
          localStorage.setItem('username',username)
          localStorage.setItem('password',password)
          DataService.username = localStorage.getItem('username')
          DataService.password = localStorage.getItem('password')
          AppComponent.loggedIn = true;
          this.router.navigateByUrl('')
        } else {
          this.errorMessage = '';
        }
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred while logging in. Username is taken!';
      }
    );
  }

}
