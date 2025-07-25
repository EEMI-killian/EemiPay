import { test, beforeEach, describe, expect, jest } from "@jest/globals";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import {
  GetAllMerchantUseCase,
  IGetAllMerchantUseCasePresenter,
} from "./getAllMerchant.usecase";
import { faker } from "@faker-js/faker";
import { CurrencyEnum, Merchant } from "../../../entity/Merchant";

describe("GetAllMerchantUseCase", () => {
  const mockedPresenter: IGetAllMerchantUseCasePresenter<
    unknown,
    unknown,
    unknown
  > = {
    success: async (data: Merchant[]) => {
      return { success: true, result: data || [] };
    },
    invalidArguments: async () => {
      return { error: "Invalid arguments" };
    },
    functionalError: async () => {
      return { error: "Functional error occurred" };
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should get all merchant", async () => {
    const datafixtures = [
      {
        id: `merchant_${faker.string.uuid()}§`,
        companyName: faker.company.name(),
        userId: `user_${faker.string.uuid()}`,
        redirectionUrlCancel: faker.internet.url(),
        redirectionUrlConfirm: faker.internet.url(),
        contactEmail: faker.internet.email(),
        contactPhone: faker.phone.number(),
        contactFirstName: faker.person.firstName(),
        contactLastName: faker.person.lastName(),
        currency: CurrencyEnum.GBP,
        createdAt: faker.date.past(),
        kbisUrl: faker.internet.url(),
        iban: faker.finance.iban(),
      },
      {
        id: `merchant_${faker.string.uuid()}`,
        companyName: faker.company.name(),
        userId: `user_${faker.string.uuid()}`,
        redirectionUrlCancel: faker.internet.url(),
        redirectionUrlConfirm: faker.internet.url(),
        contactEmail: faker.internet.email(),
        contactPhone: faker.phone.number(),
        contactFirstName: faker.person.firstName(),
        contactLastName: faker.person.lastName(),
        currency: CurrencyEnum.EUR,
        createdAt: faker.date.past(),
        kbisUrl: faker.internet.url(),
        iban: faker.finance.iban(),
      },
    ];
    mockedMerchantRepository.getAll.mockResolvedValue(datafixtures);
    const uc = new GetAllMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const result = await uc.execute();
    expect(result).toEqual({ success: true, result: datafixtures });
    expect(mockedMerchantRepository.getAll).toHaveBeenCalled();
  });

  test("it should return empty cause i have no merchant", async () => {
    mockedMerchantRepository.getAll.mockResolvedValue([]);
    const uc = new GetAllMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const result = await uc.execute();
    expect(result).toEqual({ success: true, result: [] });
    expect(mockedMerchantRepository.getAll).toHaveBeenCalled();
  });
});
