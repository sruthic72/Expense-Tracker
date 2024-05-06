import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { DatePipe } from '@angular/common';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {
  expenseForm!: FormGroup;
  errorMessage!: string;
  todayDate: string;
  categories: any;
  addingCategory: string;
  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  ngOnInit() {
    this.addingCategory = '';
    const categories = this.dataService.getUserCategories(localStorage.getItem('username') ?? '').subscribe((response: any) => {
      this.categories = response.categories;
      console.log('categories', response.categories);
      return response;
    });
    console.log('categories', this.categories);
    console.log('today', Date.now().toString());
    this.expenseForm = this.formBuilder.group({
      amount: ['', Validators.required],
      date: [Date.now().toString().split('T')[0], Validators.required],
      description: ['', Validators.required],
      category: [this.categories, Validators.required],
    });
  }

  async addCategory() {
    this.categories.push(this.addingCategory.toLowerCase());
    this.categories = Array.from(
      new Set(
        this.categories.filter((item: string) => item.trim() !== '')
      )
    );
    console.log('adding', this.categories)
    this.dataService.updateUserCategories(
      localStorage.getItem('username') ?? '', this.categories).subscribe((response) => {
        console.log(response)
        if(response.result === true){
          this.addingCategory = ''
          AppComponent.notification.message = 'Category Added Successfully'
          AppComponent.notification.show = true;

          setTimeout(() => {
            AppComponent.notification.show = false;
          }, 2000);
        }
      })
  }
  deleteCategory(index:number){
    this.categories.splice(index, 1);
    this.dataService.updateUserCategories(
      localStorage.getItem('username') ?? '', this.categories).subscribe((response) => {
        if(response.result === true){
          AppComponent.notification.message = 'Category Deleted Successfully'
          AppComponent.notification.show = true;

          setTimeout(() => {
            AppComponent.notification.show = false;
          }, 2000);
        }
      })
  }

  onSubmit() {
    if (this.expenseForm.invalid) {
      console.log('categories', this.expenseForm.get('category')?.value);
      return;
    }

    const amount = parseFloat(this.expenseForm.get('amount')?.value);
    const date = this.expenseForm.get('date')?.value;
    console.log(date)
    const category = this.expenseForm.get('category')?.value;
    const description = this.expenseForm.get('description')?.value

    this.dataService.addExpenseOfUser({
      username: localStorage.getItem('username'),
      amount: amount,
      date: date,
      category: category,
      description: description
    }).subscribe(
      (response) => {
        console.log(response)
        console.log(response.message)
        if (response.expenseId) {
          this.errorMessage = 'Expense Added Successfully!'
          this.expenseForm = this.formBuilder.group({
            amount: ['', Validators.required],
            date: ['', Validators.required],
            description: ['', Validators.required],
          });
          AppComponent.notification.message = 'Expense Added Successfully'
          AppComponent.notification.show = true;

          setTimeout(() => {
            AppComponent.notification.show = false;
          }, 2000);
        }
      }
    )

  }
}
