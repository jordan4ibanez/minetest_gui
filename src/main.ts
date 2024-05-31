// import { app, shell, tauri } from "@tauri-apps/api";
// import { invokeTauriCommand } from "@tauri-apps/api/helpers/tauri";
// import { Command } from "@tauri-apps/api/shell";
// import { invoke } from "@tauri-apps/api/tauri";
import { trace, info, error, attachConsole } from "tauri-plugin-log-api";
// import { emit, listen } from '@tauri-apps/api/event';
import { buttonClickEvent, selectTab, tabify, Tabs } from "./library/buttonify";

// const random = Math.random;
const detach = await attachConsole();

// Neaten this up. :)
tabify("settings");

// The main loop which runs every 0.05 seconds.
function onStep(): void {

}



// Internal timer runs main at 20 FPS.
setInterval(onStep, 50);
detach();