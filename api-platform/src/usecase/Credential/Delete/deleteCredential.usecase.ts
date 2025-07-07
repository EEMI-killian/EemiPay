import z from "zod";
import { ICredentialRepository } from "../../../repository/Credential/CredentialRepository.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IDeleteCredentialUsecase } from "./deleteCredential.usecase.interface";

const schema = z.object({
  appId: z.string(),
  merchantId: z.string(),
});

type DeleteCredentialArgs = z.infer<typeof schema>;

export type IDeleteCredentialUsecasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class DeleteCredentialUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> implements
    IDeleteCredentialUsecase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly credentialRepository: ICredentialRepository,
    private readonly presenter: IDeleteCredentialUsecasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgumentsType
    >,
  ) {}
  async execute(
    args: DeleteCredentialArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  > {
    let validatedData: DeleteCredentialArgs;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error);
    }

    try {
      const merchant = await this.merchantRepository.findById(
        validatedData.merchantId,
      );
      if (!merchant) {
        return await this.presenter.notFound();
      }
      const credential = await this.credentialRepository.findById(
        validatedData.appId,
      );
      if (!credential) {
        return await this.presenter.notFound();
      }

      await this.credentialRepository.delete(validatedData.appId);
      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
