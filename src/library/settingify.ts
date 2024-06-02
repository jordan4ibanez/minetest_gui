import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { Tabs } from "./buttonify";
import { info } from "tauri-plugin-log-api";
// import { appDataDir } from "@tauri-apps/api/path";
// import { info } from "tauri-plugin-log-api";

export { };

const settingFileName: string = "settings.conf";
// info(`Working in path: ${await appDataDir()}`);

class Settingly {
  tab: Tabs = Tabs.environment;
}

const settings: Settingly = await loadSettings();

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
    if (await exists(settingFileName, { dir: BaseDirectory.AppData })) {
      const text: string = await readTextFile(settingFileName, { dir: BaseDirectory.AppData });
      const thing: Object = JSON.parse(text,) as Settingly;
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
  // info("writing thing");
  await writeTextFile(settingFileName, JSON.stringify(settings), { dir: BaseDirectory.AppData });
  // await exists("poop.png", { dir: "" });
  // info("done");
}