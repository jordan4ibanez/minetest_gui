import { Command } from "@tauri-apps/api/shell";
import { info, attachConsole, error } from "tauri-plugin-log-api";
import { loadSettings, tabify, Settings, safeGetElementByID, environmentTextAppend, loadCharts, controllerify, safeAddEventListenerByID, addData, memoryPollLogic, printf } from "./library";
import { open } from "@tauri-apps/api/dialog";

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

// todo: this should hook into an internal api to send the command to the server.
safeAddEventListenerByID("command-box", "keypress", (event: KeyboardEvent) => {
  if (event.key == "Enter") {

    // Poll info.
    const element = safeGetElementByID("command-box") as HTMLInputElement;
    const currentCommand = element.value.trim();

    // Here would be a send to server event.
    // info(currentCommand);
    // todo: remove this placeholder.
    environmentTextAppend(currentCommand);

    // Then clear it.
    element.value = "";
  }
});


//? Hyper autosave.
safeAddEventListenerByID("ip", "input", () => {
  const ipBox = safeGetElementByID("ip") as HTMLInputElement;
  Settings.setIP(ipBox.value);
});
safeAddEventListenerByID("port", "input", () => {
  const portBox = safeGetElementByID("port") as HTMLInputElement;
  Settings.setPort(portBox.value);
});
safeAddEventListenerByID("game", "input", () => {
  const gameBox = safeGetElementByID("game") as HTMLInputElement;
  Settings.setGame(gameBox.value);
});
safeAddEventListenerByID("world", "input", () => {
  const worldBox = safeGetElementByID("world") as HTMLInputElement;
  Settings.setWorld(worldBox.value);
});
safeAddEventListenerByID("exe", "input", () => {
  const exeBox = safeGetElementByID("exe") as HTMLInputElement;
  Settings.setExe(exeBox.value);
});


safeAddEventListenerByID("findexebutton", "click", async () => {
  info("click");
  let exeThing: string | string[] | null = await open({
    multiple: false,
  });

  if (exeThing === null || exeThing instanceof Array) {
    error("wat");
    return;
  }

  (safeGetElementByID("exe") as HTMLInputElement).value = exeThing;

  Settings.setExe(exeThing);
});

//? how to run minetestserver on installed server
// let x: Command = new Command("minetestserver", "");
// let y = await x.spawn();
// info(y.pid.toString());

//! attempt to get this thing to spawn the minetest executable
let x: Command = new Command("bash", ["-c", Settings.getExe()]);
x.stdout.addListener("data", (...args: any[]) => {
  for (const thing of args) {
    if (typeof thing === "string") {
      environmentTextAppend(thing.trim());
    }
  }
  // environmentTextAppend(args);
  info(`command stdout: "${args}"`);
});
x.stderr.addListener("data", (...args: any[]) => {
  for (const thing of args) {
    if (typeof thing === "string") {
      environmentTextAppend(thing.trim().slice(11));
    }
  }
  printf(args);
});
let y = await x.spawn();
info(y.pid.toString());

// The main loop which runs every 0.05 seconds.
function onStep(): void {
  memoryPollLogic();
}

// Internal timer runs main at 20 FPS.
setInterval(onStep, 50);
detach();