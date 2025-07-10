import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  DeleteUserUseCase,
  IDeleteUserUseCasePresenter,
} from "./deleteUser.usecase";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { faker } from "@faker-js/faker";

describe("DeleteUserUseCase", () => {
  const mockedPresenter: IDeleteUserUseCasePresenter<
    unknown,
    unknown,
    unknown
  > = {
    success: async () => {
      return { success: true };
    },
    error: async (error: string) => {
      return { error };
    },
    notFound: async () => {
      return { error: "user not found" };
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
    mockedUserRepository.findById.mockResolvedValue({
      id: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: false,
      createdAt: faker.date.past(),
    });
    mockedUserRepository.delete.mockResolvedValue(null);
    const uc = new DeleteUserUseCase(mockedUserRepository, mockedPresenter);
    const response = await uc.execute({ id: 1 });
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.delete).toHaveBeenCalled();
    expect(response).toEqual({ success: true });
  });
  test("it should be return an user has not found", async () => {
    mockedUserRepository.findById.mockResolvedValue(null);
    const uc = new DeleteUserUseCase(mockedUserRepository, mockedPresenter);
    const response = await uc.execute({ id: 2 });
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.delete).not.toHaveBeenCalled();
    expect(response).toEqual({ error: "user not found" });
  });
});
