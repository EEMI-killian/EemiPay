import { test, beforeEach, describe, expect, jest } from "@jest/globals";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ar, faker } from "@faker-js/faker";
import { CurrencyEnum } from "../../../entity/Merchant";
import {
  IUpdateMerchantUseCasePresenter,
  UpdateMerchantUseCase,
} from "./updateMercant.usecase";

describe("UpdateMerchantUseCase", () => {
  const mockedPresenter: IUpdateMerchantUseCasePresenter<
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

  test("it should update a merchant", async () => {
    const uc = new UpdateMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const updateArgs = {
      id: `merchant_${faker.string.uuid()}`,
      companyName: faker.company.name(),
    };

    mockedMerchantRepository.findById.mockResolvedValue({
      id: updateArgs.id,
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

    mockedMerchantRepository.update.mockResolvedValue();

    const result = await uc.execute(updateArgs);
    expect(result).toEqual({ success: true });
    expect(mockedMerchantRepository.update).toHaveBeenCalled();
  });

  test("it should not update a merchant", async () => {
    const uc = new UpdateMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const updateArgs = {
      id: `merchant_${faker.string.uuid()}`,
      companyName: faker.company.name(),
      redirectionUrlConfirm: faker.internet.url(),
    };

    mockedMerchantRepository.findById.mockResolvedValue(null);

    const result = await uc.execute(updateArgs);
    expect(result).toEqual({ error: "Merchant not found" });
  });
});
