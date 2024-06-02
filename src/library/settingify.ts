import { writeText } from "@tauri-apps/api/clipboard";
import { writeFile, writeTextFile } from "@tauri-apps/api/fs";
import { info } from "tauri-plugin-log-api";

export { };

info("settingify");

export function testify() {
  writeTextFile("hi", "hi");
}