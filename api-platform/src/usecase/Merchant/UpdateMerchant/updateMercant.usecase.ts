import z from "zod";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { CurrencyEnum } from "../../../entity/Merchant";
import { I } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { IUpdateMerchantUseCase } from "./updateMercant.usecase.interface";

const schema = z.object({
  id: z.string().uuid(),
  redirectionUrlConfirm: z.string().optional(),
  redirectionUrlCancel: z.string().optional(),
  currency: z.nativeEnum(CurrencyEnum).optional(),
});

type IUpdateMerchantUseCaseArgs = z.infer<typeof schema>;

export type IUpdateMerchantUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgsType,
> = {
  success: () => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
  invalidArguments: (error: string) => Promise<InvalidArgsType>;
};

export class UpdateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgsType,
> implements
    IUpdateMerchantUseCase<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgsType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly presenter: IUpdateMerchantUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType,
      InvalidArgsType
    >,
  ) {}
  async execute(
    args: IUpdateMerchantUseCaseArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgsType
  > {
    let validatedData: IUpdateMerchantUseCaseArgs;

    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return this.presenter.invalidArguments(error);
    }

    const merchant = await this.merchantRepository.findById(validatedData.id);
    if (!merchant) {
      return this.presenter.notFound();
    }

    await this.merchantRepository.update({
      id: merchant.id,
      ...validatedData,
    });

    return this.presenter.success();
  }
}
