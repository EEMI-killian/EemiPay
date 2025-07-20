import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IDeleteCredentialUsecase } from "./deleteCredential.usecase.interface";
import {
  DeleteCredentialUseCase,
  IDeleteCredentialUsecasePresenter,
} from "./deleteCredential.usecase";
import { ICredentialRepository } from "../../../repository/Credential/CredentialRepository.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { faker } from "@faker-js/faker";
import { CurrencyEnum } from "../../../entity/Merchant";

describe("DeleteCredentialUsecase", () => {
  const mockedPresenter: IDeleteCredentialUsecasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async () => {
      return { success: true };
    },
    functionalError: async (error) => {
      return { error };
    },
    notFound: async () => {
      return { error: "Not found" };
    },
    invalidArguments: async (error) => {
      return { error };
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
  const mockedCredentialRepository: jest.Mocked<ICredentialRepository> = {
    save: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByMerchantId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should delete a credential", async () => {
    const uc = new DeleteCredentialUseCase(
      mockedMerchantRepository,
      mockedCredentialRepository,
      mockedPresenter,
    );
    const args = {
      appId: `app-${faker.string.uuid()}`,
      merchantId: `merchant-${faker.string.uuid()}`,
    };
    mockedMerchantRepository.findById.mockResolvedValue({
      id: args.merchantId,
      createdAt: faker.date.past(),
      companyName: faker.company.name(),
      currency: CurrencyEnum.USD,
      contactEmail: faker.internet.email(),
      kbisUrl: faker.internet.url(),
      userId: `user-${faker.string.uuid()}`,
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
      contactPhone: faker.phone.number(),
      redirectionUrlCancel: faker.internet.url(),
      redirectionUrlConfirm: faker.internet.url(),
      iban: faker.finance.iban(),
    });
    mockedCredentialRepository.findById.mockResolvedValue({
      id: args.appId,
      appSecret: faker.string.uuid(),
      merchantId: args.merchantId,
      createdAt: faker.date.past(),
    });
    mockedCredentialRepository.delete.mockResolvedValue(null);
    const response = await uc.execute({
      appId: args.appId,
      merchantId: args.merchantId,
    });
    expect(mockedMerchantRepository.findById).toHaveBeenCalled();
    expect(mockedCredentialRepository.findById).toHaveBeenCalled();
    expect(mockedCredentialRepository.delete).toHaveBeenCalledWith(args.appId);
    expect(response).toEqual({ success: true });
  });

  test("it should not delete a credential if it does not exist", async () => {
    const uc = new DeleteCredentialUseCase(
      mockedMerchantRepository,
      mockedCredentialRepository,
      mockedPresenter,
    );
    const args = {
      appId: `app-${faker.string.uuid()}`,
      merchantId: `merchant-${faker.string.uuid()}`,
    };
    mockedMerchantRepository.findById.mockResolvedValue(null);
    const response = await uc.execute({
      appId: args.appId,
      merchantId: args.merchantId,
    });
    expect(mockedMerchantRepository.findById).toHaveBeenCalled();
    expect(mockedCredentialRepository.findById).not.toHaveBeenCalled();
    expect(response).toEqual({ error: "Not found" });
  });
});
