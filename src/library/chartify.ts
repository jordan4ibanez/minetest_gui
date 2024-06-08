import { Chart } from "chart.js/auto";
import { getPID, safeGetElementByID } from ".";
import { info } from "tauri-plugin-log-api";
import { Command } from "@tauri-apps/api/shell";
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

export async function memoryPollLogic(delta: number): Promise<void> {
  timer += delta;

  if (timer < 1) {
    return;
  }

  info(`pid: ${getPID()}`);

  timer = 0;

  const pid: number = getPID();

  let memory: number = 0;

  if (pid !== -1) {
    // This was truly horrible to find out how to do this.
    // https://stackoverflow.com/questions/131303/how-can-i-measure-the-actual-memory-usage-of-an-application-or-process
    const memPollCommand = new Command("bash", ["-c", `awk '/^Pss:/ {pss+=$2} END {print pss}' < /proc/${pid}/smaps`]);
    memPollCommand.stdout.addListener("data", (data: string) => {
      let mb: number = parseInt(data);
      info((mb / 1024).toFixed(1).toString());
    });
    await memPollCommand.execute();
  }

  addData(Math.random() * 100);
}

export function loadCharts(): void {
  // Blank payload to avoid tree shaking.
}