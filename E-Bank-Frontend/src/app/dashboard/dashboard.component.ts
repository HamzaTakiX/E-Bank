import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import { Router } from '@angular/router';
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
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {};
  searchTerm: string = '';
  filteredAccounts: any[] = [];
  dashboardChartsInfo: any;
  transactionChart: any;
  bankAccountChart: any;
  showFilters: boolean = false;
  accountTypes: string[] = ['SavingAccount', 'CurrentAccount'];
  accountStatuses: string[] = ['ACTIVATED', 'SUSPENDED', 'CREATED'];
  balanceRanges = [
    { label: '< $1000', value: 'low' },
    { label: '$1000 - $5000', value: 'medium' },
    { label: '> $5000', value: 'high' }
  ];
  selectedFilters = {
    type: '',
    status: '',
    balanceRange: ''
  };
  userName: string = '';
  currentTime: string = '';
  showNotification: boolean = false;

  constructor(private dashboardService: DashboardService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.getDashboardChartsInfo();
    
    // Check if user just logged in
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      this.showWelcomeNotification();
      // Remove the flag so notification won't show on subsequent visits
      localStorage.removeItem('justLoggedIn');
    }
  }

  loadDashboardData() {
    this.dashboardService.getDashboardInfo().subscribe({
      next: (data) => {
        this.dashboardData = this.formatDashboardData(data);
        this.filteredAccounts = this.dashboardData.latestBankAccounts;
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

    // Skip formatting totalBalanceSum to preserve decimal precision
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

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredAccounts = this.dashboardData.latestBankAccounts;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredAccounts = this.dashboardData.latestBankAccounts.filter((account: any) => {
      return (
        account.customerDTO.name.toLowerCase().includes(searchTermLower) ||
        account.type.toLowerCase().includes(searchTermLower) ||
        account.status.toLowerCase().includes(searchTermLower) ||
        account.balance.toString().includes(searchTermLower)
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredAccounts = this.dashboardData.latestBankAccounts;
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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  filterByType(type: string): void {
    this.selectedFilters.type = this.selectedFilters.type === type ? '' : type;
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.selectedFilters.status = this.selectedFilters.status === status ? '' : status;
    this.applyFilters();
  }

  filterByBalance(range: string): void {
    this.selectedFilters.balanceRange = this.selectedFilters.balanceRange === range ? '' : range;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedFilters = {
      type: '',
      status: '',
      balanceRange: ''
    };
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.dashboardData.latestBankAccounts;

    if (this.selectedFilters.type) {
      filtered = filtered.filter((account: any) =>
        account.type === this.selectedFilters.type
      );
    }

    if (this.selectedFilters.status) {
      filtered = filtered.filter((account: any) =>
        account.status === this.selectedFilters.status
      );
    }

    if (this.selectedFilters.balanceRange) {
      filtered = filtered.filter((account: any) => {
        const balance = account.balance;
        switch (this.selectedFilters.balanceRange) {
          case 'low':
            return balance < 1000;
          case 'medium':
            return balance >= 1000 && balance <= 5000;
          case 'high':
            return balance > 5000;
          default:
            return true;
        }
      });
    }

    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter((account: any) => {
        return (
          account.customerDTO.name.toLowerCase().includes(searchTermLower) ||
          account.type.toLowerCase().includes(searchTermLower) ||
          account.status.toLowerCase().includes(searchTermLower) ||
          account.balance.toString().includes(searchTermLower)
        );
      });
    }

    this.filteredAccounts = filtered;
  }

  showWelcomeNotification() {
    // Get username from auth service
    this.userName = this.authService.username || 'User';
    
    // Set current time greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      this.currentTime = 'Good Morning';
    } else if (hour < 18) {
      this.currentTime = 'Good Afternoon';
    } else {
      this.currentTime = 'Good Evening';
    }
    
    // Show notification
    this.showNotification = true;
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  viewAccountDetails(accountId: string) {
    this.router.navigate(['/admin/accounts'], {
      queryParams: { id: accountId },
      fragment: 'top'
    });
  }
}
