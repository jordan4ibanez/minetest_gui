import { attachConsole } from "tauri-plugin-log-api";
import { loadSettings, tabify, Settings, loadCharts, controllerify, memoryPollLogic } from "./library";


// const random = Math.random;
const detach = await attachConsole();


// Deploy the settings.
await loadSettings();

// Deploy the tabs.
tabify(Settings.getTab());

// Deploy the saved controls data.
controllerify();

// Load the charts.
loadCharts();






// The main loop which runs every 0.05 seconds.
function onStep(): void {
  memoryPollLogic();

  // printf(y.pid);
}

// Internal timer runs main at 20 FPS.
setInterval(onStep, 50);
detach();

