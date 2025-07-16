import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  GenerateCredentialUsecase,
  IGenerateCredentialUsecasePresenter,
} from "./generateCredential.usecase";

import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";
import { ICredentialRepository } from "../../../repository/Credential/CredentialRepository.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { faker } from "@faker-js/faker";
import { CurrencyEnum } from "../../../entity/Merchant";
import { ICredentialGateway } from "../../../gateway/credential/credential.gateway.interface";

describe("GenerateCredentialUsecase", () => {
  const mockedCredentialGateway: jest.Mocked<ICredentialGateway> = {
    generate: jest.fn(),
    rotate: jest.fn(),
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
  const mockedHashGateway: jest.Mocked<IHashGateway> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockedPresenter: IGenerateCredentialUsecasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async (credential) => {
      return { credential };
    },
    error: async (error) => {
      return { error };
    },
    notFound: async () => {
      return { error: "Not found" };
    },
    invalidArguments: async (error) => {
      return { error };
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should generate a credential", async () => {
    const uc = new GenerateCredentialUsecase(
      mockedCredentialGateway,
      mockedPresenter,
      mockedMerchantRepository,
      mockedCredentialRepository,
      mockedHashGateway,
    );
    const merchantId = `merchant-${faker.string.uuid()}`;
    mockedMerchantRepository.findById.mockResolvedValue({
      id: merchantId,
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
    mockedHashGateway.hash.mockResolvedValue("hashedSecret");
    mockedCredentialGateway.generate.mockResolvedValue({
      appId: `app-123`,
      appSecret: `secret-123`,
    });
    const response = await uc.execute({
      merchantId: merchantId,
    });
    expect(mockedCredentialGateway.generate).toHaveBeenCalled();
    expect(mockedHashGateway.hash).toHaveBeenCalled();
    expect(mockedCredentialRepository.save).toHaveBeenCalled();
    expect(response).toEqual({
      credential: {
        appId: `app-123`,
        appSecret: `secret-123`,
      },
    });
  });

  // test("it should not generate a credential", async () => {
  //   const uc = new GenerateCredentialUsecase(
  //     mockedCredentialGateway,
  //     mockedPresenter,
  //     mockedMerchantRepository,
  //     mockedCredentialRepository,
  //     mockedHashGateway,
  //   );
  // });
});
