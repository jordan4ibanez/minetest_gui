import { error } from "tauri-plugin-log-api";

export { };


// I guess this framework is called buttonify now.


/**
 * Easy enum for the 3 tabs. Makes it easy to add more.
 */
export enum Tabs {
  environment, controls, settings
}

/**
 * 
 * @param tab The Tabs enum.
 * @returns 
 */
export function stringifyTab(tab: Tabs): string {
  return Tabs[tab].toString();
}

/**
 * "Safely" get an element by it's ID. It'll just crash if it doesn't exist.
 * @param id The ID of the element.
 * @returns The element.
 */
export function safeGetElementByID(id: string): HTMLElement {
  const element: HTMLElement | null = document.getElementById(id);
  if (element != null) {
    return element;
  } else {
    error(`Button ${element} is null! Failed to attach button click event.`);
    throw new Error(`Button ${element} is null! Failed to attach button click event.`);
  }
}


/**
 * Easy way to register button onclick events.
 * @param buttonID The ID of the button.
 * @param fun What this does when clicked.
 */
export function buttonClickEvent(buttonID: string, fun: () => void): void {
  const button: HTMLElement | null = document.getElementById(buttonID);
  if (button != null) {
    button.addEventListener("click", fun);
  } else {
    error(`Button ${buttonID} is null! Failed to attach button click event.`);
  }
}

/**
 * Select a tab to focus on.
 * @param tabID The name of the tab.
 * @returns nothing
 */
export function selectTab(tabID: string): void {
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    let element: HTMLElement = tabcontent[i] as HTMLElement;
    element.style.display = "none";
  }
  let tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  let currentTab = document.getElementById(tabID);
  if (currentTab == null) {
    error(`Tried to select tab ${tabID} which doesn't exist!`);
    return;
  }
  currentTab.className += " active";
  let currentContent: HTMLElement | null = document.getElementById(tabID + "content");
  if (currentContent == null) {
    error(`Tried to select content ${tabID} which doesn't exist!`);
    return;
  }
  currentContent.style.display = "";
}

/**
 * Automatically create an on click event for tabs to focus on that "page".
 * @param defaultTab The default tab to select.
 */
export function tabify(defaultTab: Tabs): void {
  for (const tab of Object.keys(Tabs)) {
    if (typeof Tabs[tab as unknown as Tabs] !== "string") {
      const id = tab.toString();
      buttonClickEvent(id, () => {
        selectTab(id);
      });
    }
  }
  selectTab(stringifyTab(defaultTab));
}