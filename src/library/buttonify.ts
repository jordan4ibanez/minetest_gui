import { error } from "tauri-plugin-log-api";

export { };

// This is totally undocumented cause I'm a lazy fuck

export function buttonClickEvent(buttonID: string, fun: () => void): void {
  const button: HTMLElement | null = document.getElementById(buttonID);
  if (button != null) {
    button.addEventListener("click", fun);
  } else {
    error(`Button ${buttonID} is null! Failed to attach button click event.`);
  }
}

