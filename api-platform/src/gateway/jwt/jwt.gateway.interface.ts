import { UserRole } from "../../entity/User";



export interface IJwtGateway {
    sign(role: UserRole, userId: string): Promise<string>;
    verify(token: string): Promise<any | null>;
}