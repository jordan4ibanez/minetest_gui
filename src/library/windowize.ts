import { Monitor, PhysicalSize, WebviewWindow } from "@tauri-apps/api/window";
import { window } from "@tauri-apps/api";
import { error } from "tauri-plugin-log-api";

/**
 * Automatically makes the window half the size of the main monitor
 * then centers it on startup.
 */
export async function fancyWindow(): Promise<void> {
  // Automatically open the window half the size of the main monitor.
  // Then center it.
  // Scoped for automatic memory freeing.

  const monitor: Monitor | null = await window.currentMonitor();

  if (monitor == null) {
    error("Failed to grab current monitor");
    throw new Error("Failed to grab current monitor");
  }

  const width = monitor.size.width / 2;
  const height = monitor.size.height / 2;

  const currentWindow: WebviewWindow = window.getCurrent();

  await currentWindow.setSize(new PhysicalSize(width, height));
  await currentWindow.center();

}