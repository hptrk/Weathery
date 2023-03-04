import Chart, { LinearScale } from "chart.js/auto"; //NOT AUTO // todo
Chart.defaults.font.size = 14;
Chart.defaults.font.family = "Red Hat Display, sans-serif";
Chart.defaults.font.weight = 700;
Chart.defaults.font.lineHeight = 1; //MIGHT CHANGE LATER // todo

let delayed;

(async function () {
  const data = [
    { time: 10, chance: 50 },
    { time: 11, chance: 30 },
    { time: 12, chance: 80 },
    { time: 1, chance: 20 },
    { time: 2, chance: 40 },
    { time: 3, chance: 30 },
  ];

  new Chart(document.querySelector(".diagram__container"), {
    type: "bar",
    options: {
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
        },
      ],
    },
  });
})();
