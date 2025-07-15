import {
  CreateMerchantUseCase,
  ICreateMerchantUseCasePresenter,
} from "./createMerchant.usecase";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { faker } from "@faker-js/faker";
import { CurrencyEnum } from "../../../entity/Merchant";
import { IKbisRepository } from "../../../repository/Kbis/KbisRepository.interface";

describe("CreateMerchantUseCase", () => {
  const mockedPresenter: ICreateMerchantUseCasePresenter<
    unknown,
    unknown,
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
    alreadyExists: async () => {
      return { error: "Merchant already exists" };
    },
    invalidArguments: async (error: string) => {
      return { error: "Invalid arguments" };
    },
    notFound: async () => {
      return { error: "User not found" };
    },
  };
  const mockedMerchantRepository: jest.Mocked<IMerchantRepository> = {
    findById: jest.fn(),
    findByCompanyName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
  };
  const mockedUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockedKbisRepository: jest.Mocked<IKbisRepository> = {
    upload: jest.fn(),
    download: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should create a merchant", async () => {
    const uc = new CreateMerchantUseCase(
      mockedMerchantRepository,
      mockedUserRepository,
      mockedKbisRepository,
      mockedPresenter,
    );
    mockedUserRepository.findById.mockResolvedValue({
      id: 1,
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: faker.date.past(),
      isActive: true,
    });
    mockedMerchantRepository.findByCompanyName.mockResolvedValue(null);
    mockedMerchantRepository.create.mockResolvedValue();
    const result = await uc.execute({
      userId: 1,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
    });
    expect(result).toEqual({ success: true });
    expect(mockedMerchantRepository.create).toHaveBeenCalled();
  });

  test("it should create not create a merchant not found", async () => {
    const uc = new CreateMerchantUseCase(
      mockedMerchantRepository,
      mockedUserRepository,
      mockedKbisRepository,
      mockedPresenter,
    );
    mockedUserRepository.findById.mockResolvedValue(null);
    const result = await uc.execute({
      userId: 1,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
    });
    expect(result).toEqual({ error: "User not found" });
    expect(mockedMerchantRepository.create).not.toHaveBeenCalled();
  });
  test("it should create not create a merchant company already exist", async () => {
    const uc = new CreateMerchantUseCase(
      mockedMerchantRepository,
      mockedUserRepository,
      mockedKbisRepository,
      mockedPresenter,
    );
    mockedUserRepository.findById.mockResolvedValue({
      id: 2,
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: faker.date.past(),
      isActive: true,
    });
    mockedMerchantRepository.findByCompanyName.mockResolvedValue({
      id: 1,
      userId: 2,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      createdAt: faker.date.past(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
    });
    const result = await uc.execute({
      userId: 1,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
    });
    expect(result).toEqual({ error: "Merchant already exists" });
    expect(mockedMerchantRepository.create).not.toHaveBeenCalled();
  });
});
