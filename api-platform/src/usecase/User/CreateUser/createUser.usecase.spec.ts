import { CreateUserUseCase } from "./createUser.usecase";
import { UserRepository } from "../../../repository/User/user.repository";
import { AppDataSource } from "../../../data-source";
import { faker } from '@faker-js/faker';
import { describe, test, beforeAll, afterAll, expect } from '@jest/globals';




describe("CreateUserUseCase", () => {
    let userRepo: UserRepository;

    beforeAll(async () => {
        try {
            await AppDataSource.initialize();
            console.log("Data Source has been initialized!");
            userRepo = new UserRepository(AppDataSource.getRepository("User"));
        } catch (err) {
            console.error("Error during Data Source initialization", err);
            throw err;
        }
    });

    afterAll(async () => {
        try {
            await AppDataSource.destroy();
            console.log("Data Source has been destroyed!");
        } catch (err) {
            console.error("Error during Data Source destruction", err);
        }
    });
    
    test("should create a user with valid input", async () => {
        
        const uc = new CreateUserUseCase(userRepo);
        const userData = {
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: faker.internet.password({length: 8}),
        };
        console.log("User data to create:", userData);
        await uc.execute(userData);
        const userFromDb = await userRepo.findByEmail(userData.email);
        console.log("User created successfully:", userFromDb);
        expect(userFromDb).toBeDefined();
        console.log("User from DB:", userFromDb);
        expect(userFromDb.email).toBe(userData.email);
                
    });
})
