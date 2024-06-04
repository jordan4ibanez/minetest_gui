import { Chart } from "chart.js/auto";
import { safeGetElementByID } from ".";
// import { info } from "tauri-plugin-log-api";

let memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const memorychartcanvas = safeGetElementByID('memorychart') as HTMLCanvasElement;

let timeSpan: number[] = [];
for (let i = 0; i < 30; i++) {
  timeSpan.push(29 - i);
}

let timer: number = 0;

let memoryGraph: Chart<"line", number[], number> = new Chart(memorychartcanvas, {
  type: 'line',
  data: {
    labels: timeSpan,
    datasets: [{
      label: 'Memory consumption (Megabytes)',
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

export function memoryPollLogic(): void {
  timer += 0.05;

  if (timer < 1) {
    return;
  }

  timer = 0;
  addData(Math.random() * 100);
}

export function loadCharts(): void {
  // Blank payload to avoid tree shaking.
}