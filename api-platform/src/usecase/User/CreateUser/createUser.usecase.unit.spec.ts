import { IUserRepository } from "../../../repository/User/user.repository.interface"
import { CreateUserUseCase, ICreateUserUseCasePresenter } from "./createUser.usecase"
import {beforeAll, beforeEach, describe, expect, jest, test} from '@jest/globals';
import { faker } from "@faker-js/faker"
import { clear } from "console";




describe("CreateUserUseCase", () => {
    const mockedPresenter : ICreateUserUseCasePresenter<unknown,unknown,unknown> = {
        success : async (id : number) => {
            return { succes : true , id}
        },
        error : async (error : string) => {
            return { error }
        },
        alreadyExists : async () => {
            return { error : 'User already exist' }
        } 
    }
    const mockUserRepository: jest.Mocked<IUserRepository> = {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        createUser: jest.fn(),
        deleteUser: jest.fn(),
        updateUserPassword: jest.fn(),
    };
    const userData = {
        firstName : faker.person.firstName(),
        lastName : faker.person.lastName(),
        email : faker.internet.email(),
        password : faker.internet.password()
    }
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("it should be create a User", async () =>{
        mockUserRepository.findByEmail.mockResolvedValueOnce(null)
        mockUserRepository.findByEmail.mockResolvedValueOnce(
            {
                id: 1,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                isActive: false,
                createdAt: new Date(),
            }
        )  
        const uc = new CreateUserUseCase(mockUserRepository,mockedPresenter)
        const response = await uc.execute(userData)
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(2)
        expect(response).toEqual({ succes: true, id: 1 })

    })

    test("it should be return an error about a user who already exist", async () =>{
        mockUserRepository.findByEmail.mockResolvedValueOnce(  {
            id: 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            isActive: false,
            createdAt: new Date(),
        })
        const uc = new CreateUserUseCase(mockUserRepository,mockedPresenter)
        const response = await uc.execute(userData)
        expect(mockUserRepository.findByEmail).toHaveBeenCalled()
        expect(mockUserRepository.createUser).not.toHaveBeenCalled()
        expect(response).toEqual({ error: 'User already exist' })

    })
})