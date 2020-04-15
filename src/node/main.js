import path from "path";
import fs from "fs";
const { exec } = require("child_process");

const cssString = fs.readFileSync(path.join(__dirname, "./style.css"), "utf8");
const jsString = fs.readFileSync(path.join(__dirname, "./pluginmain.js"), "utf8");

function render(statsFile) {
  const stringifiedStats = fs
    .readFileSync(statsFile)
    .toString()
    .replace(/</g, "&lt;")
    .replace(/</g, "&gt;");

  const html = `<!doctype html>
                <meta charset="UTF-8">
                <title>Webpack Visualizer</title>
                <style>${cssString}</style>
                <div id="App"></div>
                <script>window.stats = ${stringifiedStats};</script>
                <script>${jsString}</script>
            `;

  return html;
}

function save(html, outputFile) {
  fs.writeFileSync(outputFile, html);
}

function parseArgs() {
  const opts = { statsFile: null, outputFile: null, open: false, help: false };
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--stats") {
      opts.statsFile = args[i + 1];
    }
    if (arg === "--out") {
      opts.outputFile = args[i + 1];
    }
    if (arg === "--help") {
      opts.help = true;
    }
    if (arg === "--open") {
      opts.open = true;
    }
  }
  return opts;
}

const args = parseArgs();

if (args.help) {
  console.log(
    "Utility to render webpack stats, see https://chrisbateman.github.io/webpack-visualizer/"
  );
  console.log("--stats stats-file");
  console.log("--out output-file (html file)");
  console.log("--open open in browser");
  process.exit(0);
}

if (!args.outputFile) {
  console.error("--out output file missing");
  process.exit(1);
}

if (!args.statsFile) {
  console.error("--stats stats file missing");
  process.exit(1);
}

const html = render(args.statsFile);
save(html, args.outputFile);

if (args.open) {
  exec(`open ${args.outputFile}`);
}
