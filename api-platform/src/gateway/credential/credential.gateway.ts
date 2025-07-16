import { v4 as uuidv4 } from "uuid";
import { Credential, ICredentialGateway } from "./credential.gateway.interface";

export class CredentialGateway implements ICredentialGateway {
  async generate(): Promise<Credential> {
    return { appId: "app_" + uuidv4(), appSecret: "secret_" + uuidv4() };
  }

  async rotate(appId: string): Promise<Credential> {
    return { appId, appSecret: "secret_" + uuidv4() };
  }
}
