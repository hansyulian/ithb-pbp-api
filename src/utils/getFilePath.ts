import path from "path";
import { appConfig } from "~/config";

export function getFilePath(fileName: string) {
  return path.join(appConfig.app.fileStoragePath, fileName);
}
