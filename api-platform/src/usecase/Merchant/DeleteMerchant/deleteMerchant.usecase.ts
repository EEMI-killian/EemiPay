import z from "zod";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IDeleteMerchantUseCase } from "./deleteMerchant.usecase.interface";

const schema = z.object({
  id: z.string().uuid(),
});

type DeleteMerchantArgs = z.infer<typeof schema>;

export type IDeleteMerchantPresenter<
  SuccessType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> = {
  success: () => Promise<SuccessType>;
  notFound: () => Promise<NotFoundType>;
  invalidArguments: (error: string) => Promise<InvalidArgsType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
};

export class DeleteMerchantUseCase<
  SuccessType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> implements
    IDeleteMerchantUseCase<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly presenter: IDeleteMerchantPresenter<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >,
  ) {}
  async execute(
    args: DeleteMerchantArgs,
  ): Promise<
    SuccessType | NotFoundType | InvalidArgsType | FunctionalErrorType
  > {
    try {
      let validatedData: DeleteMerchantArgs;

      try {
        validatedData = schema.parse(args);
      } catch (error) {
        return await this.presenter.invalidArguments(error.message);
      }
      const merchant = await this.merchantRepository.findById(validatedData.id);
      if (!merchant) {
        return this.presenter.notFound();
      }
      await this.merchantRepository.delete(validatedData.id);
      return this.presenter.success();
    } catch (error) {
      return this.presenter.functionalError(error);
    }
  }
}
