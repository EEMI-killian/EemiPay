import { IUserRepository } from "../../../repository/User/user.repository.interface"
import { CreateUserUseCase, ICreateUserUseCasePresenter } from "./createUser.usecase"
import { beforeEach, describe, expect, jest, test} from '@jest/globals';
import { faker } from "@faker-js/faker"




describe("CreateUserUseCase", () => {
    const mockedPresenter : ICreateUserUseCasePresenter<unknown,unknown,unknown,unknown> = {
        success : async (id : number) => {
            return { success : true , id}
        },
        error : async (error : string) => {
            return { error }
        },
        alreadyExists : async () => {
            return { error : 'User already exist' }
        }, 
        invalidArguments :  async () => {
            return { error : 'Invalid arguments'}
        }
    }
    const mockedUserRepository: jest.Mocked<IUserRepository> = {
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

    test("it should create a user", async () =>{
        mockedUserRepository.findByEmail.mockResolvedValueOnce(null)
        mockedUserRepository.findByEmail.mockResolvedValueOnce(
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
        const uc = new CreateUserUseCase(mockedUserRepository,mockedPresenter)
        const response = await uc.execute(userData)
        expect(mockedUserRepository.createUser).toHaveBeenCalled()
        expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(2)
        expect(response).toEqual({ success: true, id: 1 })

    })

    test("it should be return an error about a user who already exist", async () =>{
        mockedUserRepository.findByEmail.mockResolvedValueOnce(  {
            id: 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            isActive: false,
            createdAt: new Date(),
        })
        const uc = new CreateUserUseCase(mockedUserRepository,mockedPresenter)
        const response = await uc.execute(userData)
        expect(mockedUserRepository.findByEmail).toHaveBeenCalled()
        expect(mockedUserRepository.createUser).not.toHaveBeenCalled()
        expect(response).toEqual({ error: 'User already exist' })

    })
    test("it should be return an error about invalid arguments", async () =>{
        const userDataWrong = {
            firstName: 's',
            lastName: 'l',
            email: "fake email",
            password: "1",
        }
        const uc = new CreateUserUseCase(mockedUserRepository,mockedPresenter)
        const response = await uc.execute(userDataWrong)
        expect(mockedUserRepository.findByEmail).not.toHaveBeenCalled()
        expect(mockedUserRepository.createUser).not.toHaveBeenCalled()
        expect(response).toEqual({ error : 'Invalid arguments'})

    })
})