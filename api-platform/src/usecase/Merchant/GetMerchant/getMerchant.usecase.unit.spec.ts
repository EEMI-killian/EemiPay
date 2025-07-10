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
    mockedMerchantRepository.findById.mockResolvedValue({
      id: 1,
      companyName: faker.company.name(),
      userId: 1,
      redirectionUrlCancel: faker.internet.url(),
      redirectionUrlConfirm: faker.internet.url(),
      contacts: [],
      currency: CurrencyEnum.GBP,
      createdAt: faker.date.past(),
      kbisUrl: faker.internet.url(),
    });
    const uc = new GetMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const result = await uc.execute({
      id: 1,
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
      id: 1,
    });
    expect(result).toEqual({ error: "Merchant not found" });
    expect(mockedMerchantRepository.findById).toHaveBeenCalled();
  });
});
