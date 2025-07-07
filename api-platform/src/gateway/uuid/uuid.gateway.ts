import { IUuidGateway } from "./uuid.gateway.interface";
import { v4 as uuidv4 } from "uuid";

export class UuidGateway implements IUuidGateway {
  async generate(prefix: string): Promise<string> {
    const uuid = `${prefix}-${uuidv4()}`;
    return uuid;
  }
}
