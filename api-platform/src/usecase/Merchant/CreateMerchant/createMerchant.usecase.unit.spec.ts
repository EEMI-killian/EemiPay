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
import { UuidGateway } from "../../../gateway/uuid/uuid.gateway";
import { UserRole } from "../../../entity/User";

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
      return { error };
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

  const mockedUuidGateway: jest.Mocked<UuidGateway> = {
    generate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should create a merchant", async () => {
    const uc = new CreateMerchantUseCase(
      mockedMerchantRepository,
      mockedUserRepository,
      mockedKbisRepository,
      mockedUuidGateway,
      mockedPresenter,
    );
    const userId = `user_${faker.string.uuid()}`;
    mockedUserRepository.findById.mockResolvedValue({
      id: userId,
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: faker.date.past(),
      isActive: true,
      roles: UserRole.ROLE_USER,
    });
    mockedMerchantRepository.findByCompanyName.mockResolvedValue(null);
    mockedMerchantRepository.create.mockResolvedValue();
    const result = await uc.execute({
      userId: userId,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
      iban: faker.finance.iban(),
    });
    expect(result).toEqual({ success: true });
    expect(mockedMerchantRepository.create).toHaveBeenCalled();
  });

  test("it should create not create a merchant not found", async () => {
    const uc = new CreateMerchantUseCase(
      mockedMerchantRepository,
      mockedUserRepository,
      mockedKbisRepository,
      mockedUuidGateway,
      mockedPresenter,
    );
    mockedUserRepository.findById.mockResolvedValue(null);
    const userId = `user_${faker.string.uuid()}`;
    const result = await uc.execute({
      userId: userId,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
      iban: faker.finance.iban(),
    });
    expect(result).toEqual({ error: "User not found" });
    expect(mockedMerchantRepository.create).not.toHaveBeenCalled();
  });
  test("it should not create a merchant company already exist", async () => {
    const uc = new CreateMerchantUseCase(
      mockedMerchantRepository,
      mockedUserRepository,
      mockedKbisRepository,
      mockedUuidGateway,
      mockedPresenter,
    );
    mockedUserRepository.findById.mockResolvedValue({
      id: `user_${faker.string.uuid()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: faker.date.past(),
      isActive: true,
      roles: UserRole.ROLE_USER,
    });
    mockedMerchantRepository.findByCompanyName.mockResolvedValue({
      id: `merchant_${faker.string.uuid()}`,
      userId: `user_${faker.string.uuid()}`,
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
      iban: faker.finance.iban(),
    });
    const result = await uc.execute({
      userId: `user_1`,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
      redirectionUrlCancel: faker.internet.url(),
      currency: CurrencyEnum.EUR,
      kbisUrl: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
      iban: faker.finance.iban(),
    });
    expect(result).toEqual({ error: "Merchant already exists" });
    expect(mockedMerchantRepository.create).not.toHaveBeenCalled();
  });
});
