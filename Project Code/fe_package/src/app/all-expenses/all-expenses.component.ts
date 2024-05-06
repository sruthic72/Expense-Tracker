import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';

interface Expense {
  id: number;
  username: string;
  amount: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-all-expenses',
  templateUrl: './all-expenses.component.html',
  styleUrls: ['./all-expenses.component.css']
})
export class AllExpensesComponent implements OnInit {

  expensesOfUser: any;
  editing: boolean = false;
  editingIndex = -1;

  deleting: boolean = false;
  deletingIndex = -1;
  deleting_message = ''

  expenseForm!: FormGroup;
  errorMessage!: string;
  sortedBy = '';

  categories:any;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }
  async ngOnInit() {
    const expensesOfUser$ = this.dataService.getExpensesOfUser(localStorage.getItem('username')!);
    const categories = this.dataService.getUserCategories(localStorage.getItem('username') ?? '').subscribe((response: any) => {
      this.categories = response.categories;
      console.log('categories', response.categories);
      return response;
    });
    forkJoin([expensesOfUser$]).subscribe((
      [expensesOfUserResponse]) => {
      console.log(expensesOfUserResponse);
      this.expensesOfUser = expensesOfUserResponse;
    }
    )
    this.expenseForm = this.formBuilder.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  formatDate(date: string) {

    const inputDate = new Date(date);

    // Define options for formatting
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // Full day name (e.g., "Monday")
      day: "2-digit",  // Two-digit day of the month (e.g., "13")
      month: "short",  // Three-letter month abbreviation (e.g., "Dec")
      year: "2-digit",  // Two-digit year (e.g., "23")
    };

    // Create a formatter with the specified options
    const dateFormatter = new Intl.DateTimeFormat("en-US", options);

    // Format the date
    const formattedDate = dateFormatter.format(inputDate);

    return formattedDate; // Example output: "Tuesday, 13-12-23"
  }

  edit(index: number) {
    this.editing = true;
    this.editingIndex = index;
    this.expenseForm = this.formBuilder.group({
      id: [this.expensesOfUser[index].id, Validators.required],
      amount: [this.expensesOfUser[index].amount, Validators.required],
      date: [this.expensesOfUser[index].date.split('T')[0], Validators.required],
      description: [this.expensesOfUser[index].description, Validators.required],
      category:[this.expensesOfUser[index].category, Validators.required]
    });
    console.log(this.expenseForm)

  }
  onEditSubmit() {
    if (this.expenseForm.invalid) {
      console.log('invalid')
      return;
    }

    const amount = parseFloat(this.expenseForm.get('amount')?.value);
    const id = parseInt(this.expenseForm.get('id')?.value);
    const date = this.expenseForm.get('date')?.value;
    const description = this.expenseForm.get('description')?.value
    const category = this.expenseForm.get('category')?.value

    this.dataService.updateExpenseOfUser(
    localStorage.getItem('username')??'',
    {
      expense_id: id,
      category: category,
      amount: amount,
      date: date,
      description: description
    }).subscribe(
      (response) => {
        console.log(response)
        console.log(response.message)
        if (response.message) {
          this.expensesOfUser[this.editingIndex] = {
            id: id,
            username: localStorage.getItem('username'),
            amount: amount,
            date: date,
            description: description
          }
          this.errorMessage = 'Expense Updated Successfully!'
          this.expenseForm = this.formBuilder.group({
            amount: ['', Validators.required],
            date: ['', Validators.required],
            description: ['', Validators.required],
          });

          AppComponent.notification.message = 'Expense Edited Successfully'
          AppComponent.notification.show = true;

          setTimeout(() => {
            AppComponent.notification.show = false;
          }, 3000);
          this.editing = false;
          this.expensesOfUser[this.editingIndex].amount = amount;
          this.expensesOfUser[this.editingIndex].date = date;
          this.expensesOfUser[this.editingIndex].description = description;
          this.expensesOfUser[this.editingIndex].category = category;
          this.editingIndex = -1
        }
      }
    )

  }

  delete(index: number) {
    this.deleting = true;
    this.deletingIndex = index;
  }
  submitDeleteRequest() {
    const deleting = this.expensesOfUser[this.deletingIndex];
    this.dataService.deleteExpenseOfUser(deleting.id, localStorage.getItem('username')!).subscribe((response) => {
      console.log(response)
      console.log(response.message)
      if (response.result) {
        this.deleting_message = 'Deleted'
        this.expensesOfUser.splice(this.deletingIndex, 1);
        AppComponent.notification.message = 'Expense Deleted Successfully'
        AppComponent.notification.show = true;

        setTimeout(() => {
          AppComponent.notification.show = false;
        }, 2000);
        this.deletingIndex = -1;
        this.deleting = false;


      }
    })
  }



  sortBy(type: string) {
    if (type == 'amount') {
      this.sortedBy = this.sortedBy == 'amount_desc' ? 'amount_asc' : 'amount_desc'
      this.expensesOfUser.sort((a: Expense, b: Expense) => {
        const amountA = parseFloat(a.amount);
        const amountB = parseFloat(b.amount);
        return this.sortedBy == 'amount_asc' ? amountA - amountB : amountB - amountA;
      });
    }
    else if (type == 'date') {
      this.sortedBy = this.sortedBy == 'date_desc' ? 'date_asc' : 'date_desc'
      this.expensesOfUser.sort((a: Expense, b: Expense) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return this.sortedBy == 'date_asc' ? dateA - dateB : dateB - dateA;
      });
    }
  }
}
