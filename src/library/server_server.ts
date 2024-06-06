import { Child, Command } from "@tauri-apps/api/shell";
import { environmentTextAppend, printf, selectTab, Settings, Tabs } from ".";
import { info } from "tauri-plugin-log-api";
const bash: string = "bash";

// const evaluate: string = "eval";

const bashTrigger: string = "-c";

let args: string = "";

let command: Command | null = null;

let process: Child | null = null;

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
  // info(args);
}

/**
 * Checks if the minetest.conf has a name = god in it.
 */
// async function checkGodMode(): Promise<void> {
//   const confDir = Settings.getConf();
//   let path = "";
//   if (confDir === "") {
//     path = "$HOME/.minetest/minetest.conf";
//   } else {
//     path = confDir;
//   }
//   const testing = new Command(bash, [bashTrigger, `if [ -f ${path} ]; then echo true; else echo false; fi`]);
//   const exists = (await testing.execute()).stdout.trim();
//   if (exists === "false") {
//     // Blindly make the file with bash.
//     info("generating blank minetest.conf");
//     const execution = new Command(bash, [bashTrigger, `echo "" > ${path}`]);
//     await execution.execute();
//   }
//   // Why yes, I am file editing with nothing but bash.
//   const extract = new Command(bash, [bashTrigger, `cat ${path}`]);
//   let fileContents: string = (await extract.execute()).stdout.replace(/^\s*$(?:\r\n?|\n)/gm, "").trim();
//   for (const line of fileContents.split("\n")) {
//     // If the server admin messes with this, that's their problem.
//     if (line.replace(/\s/g, '').substring(0, 5) === "name=") {
//       // if we already have it we can stop here.
//       info("found god mode, skipping.");
//       return;
//     }
//   }
//   // info("god mode not found");
//   fileContents += "\nname = god";
//   const writeCommand = new Command(bash, [bashTrigger, `echo "${fileContents}" > ${path}`]);
//   await writeCommand.execute();
// }


/**
 * An easy way to start up the server through a function.
 * @returns A promise, of nothing. Yay!
 */
export async function startServer(): Promise<void> {
  info("starting");

  // await checkGodMode();

  // If it's already running, this can cause problems.


  if (command !== null || process !== null) {
    alert("Minetest server is already running!");
    return;
  }

  command = new Command(bash, [bashTrigger, args]);

  printf(bash, bashTrigger, args);

  command.stdout.addListener("data", (...args: any[]) => {
    for (const thing of args) {
      if (typeof thing === "string") {
        environmentTextAppend(thing.trim() /*+ "\n".slice(11)*/);
        info(thing);
      } else {
        info("wut");
      }
    }
    info("hmm");
  });
  command.stderr.addListener("data", (...args: any[]) => {
    for (const thing of args) {
      if (typeof thing === "string") {
        environmentTextAppend(thing /*+ "\n".slice(11)*/);
        info(thing);
      } else {
        info("wut");
      }
    }
    // info("hmmm");
  });

  process = await command.spawn();

  info(process.pid.toString());


  info("starting");
  environmentTextAppend("starting");

  // Auto move to environment tab.
  selectTab(Tabs[Tabs.environment]);
  Settings.setTab(Tabs.environment);
}

// //! attempt to get this thing to spawn the minetest executable
// let x: Command = new Command(command, args);
// let y = await x.spawn();
// info(y.pid.toString());




export function serverPayload(): void {

}