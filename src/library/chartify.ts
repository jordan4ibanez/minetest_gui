import { Chart } from "chart.js/auto";
import { getPID, safeGetElementByID } from ".";
import { Command } from "@tauri-apps/api/shell";
// import { info } from "tauri-plugin-log-api";

let memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const memorychartcanvas = safeGetElementByID('memorychart') as HTMLCanvasElement;

let timeSpan: number[] = [];
for (let i = 0; i < 30; i++) {
  timeSpan.push(29 - i);
}

Chart.defaults.font.size = 32;

let timer: number = 0;

let memoryGraph: Chart<"line", number[], number> = new Chart(memorychartcanvas, {
  type: 'line',
  data: {
    labels: timeSpan,
    datasets: [{
      label: 'Memory consumption (Megabytes)',
      data: memory,
      borderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 20,
      pointHitRadius: 20,
      borderColor: " 	#0096FF",
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 1024,
        ticks: {
          color: "white"
        },
        grid: {
          color: "black",
          lineWidth: 4
        }
      },
      x: {
        ticks: {
          color: "white"
        },
        grid: {
          color: "black",
          lineWidth: 4
        }
      },
    },
    color: "white",
    animation: false,
    maintainAspectRatio: true,
    responsive: true,
    // onResize: (chart) => {
    //   chart.resize();
    // }
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

  // info(`pid: ${getPID()}`);

  timer = 0;

  const pid: number = getPID();

  let memory: number = 0;

  if (pid !== -1) {
    // This was truly horrible to find out how to do this.
    // https://stackoverflow.com/questions/131303/how-can-i-measure-the-actual-memory-usage-of-an-application-or-process
    const memPollCommand = new Command("bash", ["-c", `awk '/^Pss:/ {pss+=$2} END {print pss}' < /proc/${pid}/smaps`]);
    memPollCommand.stdout.addListener("data", (data: string) => {
      memory = (parseInt(data) / 1024);
      // info((mb / 1024).toFixed(1).toString());
    });
    await memPollCommand.execute();
  }

  addData(memory);
  // addData(Math.random() * 100);
}

export function loadCharts(): void {
  // Blank payload to avoid tree shaking.
}