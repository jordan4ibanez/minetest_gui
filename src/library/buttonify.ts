import { error } from "tauri-plugin-log-api";

export { };


export function buttonClickEvent(buttonName: string, fun: () => void): void {

  const button: HTMLElement | null = document.getElementById(buttonName);

  if (button != null) {
    button.addEventListener("click", fun);
  } else {
    error(`Button ${buttonName} is null! Failed to attach button click event.`);
  }
}