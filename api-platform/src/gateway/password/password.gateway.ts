import * as argon2 from "argon2";
import { IPasswordGateway } from "./password.gateway.interface";

export class PasswordGateway implements IPasswordGateway {
  async hash(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  }

  async compare(args: {
    OldPassword: string;
    inputOldPassword: string;
  }): Promise<boolean> {
    const { OldPassword, inputOldPassword } = args;
    const isMatch = await argon2.verify(OldPassword, inputOldPassword);
    return isMatch;
  }
}
