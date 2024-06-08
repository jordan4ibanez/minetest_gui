import { error, info } from "tauri-plugin-log-api";
import { isRunning, killAllServers, messageServer, Settings, startServer, triggerRestartWatch } from ".";
import { open } from "@tauri-apps/api/dialog";

// I guess this framework is called buttonify now.

let players: string[] = [];

let magnetized: boolean = true;

/**
 * Easy enum for the 3 tabs. Makes it easy to add more.
 */
export enum Tabs {
  environment, controls, health
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
 * @param input Literally anything.
 */
export function printf(...input: any[]): void {
  info(input.join(" "));
}

/**
 * This is a logic gate which magnetizes the text are to the bottom but allows
 * you to unlock it by scrolling up.
 * 
 * Basically can allow you to choose to look at new messages automatically.
 */
(() => {
  let textArea = safeGetElementByID("environment-text") as HTMLTextAreaElement;

  textArea.addEventListener("scroll", () => {
    const height = textArea.scrollHeight;
    const offset = textArea.offsetHeight;
    const scroll = textArea.scrollTop;

    // Written out verbosely to ensure maintainability.
    const isAtBottom = (height - offset <= scroll);

    if (isAtBottom) {
      magnetized = true;
    } else {
      magnetized = false;
    }
  });
})();


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
      error(`Element [${id}] is null! Failed to safely get the element by ID.`);
      throw new Error(`Element [${id}] is null! Failed to safely get the element by ID.`);
    }
  }
}

/**
 * Safely attach an event listener to an Element by it's ID.
 * @param id Element ID.
 * @param eventType The event to listen for.
 * @param fun What to do.
 */
export function safeAddEventListenerByID(id: string, eventType: string, fun: (j: any) => void): void {
  safeGetElementByID(id).addEventListener(eventType, fun);
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
        Settings.setTab(Tabs[tab as unknown as Tabs] as unknown as Tabs);
        // info("hi");
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
  textArea.value += newText;

  if (magnetized) {
    const height = textArea.scrollHeight;
    const offset = textArea.offsetHeight;
    textArea.scrollTop = height - offset;
  }
};

/**
 * Create a player button in the environment tab.
 * @param name The player name.
 */
function addPlayerButton(name: string): void {
  let players: HTMLDivElement = safeGetElementByID("playerlist") as HTMLDivElement;
  let playerButton = document.createElement("button");
  playerButton.className = "playerbuttons";
  playerButton.id = `${name}-button`;
  playerButton.innerText = name;
  players.appendChild(playerButton);
}

/**
 * Remove a player button from the environment tab.
 * @param name The player name.
 */
function removePlayerButton(name: string): void {
  document.getElementById(`${name}-button`)?.remove();
}

/**
 * Refresh the player buttons so the server manager can see what's going on.
 */
function refreshPlayerButtons(): void {
  // We want this list to sort alphabetically every time this updates.
  players.sort((a, b) => a.localeCompare(b));
  players.forEach((player: string) => {
    removePlayerButton(player);
  });
  players.forEach((player: string) => {
    addPlayerButton(player);
  });
}

/**
 * Add a player to the gui environment.
 * @param name The player name.
 */
export function addPlayer(name: string): void {
  players.push(name);
  refreshPlayerButtons();
}

/**
 * Remove a player from the gui environment.
 * @param name The player name.
 */
export function removePlayer(name: string): void {
  const index = players.indexOf(name, 0);
  if (index > -1) {
    players.splice(index, 1);
  } else {
    error(`Tried to remove player [${name}] which doesn't exit in the environment.`);
    throw new Error(`Tried to remove player [${name}] which doesn't exit in the environment.`);
  }
  removePlayerButton(name);
  refreshPlayerButtons();

}

/**
 * Dump the saved settings into the controls settings thing.
 */
export function buttonSettingsApply(): void {
  (safeGetElementByID("port") as HTMLInputElement).value = Settings.getPort();
  (safeGetElementByID("game") as HTMLInputElement).value = Settings.getGame();
  (safeGetElementByID("world") as HTMLInputElement).value = Settings.getWorld();
  (safeGetElementByID("exe") as HTMLInputElement).value = Settings.getExe();
  (safeGetElementByID("conf") as HTMLInputElement).value = Settings.getConf();
}

//? Hyper autosave.
safeAddEventListenerByID("port", "input", () => {
  const portBox = safeGetElementByID("port") as HTMLInputElement;
  Settings.setPort(portBox.value);
});
safeAddEventListenerByID("game", "input", () => {
  const gameBox = safeGetElementByID("game") as HTMLInputElement;
  Settings.setGame(gameBox.value);
});
safeAddEventListenerByID("world", "input", () => {
  const worldBox = safeGetElementByID("world") as HTMLInputElement;
  Settings.setWorld(worldBox.value);
});
safeAddEventListenerByID("exe", "input", () => {
  const exeBox = safeGetElementByID("exe") as HTMLInputElement;
  Settings.setExe(exeBox.value);
});
safeAddEventListenerByID("conf", "input", () => {
  const confBox = safeGetElementByID("conf") as HTMLInputElement;
  Settings.setConf(confBox.value);
});

safeAddEventListenerByID("startserverbutton", "click", async () => {
  await startServer();
});

safeAddEventListenerByID("stopserverbutton", "click", () => {
  if (!isRunning()) {
    alert("No server is running!");
  }
  messageServer("/shutdown");
});

safeAddEventListenerByID("restartserverbutton", "click", () => {
  messageServer("/shutdown");
  triggerRestartWatch();
});

safeAddEventListenerByID("killall", "click", async () => {
  await killAllServers();
});


safeAddEventListenerByID("findexebutton", "click", async () => {
  let exeThing: string | string[] | null = await open({
    multiple: false,
  });

  if (exeThing === null || exeThing instanceof Array) {
    error("wat");
    return;
  }

  (safeGetElementByID("exe") as HTMLInputElement).value = exeThing;

  Settings.setExe(exeThing);
});

safeAddEventListenerByID("findconfbutton", "click", async () => {
  let confThing: string | string[] | null = await open({
    multiple: false,
  });

  if (confThing === null || confThing instanceof Array) {
    error("wat");
    return;
  }

  (safeGetElementByID("conf") as HTMLInputElement).value = confThing;

  Settings.setConf(confThing);
});

// todo: this should hook into an internal api to send the command to the server.
safeAddEventListenerByID("command-box", "keypress", (event: KeyboardEvent) => {
  if (event.key == "Enter") {

    // Poll info.
    const element = safeGetElementByID("command-box") as HTMLInputElement;
    const currentCommand = element.value.trim();

    // Sent this command to the server.
    messageServer(currentCommand);

    // Then clear it.
    element.value = "";
  }
});