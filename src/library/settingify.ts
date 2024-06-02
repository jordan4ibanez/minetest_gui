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

export async function loadSettings(): Promise<void> {
  if (await exists(settingFileName, { dir: BaseDirectory.AppData })) {
    const text: string = await readTextFile("setting.conf", { dir: BaseDirectory.AppData });
    const thing: Object = JSON.parse(text);

    if (thing instanceof Settingly) {
      info("that's a thing :)");

    } else {
      info("STOP MODIFYING THE SETTINGS FILE WITHOUT READING THE SOURCE CODE PLEASE!");
    }
  }
}

export async function saveSettings(): Promise<void> {
  // info("writing thing");
  await writeTextFile(settingFileName, JSON.stringify({ dir: "hi" }), { dir: BaseDirectory.AppData });
  // await exists("poop.png", { dir: "" });
  // info("done");
}