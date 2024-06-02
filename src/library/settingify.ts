import { writeText } from "@tauri-apps/api/clipboard";
import { BaseDirectory, exists, writeFile, writeTextFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { info } from "tauri-plugin-log-api";

export { };

const path = await appDataDir();

const settingsPath = path + "settings.txt";

const logPath = path + "log.txt";

info(settingsPath);

export async function testify() {
  info("writing thing");
  await writeTextFile("setting.conf", JSON.stringify({ dir: "hi" }), { dir: BaseDirectory.AppData });
  // await exists("poop.png", { dir: "" });
  info("done");
}