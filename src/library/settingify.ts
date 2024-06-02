import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { Tabs } from "./buttonify";
import { info } from "tauri-plugin-log-api";
// import { appDataDir } from "@tauri-apps/api/path";
// import { info } from "tauri-plugin-log-api";

export { };

// info(`Working in path: ${await appDataDir()}`);

class Settingly {
  tab: Tabs = Tabs.environment;
}

export async function loadSettings() {
  if (await exists("settings.conf", { dir: BaseDirectory.AppData })) {
    const text: string = await readTextFile("setting.conf", { dir: BaseDirectory.AppData });
    const thing: Object = JSON.parse(text);

    if (thing instanceof Settingly) {
      
    } else {
      info("STOP MODIFYING THE SETTINGS FILE WITHOUT READING THE SOURCE CODE PLEASE!");
    }
  }
}

export async function saveSettings() {
  // info("writing thing");
  await writeTextFile("settings.conf", JSON.stringify({ dir: "hi" }), { dir: BaseDirectory.AppData });
  // await exists("poop.png", { dir: "" });
  // info("done");
}