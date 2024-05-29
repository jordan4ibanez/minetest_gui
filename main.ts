import { Webview } from "@webview/webview";

export const print = console.log;

const html = `
  <html>
  <body>
    <h1>Hello from deno v${Deno.version.deno}</h1>
    <marquee>hi</marquee>
  </body>
  </html>
`;



if (import.meta.main) {
  const webview = new Webview();
  webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
  webview.run();
}



