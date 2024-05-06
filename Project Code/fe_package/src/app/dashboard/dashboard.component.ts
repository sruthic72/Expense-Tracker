import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { forkJoin, range } from 'rxjs';
declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {



  nDays = 10
  pastNDaysExpenses: any = {}
  accumulatedExpensesOfLastNDays: number = 0

  chart_font_size: number = 3;
  nMonths = 6;
  pastNMonthsExpenses: any = {}

  nYears = 5;
  pastNYearsExpenses: any = {}

  categoriesAndCounts: any;
  categoriesAndSums:any;

  frequencyInAmountRanges:any;

  topNExpenses:any;
  topNExpenses_N:number = 5;

  expensesDiff: number = 0




  constructor(private dataService: DataService) { }

  async ngOnInit() {

    const accumulatedExpenses$ = this.dataService.getTotalExpensesOfUserLastNDays(localStorage.getItem('username')!, this.nDays);
    const accumulatedExpenses2$ = this.dataService.getTotalExpensesOfUserLastNDays(localStorage.getItem('username')!, this.nDays * 2);

    const pastNDaysExpenses$ = this.dataService.getExpensesOfUserInPreviousNDays(localStorage.getItem('username')!, this.nDays)
    const pastNMonthsExpenses$ = this.dataService.getExpensesOfUserInPreviousNMonths(localStorage.getItem('username')!, this.nMonths);
    const pastNYearsExpenses$ = this.dataService.getExpensesOfUserInPreviousNYears(localStorage.getItem('username')!, this.nYears);

    const categoriesAndCounts$ = this.dataService.getCategoriesAndCountsOfUser(localStorage.getItem('username')!);
    const categoriesAndSums$ = this.dataService.getCategoriesAndSumsOfUser(localStorage.getItem('username')!);

    const ranges = [
      [ 0 , 50 ],
      [ 51 , 100 ],
      [ 101 , 150 ],
      [ 151 , 200 ],
      [ 201 , 250 ],
      [ 251 , 300 ],
      [ 301 , 350 ],
      [ 351 , 400 ],
      [ 401 , 450 ],
      [ 451 , 500 ],
      [ 501 , 550 ],
      [ 551 , 600 ],
      [ 601 , 650 ],
      [ 651 , 700 ],
      [ 701 , 750 ],
      [ 751 , 800 ],
      [ 801 , 850 ],
      [ 851 , 900 ],
      [ 901 , 950 ],
      [ 951 , 1000 ],
    ]
    const frequencyInAmountRanges$ = this.dataService.getFrequencyOfExpensesInAmountRanges(localStorage.getItem('username')!,ranges);

    const topNExpenses$ = this.dataService.getTopNExpenses(localStorage.getItem('username')!, this.topNExpenses_N);

    forkJoin([
      accumulatedExpenses$, 
      accumulatedExpenses2$, 
      pastNDaysExpenses$, 
      pastNMonthsExpenses$, 
      pastNYearsExpenses$, 
      categoriesAndCounts$, 
      categoriesAndSums$,
      frequencyInAmountRanges$,
      topNExpenses$
    ]).subscribe((
      [
        accumulatedExpensesResponse, 
        accumulatedExpenses2Response, 
        pastNDaysExpensesResponse, 
        pastNMonthsExpensesResponse, 
        pastNYearsExpensesResponse, 
        categoriesAndCounts, 
        categoriesAndSums,
        frequencyInAmountRanges,
        topNExpenses
      ]) => {
      console.log('\n\n\ncreatingDashboard');
      console.log(accumulatedExpensesResponse);
      console.log(accumulatedExpenses2Response)
      this.accumulatedExpensesOfLastNDays = parseFloat(accumulatedExpensesResponse.accumulatedExpenses);
      this.expensesDiff = parseInt((this.accumulatedExpensesOfLastNDays / (this.accumulatedExpensesOfLastNDays - (accumulatedExpenses2Response.accumulatedExpenses - this.accumulatedExpensesOfLastNDays)) * 100).toString())


      console.log('days:', pastNDaysExpensesResponse);
      this.pastNDaysExpenses = pastNDaysExpensesResponse;

      console.log('months:', pastNMonthsExpensesResponse);
      this.pastNMonthsExpenses = pastNMonthsExpensesResponse;

      console.log('years:', pastNYearsExpensesResponse);
      this.pastNYearsExpenses = pastNYearsExpensesResponse;

      console.log('categories:', categoriesAndCounts);
      this.categoriesAndCounts = categoriesAndCounts

      console.log('categories sums',categoriesAndSums);
      this.categoriesAndSums = categoriesAndSums;

      console.log('amount ranges', frequencyInAmountRanges);
      this.frequencyInAmountRanges = frequencyInAmountRanges;

      console.log('top n expenses', topNExpenses);
      this.topNExpenses = topNExpenses;

      //a function that takes in an array the dates in format DD-MMM-YYYY and returns a list of dates in format DD-MMM
      function daysAndMonths(dates: any) {
        let daysAndMonths = [];
        for (let date of dates) {
          let day = date.split('-')[0];
          let month = date.split('-')[1];
          daysAndMonths.push(day + '-' + month);
        }
        return daysAndMonths;
      }

      function createCharts() {

        const xValues_days_chart = daysAndMonths(Object.keys(pastNDaysExpensesResponse));
        const yValues_days_chart = Object.values(pastNDaysExpensesResponse);

        const xValues_months_chart = Object.keys(pastNMonthsExpensesResponse);
        const yValues_months_chart = Object.values(pastNMonthsExpensesResponse);

        const xValues_years_chart = Object.keys(pastNYearsExpensesResponse);
        const yValues_years_chart = Object.values(pastNYearsExpensesResponse);

        const xValues_categories_count_chart = Object.keys(categoriesAndCounts);
        const yValues_categories_count_chart = Object.values(categoriesAndCounts);

        const xValues_categories_sum_chart = Object.keys(categoriesAndSums);
        const yValues_categories_sum_chart = Object.values(categoriesAndSums);

        const xValues_frequency_in_amount_ranges = ranges.map(range => range[0]+'-'+range[1]);
        const yValues_frequency_in_amount_ranges = Object.values(frequencyInAmountRanges);

        const barColor = "orange"
        const textColor = "white"


        Chart.defaults.global.defaultFontSize = 16;
        Chart.defaults.global.defaultFontColor = '#FFF';
        Chart.defaults.scale.gridLines.color = "#888";

        const l_chart_font_size = 12


        new Chart("days_chart", {
          type: "line",
          data: {
            labels: xValues_days_chart,
            datasets: [{
              backgroundColor: "#D59",
              data: yValues_days_chart,
              borderColor: "#ed62e1",
              label: "Expenses",
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.1
            }]
          },
          options: {
            legend: { display: false },
            responsive: true,
            title: {
              text: "Expenses in The Past Days", 
              fontSize: 30,
              display: true,
            },
            interaction: {
              intersect: false,
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontSize: l_chart_font_size // X-axis label font size
                }
              }],
              yAxes: [{
                ticks: {
                  fontSize: l_chart_font_size // Y-axis label font size
                }
              }]
            }
          },

        });

        new Chart("months_chart", {
          type: "bar",
          data: {
            labels: xValues_months_chart,
            datasets: [{
              backgroundColor: barColor,
              data: yValues_months_chart
            }]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text: "Expenses in Past Months",
              fontColor: textColor,
              fontSize: 30
            },
            scales:{
              xAxes: [{
                ticks: {
                  fontSize: l_chart_font_size, // X-axis label font size
                  color: textColor,  // Set the text color for the x-axis labels
                  fontColor: textColor
                }
              }],
              yAxes: [{
                ticks: {
                  fontSize: l_chart_font_size, // Y-axis label font size
                  color: textColor,  // Set the text color for the y-axis labels
                  fontColor: textColor
                }
              }]
            }
          },
        });

        new Chart("years_chart", {
          type: "bar",
          data: {
            labels: xValues_years_chart,
            datasets: [{
              backgroundColor: "yellow",
              data: yValues_years_chart
            }]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text: "Expenses in Past Years",
              fontColor: textColor,
              fontSize: 30
            },
            scales: {
              xAxes: [{
                ticks: {
                  color: textColor,  // Set the text color for the x-axis labels
                  fontColor: textColor,
                  fontSize: l_chart_font_size, // X-axis label font size
                }
              }],
              yAxes: [{
                ticks: {
                  color: textColor,  // Set the text color for the y-axis labels
                  fontColor: textColor,
                  fontSize: l_chart_font_size, // Y-axis label font size
                }
              }]
            }
          },
          
        });

        function generateRandomColor(count: number) {
          let colors = [];
          for (let i = 0; i < count; i++) {
            colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          }
          return colors;
        }
        new Chart("categories_count_pie_chart", {
          type: "pie",
          data: {
            labels: xValues_categories_count_chart,
            datasets: [{
              data: yValues_categories_count_chart,
              backgroundColor: generateRandomColor(yValues_categories_count_chart.length),
            }]
          },
          options: {
            title: {
              display: true,
              text: "Counts of Categories",
              fontColor: textColor,
              fontSize: 30
            }
          }
        })

        new Chart("categories_sum_pie_chart", {
          type: "pie",
          data: {
            labels: xValues_categories_sum_chart,
            datasets: [{
              data: yValues_categories_sum_chart,
              backgroundColor: generateRandomColor(yValues_categories_sum_chart.length),
            }]
          },
          options: {
            title: {
              display: true,
              text: "Sum of Categories",
              fontColor: textColor,
              fontSize: 30
            }
          }
        })

        new Chart("freq_in_amount_ranges_chart",{
          type: "bar",
          data: {
            labels: xValues_frequency_in_amount_ranges,
            datasets: [{
              backgroundColor: barColor,
              data: yValues_frequency_in_amount_ranges,
            }]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text: "Freqeuncy Per Amount Ranges",
              fontColor: textColor,
              fontSize: 30
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontSize: l_chart_font_size, // X-axis label font size
                  color: textColor,  // Set the text color for the x-axis labels
                  fontColor: textColor
                }
              }],
              yAxes: [{
                ticks: {
                  fontSize: l_chart_font_size, // Y-axis label font size
                  color: textColor,  // Set the text color for the y-axis labels
                  fontColor: textColor
                }
              }]
            }
          }
        })

      }

      // Check if Chart.js is loaded, and if not, load it asynchronously
      if (typeof Chart !== 'undefined') { createCharts(); } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
        script.async = true;
        script.onload = createCharts;
        document.head.appendChild(script);
      }
    });
  }
}
