import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  IRotateCredentialUsecasePresenter,
  RotateCredentialUsecase,
} from "./rotateCredential.usecase";
import { ICredentialGateway } from "../../../gateway/credential/credential.gateway.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";
import { ICredentialRepository } from "../../../repository/Credential/CredentialRepository.interface";
import { faker } from "@faker-js/faker";
import { CurrencyEnum } from "../../../entity/Merchant";

describe("RotateCredentialUsecase", () => {
  const mockedPresenter: IRotateCredentialUsecasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async (credential) => {
      return { credential };
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

  const mockedCredentialGateway: jest.Mocked<ICredentialGateway> = {
    rotate: jest.fn(),
    generate: jest.fn(),
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
    findById: jest.fn(),
    findByMerchantId: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  const mockedHashGateway: jest.Mocked<IHashGateway> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should rotate a credential", async () => {
    const args = {
      merchantId: `merchant-${faker.string.uuid()}`,
      appId: `app-${faker.string.uuid()}`,
    };
    mockedMerchantRepository.findById.mockResolvedValueOnce({
      id: args.merchantId,
      userId: `user-${faker.string.uuid()}`,
      kbisUrl: faker.internet.url(),
      companyName: faker.company.name(),
      contactEmail: faker.internet.email(),
      contactFirstName: faker.person.firstName(),
      contactLastName: faker.person.lastName(),
      contactPhone: faker.phone.number(),
      currency: CurrencyEnum.USD,
      redirectionUrlCancel: faker.internet.url(),
      redirectionUrlConfirm: faker.internet.url(),
      createdAt: faker.date.past(),
    });
    mockedCredentialGateway.rotate.mockResolvedValue({
      appId: args.appId,
      appSecret: "secret-aaa",
    });
    mockedHashGateway.hash.mockResolvedValue(
      `hashed-secret-${faker.string.uuid()}`,
    );
    mockedCredentialRepository.update.mockResolvedValue();
    const uc = new RotateCredentialUsecase(
      mockedCredentialGateway,
      mockedPresenter,
      mockedMerchantRepository,
      mockedCredentialRepository,
      mockedHashGateway,
    );
    const result = await uc.execute(args);
    expect(mockedCredentialGateway.rotate).toHaveBeenCalled();
    expect(mockedHashGateway.hash).toHaveBeenCalled();
    expect(mockedCredentialRepository.update).toHaveBeenCalled();
    expect(result).toEqual({
      credential: {
        appId: args.appId,
        appSecret: "secret-aaa",
      },
    });
  });

  test("it should not rotate a credential", async () => {
    mockedMerchantRepository.findById.mockResolvedValue(null);
    const uc = new RotateCredentialUsecase(
      mockedCredentialGateway,
      mockedPresenter,
      mockedMerchantRepository,
      mockedCredentialRepository,
      mockedHashGateway,
    );
    const result = await uc.execute({
      merchantId: "merchant-id",
      appId: "app-id",
    });
    expect(mockedCredentialGateway.rotate).not.toHaveBeenCalled();
    expect(mockedHashGateway.hash).not.toHaveBeenCalled();
    expect(result).toEqual({ error: "Not found" });
  });
});
