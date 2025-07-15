import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  DeleteMerchantUseCase,
  IDeleteMerchantPresenter,
} from "./deleteMerchant.usecase";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { CurrencyEnum } from "../../../entity/Merchant";

describe("DeleteMerchantUseCase", () => {
  const mockedPresenter: IDeleteMerchantPresenter<
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

  test("it should delete a merchant", async () => {
    const uc = new DeleteMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const merchantId = faker.number.int({ min: 1 });
    mockedMerchantRepository.findById.mockResolvedValue({
      id: merchantId,
      companyName: faker.company.name(),
      currency: CurrencyEnum.EUR,
      userId: faker.number.int({ min: 1 }),
      redirectionUrlCancel: faker.internet.url(),
      redirectionUrlConfirm: faker.internet.url(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
      createdAt: new Date(),
      kbisUrl: faker.internet.url(),
    });
    mockedMerchantRepository.delete.mockResolvedValue();
    const result = await uc.execute({ id: merchantId });
    expect(result).toEqual({ success: true });
    expect(mockedMerchantRepository.delete).toHaveBeenCalledWith(merchantId);
  });
  test("it should not delete a merchant notFound", async () => {
    const uc = new DeleteMerchantUseCase(
      mockedMerchantRepository,
      mockedPresenter,
    );
    const merchantId = faker.number.int({ min: 1 });
    mockedMerchantRepository.findById.mockResolvedValue(null);
    const result = await uc.execute({ id: merchantId });
    expect(result).toEqual({ error: "Merchant not found" });
    expect(mockedMerchantRepository.delete).not.toHaveBeenCalledWith(
      merchantId,
    );
  });
});
