import { Child, Command } from "@tauri-apps/api/shell";
import { environmentTextAppend, printf, selectTab, Settings, Tabs } from ".";
import { info } from "tauri-plugin-log-api";
import { fs } from "@tauri-apps/api";

const bash: string = "bash";

const evaluate: string = "eval";

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
  info(args);
}

/**
 * Checks if the minetest.conf has a name = god in it.
 */
async function checkGodMode(): Promise<void> {
  info("ye");
  const confDir = Settings.getConf();
  let path = "";
  if (confDir === "") {
    path = "$HOME/.minetest/minetest.conf";
  } else {
    path = confDir;
  }
  info("uh oh");

  info(`if [ -f ${path} ]; then echo true; else echo false; fi`);

  let testing = new Command(bash, [bashTrigger, `if [ -f ${path} ]; then echo true; else echo false; fi`]);
  let exists = (await testing.execute()).stdout.trim();

  if (exists === "true") {
    info("noice");
  } else {
    info("IT AIN'T THERE!");
  }


  info("hi");
}


/**
 * An easy way to start up the server through a function.
 * @returns A promise, of nothing. Yay!
 */
export async function startServer(): Promise<void> {
  info("starting");

  await checkGodMode();

  // If it's already running, this can cause problems.

  if (true) {
    return;
  }

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
      } else {
        info("wut");
      }
    }
    info("hmmm");
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