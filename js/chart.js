import Chart from "chart.js/auto"; //NOT AUTO // todo
Chart.defaults.font.size = 14;
Chart.defaults.font.family = "Red Hat Display, sans-serif";
Chart.defaults.font.weight = 600;
Chart.defaults.font.lineHeight = 1;
Chart.defaults.elements.bar.backgroundColor = "red";

let delayed;

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
    options: {
      scales: {
        x: {
          border: { display: false },
          grid: {
            lineWidth: 0,
            tickLength: 0,
          },
          ticks: {
            color: "#888",
          },
        },
        y: {
          border: { display: false },
          max: 100,
          min: 0,
          position: "left",
          grid: {
            lineWidth: 1.5,
            tickLength: 0,
            color: "#242426",
          },
          ticks: {
            color: "#888",
            count: 6, //100, 80, 60, 40, 20, 0
          },
        },
      },
      responsive: true,
      animation: {
        duration: 1000,
        easing: "easeOutBack",
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
            delay = context.dataIndex * 200 + context.datasetIndex * 100;
          }
          return delay;
        },
      }, //might disable if loading is too slow
      layout: { padding: 0 },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      //performance
      normalized: true,
    },
    data: {
      labels: data.map((row) => row.time),
      datasets: [
        {
          data: data.map((row) => row.chance),
          backgroundColor: "#bbd8ec",
          hoverBackgroundColor: "#96adbd",
          borderRadius: 100,
          barThickness: 12,
          borderSkipped: false,
        },
      ],
    },
  });
})();
