import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { HttpClientModule } from '@angular/common/http';
import { NavAdminComponent } from '../nav-admin/nav-admin.component';
import { Chart } from 'chart.js';

echarts.use([
  BarChart,
  PieChart,
  LineChart,
  GridComponent,
  CanvasRenderer,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
]);
/* chartjs */
import {
 
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
/* high chart */

import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-principal-dashboard',
  standalone: true,
  imports: [
HighchartsChartComponent,
    NgxEchartsDirective,
    CommonModule,
    MatDialogModule,
    HttpClientModule,
    NavAdminComponent,
    
  ],
  templateUrl: './principal-dashboard.component.html',
  styleUrl: './principal-dashboard.component.css',
})
export class PrincipalDashboardComponent implements OnInit {

  /* echart */
  chartOption!: EChartsCoreOption;
 

  roles: string | null = '';
  totalCourses: number = 0;
  totalInstructors: number = 0;
  Students: number = 0;
  allDepartments: number = 0;
  department: any;
  recommendedCourses: any[] = [];

/* high chart */

  HighchartOptions!: Highcharts.Options;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private service: PrincipalServiceService
  ) {}

  totalStudents: any[] = [];


  totalEnrolledCourses: number = 0;
  recommendedCourse: any;

  /* chartjs */
  chart: any;
  ngOnInit(): void {
    this.roles = localStorage.getItem('role');
    console.log('User Role:', this.roles);

    /* Fetch all students */
    this.service.getStudents().subscribe((data: any) => {
      this.Students = data.length;
          this.totalEnrolledCourses = data.reduce((total: number, student: any) => {
    return total + (student.enrolledCourses?.length || 0);
  }, 0);
    });
     

    /* fetch all instructor */
    this.service.getInstructor().subscribe((data: any) => {
      this.totalInstructors = data.length;
        
      const deptCount: { [key: string]: number } = {};

      // Count instructors per department
      data.forEach((instructor:any) => {
        const dept = instructor.department;
        deptCount[dept] = (deptCount[dept] || 0) + 1;
      });

  
      const chartData: Highcharts.PointOptionsObject[] = Object.entries(deptCount).map(
        ([dept, count]) => ({
          name: dept,
          y: count
        })
      );
  this.HighchartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Instructors per Department'
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y}'
            }
          }
        },
        series: [
          {
            name: 'Instructors',
            colorByPoint: true,
            type: 'pie', 
            data: chartData
          } as Highcharts.SeriesPieOptions
        ]
      };

     
      Highcharts.chart('HighchartOptions', this.HighchartOptions);

  
 
    });

    /* fetch all course */
    this.service.getCourses().subscribe((data: any[]) => {
      this.totalCourses = data.length;
      this.allDepartments = data.length;
      const couName = data.map((c) => c.courseName);
      const seatCounts = data.map((course) => course.numberOfSeats);

      this.chartOption = {
        title: {
          text: 'Course Seats Overview',
          left: 'center',
          textStyle: { fontSize: 18, fontWeight: 600 },
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: couName,
          axisLabel: { rotate: 30, interval: 0, fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          name: 'Seats',
          splitLine: {
            lineStyle: { type: 'dashed' },
          },
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: 60,
          top: 50,
          containLabel: true,
        },
        series: [
          {
            name: 'Seats',
            type: 'line',
            data: seatCounts,
            smooth: true,
            lineStyle: { width: 2 },
            areaStyle: {},
          },
        ],
        dataZoom: [
          { type: 'slider', height: 18, bottom: 20 },
          { type: 'inside' },
        ],
      };

// first 3 recommended course 
      this.department = data.map(
        (dept: { department: string }) => dept.department
      );

      this.recommendedCourses = data
        .sort(
          (a: any, b: any) =>
            new Date(a.enrollPeriod.startDate).getTime() -
            new Date(b.enrollPeriod.startDate).getTime()
        )
        .slice(0, 3); //  Get first 3 recommended courses
        
      const durations = data.map(course => {
    const start = new Date(course.enrollPeriod.startDate);
    const end = new Date(course.enrollPeriod.endDate);
    const durationInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return durationInDays;
  });
           this.renderChart(couName, durations);
    });




  }
/* chartjs for course duration */
renderChart(labels: string[], data: number[]) {
  this.chart = new Chart('courseChart', {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Course Duration (Days)',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Course Duration Overview'
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Course Name' },
          ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Duration (Days)' }
        }
      }
    }
  });
}



}
