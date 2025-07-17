import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { faker } from "@faker-js/faker";
import {
  DeleteUserUseCase,
  IDeleteUserUseCasePresenter,
} from "./deleteUser.usecase";

describe("DeleteUserUseCase", () => {
  const mockedPresenter: IDeleteUserUseCasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async () => {
      return { success: true };
    },
    functionalError: async (error: string) => {
      return { error };
    },
    notFound: async () => {
      return { error: "user not found" };
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
  test("it should delete a User", async () => {
    const userId = `user_${faker.string.uuid()}`;
    mockedUserRepository.findById.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: false,
      createdAt: faker.date.past(),
    });
    mockedUserRepository.delete.mockResolvedValue(null);
    const uc = new DeleteUserUseCase(mockedUserRepository, mockedPresenter);
    const response = await uc.execute({ id: userId });
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.delete).toHaveBeenCalled();
    expect(response).toEqual({ success: true });
  });
  test("it should be return an user has not found", async () => {
    mockedUserRepository.findById.mockResolvedValue(null);
    const uc = new DeleteUserUseCase(mockedUserRepository, mockedPresenter);
    const response = await uc.execute({ id: `user_${faker.string.uuid()}` });
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.delete).not.toHaveBeenCalled();
    expect(response).toEqual({ error: "user not found" });
  });
});
