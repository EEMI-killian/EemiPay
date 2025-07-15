import { IKbisRepository } from "./KbisRepository.interface";
import * as fs from "fs";

export class KbisRepository implements IKbisRepository {
  constructor() {
    if (!fs.existsSync("kbis")) {
      fs.mkdirSync("kbis", { recursive: true });
    }
  }

  async upload(path: string): Promise<void> {
    const fileName = path.split("/").pop();
    const destinationDir = "kbis";
    const destinationPath = `${destinationDir}/${fileName}`;
    fs.copyFileSync(path, destinationPath);
  }

  async download(path: string): Promise<void | string> {
    const fileName = path.split("/").pop();
    const sourcePath = `kbis/${fileName}`;
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path);
      console.log(`File downloaded to ${path}`);
    } else {
      return `File not found: ${sourcePath}`;
    }
  }
}
