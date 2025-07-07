import z from "zod";
import {
  Credential,
  CredentialGatewayInterface,
} from "../../../gateway/credential/credential.gateway.interface";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";
import { ICredentialRepository } from "../../../repository/Credential/CredentialRepository.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IRotateCredentialUsecase } from "./rotateCredential.usecase.interface";

const schema = z.object({
  merchantId: z.string(),
  appId: z.string(),
});

type RotateCredentialArgs = z.infer<typeof schema>;

export type IRotateCredentialUsecasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> = {
  success: (credential: Credential) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class RotateCredentialUsecase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> implements
    IRotateCredentialUsecase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly credentialGateway: CredentialGatewayInterface,
    private readonly presenter: IRotateCredentialUsecasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >,
    private readonly merchantRepository: IMerchantRepository,
    private readonly credentialRepository: ICredentialRepository,
    private readonly hashGateway: IHashGateway,
  ) {}

  async execute(
    args: RotateCredentialArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  > {
    let validatedData: RotateCredentialArgs;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return this.presenter.invalidArguments(error.message);
    }

    try {
      const merchant = await this.merchantRepository.findById(
        validatedData.merchantId,
      );
      if (!merchant) {
        return this.presenter.notFound();
      }
      const credentials = await this.credentialGateway.rotate(
        validatedData.appId,
      );
      const hashSecret = await this.hashGateway.hash(credentials.appSecret);
      await this.credentialRepository.update({
        appId: credentials.appId,
        appSecret: hashSecret,
      });
      return await this.presenter.success(credentials);
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
