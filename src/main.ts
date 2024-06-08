import { attachConsole } from "tauri-plugin-log-api";
import { loadSettings, tabify, Settings, loadCharts, memoryPollLogic, buttonSettingsApply, updateServerRuntimeSettings, tickTimeInMS, tickTimeInSeconds } from "./library";


// Makes the presentation of the window nice.
// await fancyWindow();

// const random = Math.random;
const detach = await attachConsole();


// Deploy the settings.
await loadSettings();

// Deploy the tabs.
tabify(Settings.getTab());

// Deploy the saved controls data.
buttonSettingsApply();

// Load the charts.
loadCharts();

// Create the base server launch environment.
updateServerRuntimeSettings();



// The main loop which runs every 0.05 seconds.
function onStep(): void {
  const delta = tickTimeInSeconds;
  memoryPollLogic(delta);
}

// Internal timer runs main at 20 FPS.
setInterval(onStep, tickTimeInMS);
detach();

