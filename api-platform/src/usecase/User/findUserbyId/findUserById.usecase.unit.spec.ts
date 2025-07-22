import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { faker } from "@faker-js/faker";
import {
  FindUserByIdUseCase,
  IFindUserByIdUseCasePresenter,
} from "./findUserById.usecase";
import { UserRole } from "../../../entity/User";

describe("FindUserByIdUseCase", () => {
  const mockedPresenter: IFindUserByIdUseCasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async () => {
      return { success: true };
    },
    notFound: async () => {
      return { error: "user not found" };
    },
    functionalError: async (error: string) => {
      return { error };
    },
    invalidArguments: async (error: string) => {
      return { error };
    },
  };

  const mockedUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("it should find a User", async () => {
    const userId = `user_${faker.string.uuid()}`;
    mockedUserRepository.findById.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: false,
      createdAt: faker.date.past(),
      roles: UserRole.ROLE_USER,
    });
    const uc = new FindUserByIdUseCase(mockedUserRepository, mockedPresenter);
    const response = await uc.execute({ id: userId });
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(response).toEqual({ success: true });
  });
  test("it should not found a User", async () => {
    mockedUserRepository.findById.mockResolvedValue(null);
    const uc = new FindUserByIdUseCase(mockedUserRepository, mockedPresenter);
    const response = await uc.execute({ id: `user_${faker.string.uuid()}` });
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(response).toEqual({ error: "user not found" });
  });
});
