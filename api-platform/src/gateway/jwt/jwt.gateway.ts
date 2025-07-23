import { UserRole } from "../../entity/User";
import { sign, verify } from "jsonwebtoken";
import { IJwtGateway } from "./jwt.gateway.interface";

export class JwtGateway implements IJwtGateway {
  constructor(private JWT_SECRET: string) {}

  async sign(role: UserRole, userId: string): Promise<string> {
    const token = sign({ role }, this.JWT_SECRET, {
      subject: userId,
      expiresIn: "1h",
    });
    return token;
  }

  async verify(token: string): Promise<any | null> {
    try {
      const payload = verify(token, this.JWT_SECRET);
      console.log(payload);
      return payload;
    } catch (error) {
      return null;
    }
  }
}
