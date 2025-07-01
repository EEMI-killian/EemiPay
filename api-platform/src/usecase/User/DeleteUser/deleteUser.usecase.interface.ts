export interface IDeleteUserUseCase {
    execute(args: deleteUserArgs): Promise<void>;
}

export type deleteUserArgs = {
    id: number;
}