import { Component } from '@angular/core';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { EChartsOption } from 'echarts';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';


@Component({
  selector: 'app-course-charts',
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './course-charts.component.html',
  styleUrl: './course-charts.component.css'
})
export class CourseChartsComponent {
  @Input() chartType!: 'line' | 'bar' | 'pie';
  @Input() chartLib!: 'highcharts' | 'echarts' | 'chartjs';
  @Input() chartData!: { categories: string[], values: number[] };
  @Input() chartTitle = '';
  @Input() isDonut: boolean = false;


  Highcharts: typeof Highcharts = Highcharts;
  highchartOptions: Highcharts.Options = {};
  echartOptions: EChartsOption = {};
  chartJsInstance: any;

  // Common zoom state
  zoomLevel = 1;

  // Highcharts reference
  chartRef?: Highcharts.Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chartData?.categories?.length || !this.chartData?.values?.length) return;


    if (this.chartLib === 'highcharts') {
      setTimeout(() => this.setupHighchart(), 0); // 🛠 Ensures DOM is ready
    } else if (this.chartLib === 'echarts') {
      this.setupEChart();
    } else if (this.chartLib === 'chartjs') {
      setTimeout(() => this.setupChartJS(), 0);
    }
  }

  
  // HIGHCHARTS SETUP
  setupHighchart(): void {
  const options: Highcharts.Options = {
    chart: {
      type: this.chartType === 'bar' ? 'column' : this.chartType,  // convert 'bar' to 'column'
      zoomType: 'xy'
    } as any,
    title: { text: this.chartTitle },
    xAxis: {
      categories: this.chartData.categories,
       min: 0,
  max: this.chartData.categories.length - 1,
      title: { text: 'Departments' },
      labels: { rotation: -25 }  // optional: rotate labels to fit better
    },
    yAxis: {
      title: { text: 'Values' },
      allowDecimals: false
    },
    series: [{
      name: this.chartTitle,
      type: this.chartType === 'bar' ? 'column' : this.chartType, // convert 'bar' to 'column'
      data: this.chartData.categories.map((cat, i) => ({
        name: cat,
        y: this.chartData.values[i]
      }))
    }],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        innerSize: this.isDonut ? '50%' : undefined,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}'
        }
      }
    }
  };

  //this.chartRef = Highcharts.chart(highcharts-container-${this.chartTitle}, options);
  Highcharts.chart(`highcharts-container-${this.chartTitle}`, options, (chart) => {
  this.chartRef = chart;
});

}




  // ECHARTS SETUP
  setupEChart(): void {
  const isPieLike = this.chartType === 'pie';

  this.echartOptions = {
    title: { text: this.chartTitle, left: 'center' },
    tooltip: { trigger: isPieLike ? 'item' : 'axis' },
    legend: isPieLike ? { orient: 'vertical', left: 'left' } : undefined,

    // ✅ Add grid only for non-pie charts to give space for scroll bar
    grid: !isPieLike ? {
      left: '3%',
      right: '4%',
      bottom: '50px',  // Adds space below the chart
      containLabel: true
    } : undefined,

    xAxis: !isPieLike ? {
      type: 'category',
      data: this.chartData.categories,
      axisLabel: {
        rotate: 25,
        interval: 0,
        formatter: (value: string) =>
          value.length > 15 ? value.slice(0, 15) + '…' : value
      }
    } : undefined,

    yAxis: !isPieLike ? { type: 'value' } : undefined,

    series: [
      isPieLike
        ? {
            name: this.chartTitle,
            type: 'pie',
            radius: this.isDonut ? ['40%', '60%'] : '60%',
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {d}%'  // optional formatting
            },
            data: this.chartData.categories.map((cat, i) => ({
              value: this.chartData.values[i],
              name: cat
            }))
          }
        : {
            name: this.chartTitle,
            type: this.chartType,
            data: this.chartData.values,
            smooth: true
          }
    ],

    // ✅ Apply zoom only for bar or line chart
    dataZoom: !isPieLike ? [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, bottom: 10 }
    ] : undefined
  };
}

//    setupEChart(): void {
//     const isPieLike = this.chartType === 'pie';

//     this.echartOptions = {
//       title: { text: this.chartTitle, left: 'center' },
//       tooltip: { trigger: isPieLike ? 'item' : 'axis' },
//       legend: isPieLike ? { orient: 'vertical', left: 'left' } : undefined,
//       xAxis: !isPieLike ? {
//         type: 'category',
//         data: this.chartData.categories,
//         axisLabel: {
//           rotate: 25,
//           interval: 0,
//           formatter: (value: string) => value.length > 15 ? value.slice(0, 15) + '…' : value
//         }
//       } : undefined,
//       yAxis: !isPieLike ? { type: 'value' } : undefined,
//       series: [
//         isPieLike
//           ? {
//               name: this.chartTitle,
//               type: 'pie',
//               radius: this.isDonut ? ['40%', '60%'] : '60%',
// center: ['50%', '60%'],
//               avoidLabelOverlap: false,
//               label: { show: true, position: 'outside' },
//               data: this.chartData.categories.map((cat, i) => ({
//                 value: this.chartData.values[i],
//                 name: cat
//               }))
//             }
//           : {
//               name: this.chartTitle,
//               type: this.chartType,
//               data: this.chartData.values,
//               smooth: true,
//             }
//       ],
//       // ✅ Apply zoom only for bar or line chart
//       dataZoom: !isPieLike ? [
//         { type: 'inside', start: 0, end: 100 },
//         { type: 'slider', start: 0, end: 100 }
//       ] : undefined
//     };
//   }




  // CHART.JS SETUP
setupChartJS(): void {
  const ctxId = `chartjs-${this.chartTitle}`;
  const ctx = document.getElementById(ctxId) as HTMLCanvasElement;
  if (!ctx) return;

  if (this.chartJsInstance) this.chartJsInstance.destroy();

  const total = this.chartData.categories.length;
  const visible = Math.floor(total / this.zoomLevel);
  const center = Math.floor(total / 2);
  const start = Math.max(0, center - Math.floor(visible / 2));
  const end = start + visible;

  const zoomedLabels = this.chartData.categories.slice(start, end);
  const zoomedValues = this.chartData.values.slice(start, end);

  const isPieLike = this.chartType === 'pie' || this.isDonut;
  const isLineLike = this.chartType === 'line';

  this.chartJsInstance = new Chart(ctx, {
    type: this.isDonut ? 'doughnut' : this.chartType,
    data: {
      labels: zoomedLabels,
      datasets: [{
        label: this.chartTitle,
        data: zoomedValues,
        backgroundColor: isPieLike
          ? [
              '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ec407a',
              '#ff7043', '#26a69a', '#d4e157', '#8d6e63', '#789262'
            ]
          : (isLineLike ? 'transparent' : '#42a5f5'),
        borderColor: isLineLike ? '#42a5f5' : undefined,
        fill: isLineLike ? false : undefined,
        tension: isLineLike ? 0.3 : undefined,
        pointRadius: isLineLike ? 4 : undefined,
        pointBackgroundColor: isLineLike ? '#42a5f5' : undefined,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: this.chartTitle },
        legend: isPieLike ? {
          display: true,
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 20,
            padding: 15,
            font: { size: 14 }
          }
        } : undefined
      },
      layout: isPieLike ? {
        padding: { left: 0, right: 100, top: 20, bottom: 20 }
      } : undefined,
      cutout: this.isDonut ? '50%' : undefined,
      radius: isPieLike ? '60%' : undefined,
      scales: isLineLike ? {
        x: { display: true },
        y: { display: true }
      } : undefined
    }
  });
}


  // ZOOM CONTROLS
  zoomIn(): void {
    this.zoomLevel *= 1.2;
    this.applyZoom();
  }

  zoomOut(): void {
    this.zoomLevel /= 1.3;
    this.applyZoom();
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.applyZoom();
  }

  // applyZoom(): void {
  //   if (this.chartLib === 'highcharts' && this.chartRef) {
  //     const xAxis = this.chartRef.xAxis[0];
  //     const total = xAxis.categories?.length || 0;
  //     const visible = Math.max(1, Math.floor(total / this.zoomLevel));
  //     const center = total / 2;
  //     const min = Math.max(0, Math.floor(center - visible / 2));
  //     const max = Math.min(total - 1, Math.ceil(center + visible / 2));
  //     xAxis.setExtremes(min, max);
  //   } else if (this.chartLib === 'echarts') {
  //     this.setupEChart(); // re-render with updated min/max
  //   } else if (this.chartLib === 'chartjs') {
  //     this.setupChartJS(); // re-render with sliced values
  //   }
  // }

  applyZoom(): void {
  if (this.chartLib === 'highcharts' && this.chartRef) {
    const xAxis = this.chartRef.xAxis[0];
    const total = this.chartData.categories.length;
    const visible = Math.max(1, Math.floor(total / this.zoomLevel));
    const center = Math.floor(total / 2);
    const min = Math.max(0, center - Math.floor(visible / 2));
    const max = Math.min(total - 1, min + visible);

    // For categorical axis, use index directly
    (xAxis as any).setExtremes(min, max);
  } else if (this.chartLib === 'echarts') {
    this.setupEChart(); // re-render with updated min/max
  } else if (this.chartLib === 'chartjs') {
    this.setupChartJS(); // re-render with sliced values
  }
}

}
