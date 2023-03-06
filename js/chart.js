// instead of importing the whole library, taking advantage of tree-shaking
import {
  CategoryScale,
  Chart,
  LinearScale,
  BarController,
  BarElement,
} from "chart.js";
Chart.register(CategoryScale, LinearScale, BarController, BarElement);

// MAIN OPTIONS
Chart.defaults.font.size = 14;
Chart.defaults.font.family = "Red Hat Display, sans-serif";
Chart.defaults.font.weight = 600;
Chart.defaults.font.lineHeight = 1;

let delayed; //for the animation delay

// TEMPORARY STATIC DATA
(async function () {
  const data = [
    { time: 10, chance: 50 },
    { time: 11, chance: 40 },
    { time: 12, chance: 80 },
    { time: 1, chance: 20 },
    { time: 2, chance: 65 },
    { time: 3, chance: 50 },
    { time: 2, chance: 90 },
  ];

  new Chart(document.querySelector(".diagram__container"), {
    type: "bar",
    // -----------OPTIONS----------- //
    options: {
      // ---SCALES--- //
      scales: {
        x: {
          // X AXIS
          border: { display: false },
          ticks: {
            color: "#888",
          },
        },
        y: {
          // Y AXIS
          border: { display: false },
          max: 100,
          min: 0,
          position: "left",
          grid: {
            lineWidth: 1.5, // width of the grey line
            color: "#242426",
          },
          ticks: {
            color: "#888",
            count: 6, // 100, 80, 60, 40, 20, 0
          },
        },
      },

      responsive: true, // benefits on resizing
      // ---ANIMATION--- //
      animation: {
        duration: 1000, // duration of loading animation
        easing: "easeOutBack", // easing animation
        // loading animation
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
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
      labels: data.map((row) => row.time),
      datasets: [
        {
          data: data.map((row) => row.chance),
          backgroundColor: "#bbd8ec", // background color of the bars
          hoverBackgroundColor: "#96adbd", // on hover
          borderRadius: 100,
          barThickness: 12,
          borderSkipped: false, // this helps rounding the corners in the bottom too
        },
      ],
    },
  });
})();
