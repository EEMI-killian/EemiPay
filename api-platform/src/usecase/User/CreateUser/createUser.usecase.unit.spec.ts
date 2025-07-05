import { describe, expect, jest, test } from "@jest/globals";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { CreateUserUseCase, ICreateUserUseCasePresenter } from "./createUser.usecase";
import { User } from "../../../entity/User";
import { faker } from "@faker-js/faker";




describe("CreateUserUseCase", () => {
    let repository:  IUserRepository;
    let presenter : ICreateUserUseCasePresenter<
    unknown,
    unknown,
    unknown
  >;

    test("it should be return a succes with an id", async () =>{
        const mockUser: User = {
            id: faker.number.int({ min: 1, max: 1000 }),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            isActive: false,
            createdAt: new Date()
        };


        repository <IUserRepository> = {
            findByEmail: jest.fn<Promise<User | null>, [string]>()
            .mockResolvedValueOnce(null)  // First call returns null
            .mockResolvedValueOnce(mockUser),
    
    findById: jest.fn().mockResolvedValue(null),
    createUser: jest.fn().mockResolvedValue(mockUser),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    updateUserPassword: jest.fn().mockResolvedValue(undefined),
};
        
        presenter = {
            success: jest.fn(async (id: number) => id),
            alreadyExists: jest.fn(async () => "already exists"),
            error: jest.fn(async (error: string) => error)
        };

        let userData = {
            email : faker.internet.email(),
            firstName : faker.person.firstName(),
            lastName : faker.person.lastName(),
            password : faker.internet.password()
        }

        const uc = new CreateUserUseCase(repository,presenter).execute(userData)
        expect(await uc).toEqual(mockUser.id);
        expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(repository.createUser).toHaveBeenCalledWith({
            ...userData,
            password: expect.any(String), 
        });
        expect(presenter.success).toHaveBeenCalledWith(mockUser.id);

    })


    
    
})