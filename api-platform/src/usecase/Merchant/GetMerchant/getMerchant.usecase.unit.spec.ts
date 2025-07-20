import { test, beforeEach, describe, expect, jest } from "@jest/globals";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import {
  GetMerchantUseCase,
  IGetMerchantUseCasePresenter,
} from "./getMerchant.usecase";
import { faker } from "@faker-js/faker";
import { CurrencyEnum } from "../../../entity/Merchant";

describe("GetMerchantUseCase", () => {
  const mockedPresenter: IGetMerchantUseCasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async () => {
      return { success: true };
    },
    notFound: async () => {
      return { error: "Merchant not found" };
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

  test("it should get a merchant by id", async () => {
    const merchantId = `merchant_${faker.string.uuid()}`;
    mockedMerchantRepository.findById.mockResolvedValue({
      id: merchantId,
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
    });
    const uc = new GetMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const result = await uc.execute({
      id: merchantId,
    });
    expect(result).toEqual({ success: true });
    expect(mockedMerchantRepository.findById).toHaveBeenCalled();
  });
  test("it should not get a merchant by id cause it's not found", async () => {
    mockedMerchantRepository.findById.mockResolvedValue(null);
    const uc = new GetMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const result = await uc.execute({
      id: `merchant_${faker.string.uuid()}`,
    });
    expect(result).toEqual({ error: "Merchant not found" });
    expect(mockedMerchantRepository.findById).toHaveBeenCalled();
  });
});
