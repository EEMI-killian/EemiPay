import z from "zod";
import { Merchant } from "../../../entity/Merchant";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IGetMerchantUseCase } from "./getMerchant.usecase.interface";

const schema = z.object({
  id: z.string(),
});

type GetMerchantArgs = z.infer<typeof schema>;

export type IGetMerchantUseCasePresenter<
  SuccessType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> = {
  success: (merchant: Merchant) => Promise<SuccessType>;
  notFound: () => Promise<NotFoundType>;
  invalidArguments: (error: string) => Promise<InvalidArgsType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
};

export class GetMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgsType,
> implements
    IGetMerchantUseCase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgsType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly presenter: IGetMerchantUseCasePresenter<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >,
  ) {}

  async execute(
    args: GetMerchantArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgsType
  > {
    let validatedData: GetMerchantArgs;

    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error);
    }
    const merchant = await this.merchantRepository.findById(validatedData.id);
    if (!merchant) {
      return await this.presenter.notFound();
    }
    return await this.presenter.success(merchant);
  }
}
