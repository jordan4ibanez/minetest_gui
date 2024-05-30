import { app, shell, tauri } from "@tauri-apps/api";
import { invokeTauriCommand } from "@tauri-apps/api/helpers/tauri";
import { Command } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

let x = document.getElementById("#cool");

app.getTauriVersion();

invoke("println", {});

tauri.invoke("echo hi");