import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router:Router) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Call your login service function here and handle the response
    this.dataService.verifyUser(username, password).subscribe(
      (response) => {
        if (response.exists) {
          // Successful login, you can redirect or perform other actions
          console.log('Login successful');
          localStorage.setItem('username',username)
          localStorage.setItem('password',password)
          DataService.username = username
          DataService.password = password
          AppComponent.loggedIn = true;
          this.router.navigateByUrl('/')
          
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred while logging in';
      }
    );
  }
}
