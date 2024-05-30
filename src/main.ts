import { app, shell, tauri } from "@tauri-apps/api";
import { invokeTauriCommand } from "@tauri-apps/api/helpers/tauri";
import { Command } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";
import { trace, info, error, attachConsole } from "tauri-plugin-log-api";
import { emit, listen } from '@tauri-apps/api/event';


const detach = await attachConsole();

// let greetInputEl: HTMLInputElement | null;
// let greetMsgEl: HTMLElement | null;

// async function greet() {
//   if (greetMsgEl && greetInputEl) {
//     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//     greetMsgEl.textContent = await invoke("greet", {
//       name: greetInputEl.value,
//     });

//     info("hi");

//     console.log("hi");
//     trace("Trace");
//     info("Info");
//     error("Error");
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
//   document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
//     e.preventDefault();
//     greet();
//   });

// });


// window.addEventListener("click", (test: any) => {
//   info(test);
// });

// document.addEventListener("click", () => {
//   info("click");
// });

const button: HTMLElement | null = document.getElementById("cool");

if (button != null) {
  button.addEventListener("click", () => {
    info("hi");
  });
} else {
  error("Button is null!");
}


// info("hi");

// console.log("hi");
// trace("Trace");
// info("Info");
// error("Error");


detach();