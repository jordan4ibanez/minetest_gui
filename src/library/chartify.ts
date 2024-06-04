import { Chart } from "chart.js/auto";
import { safeGetElementByID } from ".";
// import { info } from "tauri-plugin-log-api";



export function loadCharts(): void {

  const ctx = safeGetElementByID('memorychart') as HTMLCanvasElement;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}