import { attachConsole } from "tauri-plugin-log-api";
import { loadSettings, tabify, Settings, loadCharts, memoryPollLogic, buttonSettingsApply, updateServerRuntimeSettings, tickTimeInMS, tickTimeInSeconds, restartWatch } from "./library";


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
async function onStep(): Promise<void> {
  const delta = tickTimeInSeconds;
  await memoryPollLogic(delta);
  await restartWatch(delta);
  // spamTest();
}

// Internal timer runs main at 20 FPS.
setInterval(onStep, tickTimeInMS);
detach();

