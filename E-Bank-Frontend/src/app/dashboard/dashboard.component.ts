import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  DoughnutController,
  ArcElement,
} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any;
  dashboardChartsInfo: any;
  transactionChart: any;
  bankAccountChart: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getDashboardInfo();
    this.getDashboardChartsInfo();
  }

  getDashboardInfo(): void {
    this.dashboardService.getDashboardInfo().subscribe({
      next: (data) => {
        this.dashboardData = this.formatDashboardData(data);
        console.log("Dashboard Data: ", this.dashboardData);
      },
      error: (err) => {
        console.error("Error fetching dashboard data: ", err);
      }
    });
  }

  private formatNumber(num: number): string {
    if (num < 10000) {
      return num.toString();
    } else if (num >= 10000 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return (num / 1000000).toFixed(1) + "M";
    }
  }

  private formatDashboardData(data: any): any {
    const formattedData = { ...data };

    if (formattedData.totalBalanceSum) {
      formattedData.totalBalanceSum = this.formatNumber(formattedData.totalBalanceSum);
    }
    if (formattedData.monthlyTransactionSum) {
      formattedData.monthlyTransactionSum = this.formatNumber(formattedData.monthlyTransactionSum);
    }
    if (formattedData.totalNumberOfBankAccounts) {
      formattedData.totalNumberOfBankAccounts = this.formatNumber(formattedData.totalNumberOfBankAccounts);
    }
    if (formattedData.totalNumberOfCustomers) {
      formattedData.totalNumberOfCustomers = this.formatNumber(formattedData.totalNumberOfCustomers);
    }

    return formattedData;
  }

  getDashboardChartsInfo(): void {
    this.dashboardService.getDashboardChartsInfo().subscribe({
      next: (data) => {
        this.dashboardChartsInfo = data;

        const chart1Labels = data.dailyTransactionVolume.map((item: any) => item.month);
        const chart1Data = data.dailyTransactionVolume.map((item: any) => item.volume);

        const chart2Labels = data.bankAccountsByType.map((item: any) => item.type);
        const chart2Data = data.bankAccountsByType.map((item: any) => item.count);

        this.createTransactionChart(chart1Labels, chart1Data);
        this.createBankAccountChart(chart2Labels, chart2Data);
      },
      error: (err) => {
        console.error("Error fetching dashboard chart data: ", err);
      }
    });
  }

  createTransactionChart(labels: string[], data: number[]) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

    this.transactionChart = new Chart('transactionChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Transaction Volume',
          data: data,
          fill: true,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Transaction Volume'
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Months'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Volume'
            }
          }
        }
      }
    });
  }

  createBankAccountChart(labels: string[], data: number[]) {
    // Register required components for doughnut chart
    Chart.register(DoughnutController, ArcElement, Tooltip, Title);

    this.bankAccountChart = new Chart('segmentChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#0d6efd', '#20c997', '#ffc107']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Bank Accounts'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }
}
