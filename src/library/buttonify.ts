import { error, info } from "tauri-plugin-log-api";

export { };


// I guess this framework is called buttonify now.


/**
 * Easy enum for the 3 tabs. Makes it easy to add more.
 */
export enum Tabs {
  environment, controls, health, settings
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
 * Use a logger to terminal without annoying workarounds in Tauri.
 * 
 *! WARNING ! THIS HAS A MEMORY LEAK ! WARNING !
 * @param input Literally anything.
 */
export function printf(...input: any[]): void {
  info(input.join(" "));
}


/**
 * Safely get an element by it's ID. It'll just crash if it doesn't exist.
 * @param id The ID of the element.
 * @param info Optionally override the error message if this fails to get the element.
 * @returns The element.
 */
export function safeGetElementByID(id: string, info?: string): HTMLElement {
  const element: HTMLElement | null = document.getElementById(id);
  if (element != null) {
    return element;
  } else {
    if (info != null) {
      error(info);
      throw new Error(info);
    } else {
      error(`Element [${id}] is null! Failed to get safely the element by ID.`);
      throw new Error(`Element [${id}] is null! Failed to get safely the element by ID.`);
    }
  }
}

/**
 * Easy way to register button onclick events.
 * @param buttonID The ID of the button.
 * @param fun What this does when clicked.
 */
export function buttonClickEvent(buttonID: string, fun: () => void): void {
  safeGetElementByID(buttonID, `Button ${buttonID} is null! Failed to attach button click event.`)
    .addEventListener("click", fun);
}

/**
 * Shorthand for iterating class elements.
 * @param className The class name.
 * @param fun What to do with each element.
 */
export function iterElementsByClassName(className: string, fun: (element: Element, index?: number) => void) {
  let id = 0;
  for (let element of document.getElementsByClassName(className)) {
    fun(element, id);
    id++;
  }
}

/**
 * Select a tab to focus on.
 * @param tabID The name of the tab.
 * @returns nothing
 */
export function selectTab(tabID: string): void {
  iterElementsByClassName("tabcontent", (content: Element) => {
    (content as HTMLElement).style.display = "none";
  });
  iterElementsByClassName("tablinks", (tablink: Element) => {
    tablink.className = tablink.className.replace(" active", "");
  });

  safeGetElementByID(tabID, `Tried to select tab [${tabID}] which doesn't exist!`)
    .className += " active";

  let currentContent: HTMLElement | null = document.getElementById(tabID + "content");
  if (currentContent == null) {
    error(`Tried to select content [${tabID}] which doesn't exist!`);
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

/**
 * Get the current time in HH:MM:SS format.
 * @returns Time in HH:MM:SS format.
 */
export function timeify(): string {
  const date = new Date();
  let accumulator: string = "";
  [date.getHours(), date.getMinutes(), date.getSeconds()].forEach((v, k) => {
    accumulator += (v < 10 ? `0${v}` : v) + (k == 2 ? "" : ":");
  });
  return accumulator;
}

/**
 * Append text to the environmental text log box thing.
 * @param newText The new text to append.
 */
export function environmentTextAppend(newText: string): void {
  let textArea = safeGetElementByID("environment-text") as HTMLTextAreaElement;
  textArea.value += `[${timeify()}] ${newText}\n`;
};

export function addPlayer(name: string): void {
  let players: HTMLDivElement = safeGetElementByID("playerlist") as HTMLDivElement;
  let playerButton = document.createElement("button");
  playerButton.className = "playerbuttons";
  playerButton.id = `${name}-button`;
  playerButton.innerText = name;
  players.appendChild(playerButton);
}

export function removePlayer(name: string): void {
  document.getElementById(`${name}-button`)?.remove();
}

addPlayer("meow");
removePlayer("jordan4ibanez");
addPlayer("jordan4ibanez");
addPlayer("fred");
addPlayer("smonker");