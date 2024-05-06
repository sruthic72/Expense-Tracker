import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL, ROUTE_ADD_EXPENSE_OF_USER, ROUTE_CREATE_USER, ROUTE_DELETE_EXPENSE_OF_USER, ROUTE_DELETE_USER, ROUTE_GET_ACCUMULATED_EXPENSES_OF_N_DAYS, ROUTE_GET_CATEGORIES, ROUTE_GET_CATEGORIES_COUNTS, ROUTE_GET_CATEGORIES_SUMS, ROUTE_GET_EXPENSES_OF_USER, ROUTE_GET_EXPENSES_OF_USER_BY_DATE_RANGE, ROUTE_GET_PREVIOUS_N_DAYS_EXPENSES, ROUTE_GET_PREVIOUS_N_MONTHS_EXPENSES, ROUTE_GET_PREVIOUS_N_YEARS_EXPENSES, ROUTE_GET_USER, ROUTE_LOGIN, ROUTE_POST_FREQUENCY_IN_AMOUNT_RANGES, ROUTE_POST_TOP_N_EXPENSES, ROUTE_UPDATE_CATEGORIES, ROUTE_UPDATE_EXPENSE_OF_USER, ROUTE_UPDATE_USER } from './routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static username: any;
  public static password: any;

  apiUrl = API_URL

  loginUserRoute = ROUTE_LOGIN
  createUserRoute = ROUTE_CREATE_USER;
  getUserRoute = ROUTE_GET_USER;
  updateUserRoute = ROUTE_UPDATE_USER;
  deleteUserRoute = ROUTE_DELETE_USER;
  updateCategoriesRoute = ROUTE_UPDATE_CATEGORIES
  getCategoriesRoute = ROUTE_GET_CATEGORIES

  addExpenseOfUserRoute = ROUTE_ADD_EXPENSE_OF_USER
  getExpensesOfUserRoute = ROUTE_GET_EXPENSES_OF_USER
  updateExpenseOfUserRoute = ROUTE_UPDATE_EXPENSE_OF_USER
  deleteExpenseOfUserRoute = ROUTE_DELETE_EXPENSE_OF_USER
  getExpensesOfUserByDateRoute = ROUTE_GET_EXPENSES_OF_USER_BY_DATE_RANGE
  getAccumulatedExpensesDays = ROUTE_GET_ACCUMULATED_EXPENSES_OF_N_DAYS
  getPreviousNMonthExpenses = ROUTE_GET_PREVIOUS_N_MONTHS_EXPENSES
  getPreviousNYearsExpenses = ROUTE_GET_PREVIOUS_N_YEARS_EXPENSES
  getPreviousNDaysExpenses = ROUTE_GET_PREVIOUS_N_DAYS_EXPENSES
  getCategoriesAndCounts = ROUTE_GET_CATEGORIES_COUNTS
  getCategoriesAndSums = ROUTE_GET_CATEGORIES_SUMS
  postFrequencyInAmountRanges = ROUTE_POST_FREQUENCY_IN_AMOUNT_RANGES
  postTopNExpenses = ROUTE_POST_TOP_N_EXPENSES

  constructor(private http: HttpClient) { }

  // Verify if user exists
  verifyUser(username: string, password: string) {
    const params = { username, password };
    console.log('calling ',this.apiUrl+this.loginUserRoute, 'with params: ', params);
    return this.http.get<{ exists: boolean, user:any }>(this.apiUrl+this.loginUserRoute, {params} );
  }

  // Create a new user
  createUser(user: any): Observable<{ message: string, result: boolean }> {
    console.log('calling ',this.apiUrl+this.loginUserRoute, 'with body: ', user);
    return this.http.post<{ message: string, result: boolean }>(`${this.apiUrl}${this.createUserRoute}`, user);
  }

  // Retrieve user by username
  getUser(username: string, password: string): Observable<{ user: any }> {
    return this.http.get<{ user: any }>(`${this.apiUrl}${this.getUserRoute}?username=${username}&password=${password}`);
  }

  // Update user by username
  updateUser(username: string, user: any): Observable<{ message: string , result:boolean}> {
    return this.http.put<{ message: string, result:boolean }>(`${this.apiUrl}${this.updateUserRoute}?username=${username}`, user);
  }

  // Delete user by username
  deleteUser(username: string, password: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}${this.deleteUserRoute}?username=${username}&password=${password}`);
  }


  // Update user categories
  updateUserCategories(username: string, categories: any): Observable<{ message: string, result: boolean }> {
    return this.http.put<{ message: string, result: boolean }>(
      `${this.apiUrl}${this.updateCategoriesRoute}?username=${username}`,
      { categories }
    );
  }

  // Get user categories
  getUserCategories(username: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.getCategoriesRoute}?username=${username}`
    );
  }






  // Get all expenses of a user using username
  getExpensesOfUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.getExpensesOfUserRoute}?username=${username}`);
  }

  getTotalExpensesOfUserLastNDays(username:string, days:number): Observable<any>{
    const params = {username:username,days:days}
    console.log('calling ',`${this.apiUrl}${this.getAccumulatedExpensesDays}?username=${username}&days=${days}`)
    return this.http.get<{ accumulatedExpenses: Number }>(`${this.apiUrl}${this.getAccumulatedExpensesDays}?username=${username}&days=${days}`)
  }

  getExpensesOfUserInPreviousNMonths(username:string, months:number):Observable<any>{
    console.log('calling ',`${this.apiUrl}${this.getPreviousNMonthExpenses}?username=${username}&months=${months}`)
    return this.http.get<any>(`${this.apiUrl}${this.getPreviousNMonthExpenses}?username=${username}&months=${months}`)
  }

  getExpensesOfUserInPreviousNYears(username:string, years:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.getPreviousNYearsExpenses}?username=${username}&years=${years}`)
  }

  getExpensesOfUserInPreviousNDays(username:string, days:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.getPreviousNDaysExpenses}?username=${username}&years=${days}`)
  }

  // Update an expense of a user using expense_id and username
  updateExpenseOfUser(username:string, expenseData: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}${this.updateExpenseOfUserRoute}?username=${username}`, expenseData);
  }

  // Add an expense of a user using username
  addExpenseOfUser(expenseData: any): Observable<{ message: string, expenseId: number }> {
    console.log('sending ',expenseData);
    return this.http.post<{ message: string, expenseId: number }>(`${this.apiUrl}${this.addExpenseOfUserRoute}`, expenseData);
  }

  // Delete an expense of a user using expense_id and username
  deleteExpenseOfUser(expense_id: number, username: string): Observable<{ message: string, result: boolean }> {
    console.log('calling ',`${this.apiUrl}${this.deleteExpenseOfUserRoute}?expense_id=${expense_id}&username=${username}`);
    return this.http.delete<{ message: string, result:boolean }>(`${this.apiUrl}${this.deleteExpenseOfUserRoute}?expense_id=${expense_id}&username=${username}`);
  }

  // Get all expenses of a user in a date range using username and date ranges
  getExpensesOfUserByDateRange(username: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.getExpensesOfUserByDateRoute}?username=${username}&startDate=${startDate}&endDate=${endDate}`);
  }

  // Get categories and their counts for pie chart
  getCategoriesAndCountsOfUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.getCategoriesAndCounts}?username=${username}`
    );
  }

  // Get categories and their sums for pie chart
  getCategoriesAndSumsOfUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.getCategoriesAndSums}?username=${username}`
    );
  }

  // Get frequency of expenses in ranges
  getFrequencyOfExpensesInAmountRanges(username:string, ranges:any[]): Observable<any[]>{
    console.log('freq',username,ranges)
    return this.http.post<any[]>(
      `${this.apiUrl}${this.postFrequencyInAmountRanges}?username=${username}`,
      {
        ranges
      }
    );
  }

  // Get top n expenses using post method
  getTopNExpenses(username:string, n:number): Observable<any[]>{
    return this.http.post<any[]>(
      `${this.apiUrl}${this.postTopNExpenses}?username=${username}`,
      {
        n
      }
    );
  }
}
