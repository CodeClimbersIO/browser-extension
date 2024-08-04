import { exec as _exec } from "node:child_process";
import util from "node:util";

const exec = util.promisify(_exec);

const main = async () => {
  await Promise.all([
    exec("web-ext run -t chromium --source-dir dist"),
    exec("web-ext run -t firefox-desktop --source-dir dist --verbose"),
  ]);
};

main();
