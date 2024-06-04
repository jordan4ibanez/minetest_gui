import { Chart } from "chart.js/auto";
import { safeGetElementByID } from ".";
// import { info } from "tauri-plugin-log-api";

let memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const memorychartcanvas = safeGetElementByID('memorychart') as HTMLCanvasElement;

let timeSpan: number[] = [];
for (let i = 0; i < 30; i++) {
  timeSpan.push(i);
}

let memoryGraph: Chart<"line", number[], number> = new Chart(memorychartcanvas, {
  type: 'line',
  data: {
    labels: timeSpan,
    datasets: [{
      label: 'Memory consumption',
      data: memory,
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    animation: false
  }
});

export function addData(newData: number): void {
  memory.shift();
  memory.push(newData);
  memoryGraph.update();
}

export function loadCharts(): void {
  // Blank payload to avoid tree shaking.
}