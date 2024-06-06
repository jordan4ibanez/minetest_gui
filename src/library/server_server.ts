

//? how to run minetestserver on installed server
// let x: Command = new Command("minetestserver", "");
// let y = await x.spawn();
// info(y.pid.toString());

import { Command } from "@tauri-apps/api/shell";
import { environmentTextAppend, Settings } from ".";
import { info } from "tauri-plugin-log-api";

// const args = ["-c", `${Settings.getExe()} --gameid forgotten_lands`];

let running = false;

const bash = "bash";

const bashTrigger = "-c";

let args = "minetestserver --terminal --gameid forgotten-lands --port 30234";

/**
 * Catch-all whenever the server settings are updated.
 */
export function updateServerRuntimeSettings(): void {

  // Check if running system-wide.

  const exeDir = Settings.getExe();
  let exeCommand = "";
  if (exeDir === "") {
    exeCommand = "minetestserver";
  } else {
    exeCommand = exeDir;
  }

  // Now rebuild the args.
  args = `${exeCommand} --terminal --gameid ${Settings.getGame()} --worldname ${Settings.getWorld()} --port ${Settings.getPort()}`;
  info(args);
}

export function startServer(): void {
  info("starting");
}

// //! attempt to get this thing to spawn the minetest executable
// let x: Command = new Command(command, args);
// x.stdout.addListener("data", (...args: any[]) => {
//   for (const thing of args) {
//     if (typeof thing === "string") {
//       environmentTextAppend(thing.trim() /*+ "\n".slice(11)*/);
//     } else {
//       info("wut");
//     }
//   }


//   // environmentTextAppend(args);
//   // printf(args);
// });
// x.stderr.addListener("data", (...args: any[]) => {
//   for (const thing of args) {
//     if (typeof thing === "string") {
//       environmentTextAppend(thing /*+ "\n".slice(11)*/);
//     } else {
//       info("wut");
//     }
//   }
//   // printf(args);
// });
// let y = await x.spawn();
// info(y.pid.toString());


export function serverPayload(): void {

}