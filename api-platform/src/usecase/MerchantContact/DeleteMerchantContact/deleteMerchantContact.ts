


import z from "zod";
import { IMerchantContactRepository } from "../../../repository/MerchantContact/merchantContact.repository.interface";
import { IDeleteMerchantContactUseCase } from "./deleteMerchantContact.interface";

const schema = z.object({
  id: z.number(),
});

type DeleteMerchantContactArgs = z.infer<typeof schema>;

export type IDeleteMerchantContactPresenter<
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

export class DeleteMerchantContactUseCase<
  SuccessType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> implements
    IDeleteMerchantContactUseCase<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >
{
  constructor(
    private readonly merchantContactRepository: IMerchantContactRepository,
    private readonly presenter: IDeleteMerchantContactPresenter<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >,
  ) {}
  async execute(
    args : DeleteMerchantContactArgs ,
  ): Promise<
    SuccessType | NotFoundType | InvalidArgsType | FunctionalErrorType
  > {
    let validatedData: DeleteMerchantContactArgs;
    
    try {
        validatedData = schema.parse(args);
    } catch (error) {
        return await this.presenter.invalidArguments(error);
    }
    try {
      const merchantContact = await this.merchantContactRepository.findById(validatedData
        .id
      );
      if (!merchantContact) {
        return await this.presenter.notFound();
      }
      await this.merchantContactRepository.delete(validatedData.id);
      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.functionalError(error);
    }
  }
}
