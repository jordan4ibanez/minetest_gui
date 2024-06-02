import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { Tabs } from "./buttonify";
import { info } from "tauri-plugin-log-api";
// import { appDataDir } from "@tauri-apps/api/path";
// import { info } from "tauri-plugin-log-api";

export { };

const settingFileName: string = "settings.conf";
const dirInfo = { dir: BaseDirectory.AppData };
// info(`Working in path: ${await appDataDir()}`);

class Settingly {
  tab: Tabs = Tabs.environment;
}

const settings: Settingly = await loadSettings();

/**
 * Raw object used as a weird dispatcher.
 * 
 * This thing sacrifices disk performance to make sure it saves everything
 * every time you do something.
 * 
 * Which will be really noticeable if you're using a windows xp machine.
 */
export const Settings = {
  getTab(): Tabs {
    return settings.tab;
  },
  setTab(tab: Tabs): void {
    settings.tab = tab;
    saveSettings();
  }
};

/**
 * Half baked attempt at reflection on a JSON object.
 * @param input The raw JSON object.
 * @returns If this thing is a Settingly object.
 */
function checkReflect(input: Object): boolean {
  for (const [key, value] of Object.entries(new Settingly())) {
    const valueType: string = typeof value;
    const has = input.hasOwnProperty(key);
    const typeMatch = typeof input[key as keyof Object] === valueType;
    if (!has || !typeMatch) {
      return false;
    }
  }
  return true;
}

/**
 * Load the settings from the file if it exists.
 * @returns The Settingly object.
 */
export async function loadSettings(): Promise<Settingly> {
  try {
    if (await exists(settingFileName, dirInfo)) {
      const text: string = await readTextFile(settingFileName, dirInfo);
      const thing: Object = JSON.parse(text);
      if (checkReflect(thing)) {
        // info("that's a thing :)");
        return thing as Settingly;
      } else {
        info("STOP MODIFYING THE SETTINGS FILE WITHOUT READING THE SOURCE CODE PLEASE!");
        return new Settingly();
      }
    } else {
      info("failed completely");
      return new Settingly();
    }
  } catch (e: any) {
    info(e);
    return new Settingly();
  }
}

/**
 * Save the settings file.
 */
export async function saveSettings(): Promise<void> {
  await writeTextFile(settingFileName, JSON.stringify(settings), dirInfo);
}