import { app, shell, tauri } from "@tauri-apps/api";
import { invokeTauriCommand } from "@tauri-apps/api/helpers/tauri";
import { Command } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";
import { trace, info, error, attachConsole } from "tauri-plugin-log-api";
import { emit, listen } from '@tauri-apps/api/event';

const random = Math.random;
const detach = await attachConsole();

const button: HTMLElement | null = document.getElementById("cool");

if (button != null) {
  button.addEventListener("click", () => {
    info("hi " + random());

    button.innerText = "yep " + random();
  });
} else {
  error("Button is null!");
}



// The main loop which runs every 0.05 seconds.
function onStep(): void {

}



// Internal timer runs main at 20 FPS.
setInterval(onStep, 50);
detach();