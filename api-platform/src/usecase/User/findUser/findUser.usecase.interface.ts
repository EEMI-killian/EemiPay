import { User } from "../../../entity/User";

export interface IFindUserUseCase {
    execute(args: findUserArgs): Promise<User | null>;
}

export type findUserArgs = {
    id: number;
}