

//? how to run minetestserver on installed server
// let x: Command = new Command("minetestserver", "");
// let y = await x.spawn();
// info(y.pid.toString());

import { Command } from "@tauri-apps/api/shell";
import { environmentTextAppend } from ".";
import { info } from "tauri-plugin-log-api";

const command = "bash";
// const args = ["-c", `${Settings.getExe()} --gameid forgotten_lands`];
// const command = "minetestserver";
const args = ["-c", "minetestserver --terminal --gameid forgotten-lands --port 30234"];

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