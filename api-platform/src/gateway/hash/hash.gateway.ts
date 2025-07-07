import * as argon2 from "argon2";
import { IHashGateway } from "./hash.gateway.interface";

export class HashGateway implements IHashGateway {
  async hash(things: string): Promise<string> {
    const hashedString = await argon2.hash(things);
    return hashedString;
  }

  async compare(args: {
    stringAlreadyHashed: string;
    input: string;
  }): Promise<boolean> {
    const { stringAlreadyHashed, input } = args;
    const isMatch = await argon2.verify(stringAlreadyHashed, input);
    return isMatch;
  }
}
