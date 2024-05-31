import { app, shell, tauri } from "@tauri-apps/api";
import { invokeTauriCommand } from "@tauri-apps/api/helpers/tauri";
import { Command } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";
import { trace, info, error, attachConsole } from "tauri-plugin-log-api";
import { emit, listen } from '@tauri-apps/api/event';


const detach = await attachConsole();

const button: HTMLElement | null = document.getElementById("cool");

if (button != null) {
  button.addEventListener("click", () => {
    info("hi");
  });
} else {
  error("Button is null!");
}



function onStep(): void {
  info("hi");
}



// Internal timer runs main at 0.05 FPS.
setInterval(onStep, 50);
detach();