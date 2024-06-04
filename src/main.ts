// import { app, shell, tauri } from "@tauri-apps/api";
// import { invokeTauriCommand } from "@tauri-apps/api/helpers/tauri";
// import { Command } from "@tauri-apps/api/shell";
// import { invoke } from "@tauri-apps/api/tauri";
import { info, attachConsole, error } from "tauri-plugin-log-api";
// import { emit, listen } from '@tauri-apps/api/event';
import { loadSettings, tabify, Settings, safeGetElementByID, environmentTextAppend, loadCharts, controllerify, safeAddEventListenerByID, addData, memoryPollLogic } from "./library";
import { open } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";

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

window.addEventListener("resize", () => {
  // info("resized!");

  let div = safeGetElementByID("environmentcontent");

  // printf("offsetHeight", div.offsetHeight);

});

// let test = document.getElementById("environmentcontent");

// if (test != null) {
//   info(test.namespaceURI || "");
//   test.addEventListener("windowResize", () => {
//     info("hi");
//   });
// } else {
//   error("it's null >:(");
// }


// The main loop which runs every 0.05 seconds.
function onStep(): void {
  memoryPollLogic();
}

// Internal timer runs main at 20 FPS.
setInterval(onStep, 50);
detach();