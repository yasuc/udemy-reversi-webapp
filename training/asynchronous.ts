import fs from "fs";
import util from "util";

const promisifyReadFile = util.promisify(fs.readFile);

async function main() {
  const data = await promisifyReadFile("package.json");
  const fileContent = data.toString();
  console.log(fileContent);
}

main();
