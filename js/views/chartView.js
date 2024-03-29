//---------- This view is responsible for rendering the "Chance of rain" chart ----------//

import View from './View.js';
// instead of importing the whole library, taking advantage of tree-shaking (better performance)
import {
  CategoryScale,
  Chart,
  LinearScale,
  BarController,
  BarElement,
} from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarController, BarElement);

// MAIN OPTIONS
Chart.defaults.font.size = 14;
Chart.defaults.font.family = 'Red Hat Display, sans-serif';
Chart.defaults.font.weight = 600;
Chart.defaults.font.lineHeight = 1;

class ChartView extends View {
  _diagram = document.getElementById('diagram');
  _chartData = [...Array(7)].map(x => []); // empty array with 7 empty arrays
  _delayed; // for the animation delay

  // ---------- MAIN FUNCTION ---------- //

  renderChart(data) {
    // IF there is a current chart, destroy it, so it can be applied to other cities with the same config
    this._checkCurrentChart();

    // Fill the chartData object with data which will be displayed (days+values)
    this._fillChartData(data);

    // create chart
    new Chart(this._diagram, this._precipitationChart());
  }

  // ---------- HELPER FUNCTIONS ---------- //

  _checkCurrentChart() {
    const currentChart = Chart.getChart('diagram');
    if (currentChart) currentChart.destroy();
  }

  _fillChartData(data) {
    const daysArrayKeys = Object.keys(data.weather.days); // zero, one, two....
    const daysArrayValues = Object.values(data.weather.days); // data for: zero, one, two....
    const dayNames = Object.values(data.dayNames); // 0: current day (friday) / 1: tomorrow (saturday)

    daysArrayKeys.forEach((_, i) => {
      this._chartData[i].time = dayNames[i].slice(0, 3);
      this._chartData[i].chance =
        daysArrayValues[i].precipitation_probability_max;
    });
  }

  _precipitationChart() {
    return {
      type: 'bar',
      // -----------OPTIONS----------- //
      options: {
        // ---SCALES--- //
        scales: {
          x: {
            // X AXIS
            border: { display: false },
            ticks: {
              color: '#888',
            },
          },
          y: {
            // Y AXIS
            border: { display: false },
            max: 100,
            min: 0,
            position: 'left',
            grid: {
              lineWidth: 1.5, // width of the grey line
              color: '#242426',
            },
            ticks: {
              color: '#666',
              count: 6, // 100, 80, 60, 40, 20, 0
            },
          },
        },

        responsive: true, // benefits on resizing
        aspectRatio: 2 / 1.34, // default is 2/1 | this is a more responsible way to adjust height
        // ---ANIMATION--- //
        animation: {
          duration: 1000, // duration of loading animation
          easing: 'easeOutBack', // easing animation
          // loading animation
          onComplete: () => {
            this._delayed = true;
          },
          delay: context => {
            let delay = 0;
            if (
              context.type === 'data' &&
              context.mode === 'default' &&
              !this._delayed
            ) {
              delay = context.dataIndex * 200 + context.datasetIndex * 100; // amount of delay
            }
            return delay;
          },
        }, // might disable if loading is too slow
        // ---LAYOUT SETTINGS--- //
        layout: { padding: 0 },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        normalized: true, // for performance
      },

      // -----------DATA----------- //
      data: {
        labels: this._chartData.map(row => row.time),
        datasets: [
          {
            data: this._chartData.map(row => row.chance),
            backgroundColor: '#5f92b5', // background color of the bars
            hoverBackgroundColor: '#4c7591', // on hover
            borderRadius: 100,
            barThickness: 12,
            borderSkipped: false, // this helps rounding the corners in the bottom too
          },
        ],
      },
    };
  }
}

export default new ChartView();
