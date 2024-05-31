import { error } from "tauri-plugin-log-api";

export { };

// This is totally undocumented cause I'm a lazy fuck

export enum Tabs {
  environment, controls, settings
}

export function buttonClickEvent(buttonID: string, fun: () => void): void {
  const button: HTMLElement | null = document.getElementById(buttonID);
  if (button != null) {
    button.addEventListener("click", fun);
  } else {
    error(`Button ${buttonID} is null! Failed to attach button click event.`);
  }
}

export function selectTab(tabID: string): void {
  // Get all elements with class="tabcontent" and hide them
  let tabcontent = document.getElementsByClassName("tabcontent");

  for (let i = 0; i < tabcontent.length; i++) {
    let element: HTMLElement = tabcontent[i] as HTMLElement;
    element.style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  let tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  let currentTab = document.getElementById(tabID);

  if (currentTab == null) {
    error(`Tried to select tab ${tabID} which doesn't exist!`);
    return;
  }

  // currentTab.style.display = "block";

  currentTab.className += " active";
}