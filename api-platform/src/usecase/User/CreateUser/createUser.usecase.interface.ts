export interface ICreateUserUseCase {
    execute(args: ICreateUserArgs ): Promise<void>;
}

export type ICreateUserArgs = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}