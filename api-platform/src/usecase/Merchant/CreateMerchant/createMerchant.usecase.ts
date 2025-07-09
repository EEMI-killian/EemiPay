import z from "zod";
import {  IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ICreateMerchantUseCase } from "./createMerchant.usecase.interface";
import { CurrencyEnum } from "../../../entity/Merchant";

const schema = z.object({
    companyName: z.string().min(3),
    redirectionUrlConfirm: z.string().url(),
    redirectionUrlCancel: z.string().url(),
    currency: z.nativeEnum(CurrencyEnum),
    kbisUrl: z.string(),
});

type CreateMerchantArgs = z.infer<typeof schema>;

export type ICreateMerchantUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  alreadyExists: () => Promise<AlreadyExistsType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class CreateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
> implements ICreateMerchantUseCase<
    SuccessType, 
    FunctionalErrorType, 
    AlreadyExistsType, 
    InvalidArgumentsType
  > {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly presenter: ICreateMerchantUseCasePresenter<
            SuccessType,
            FunctionalErrorType,
            AlreadyExistsType,
            InvalidArgumentsType
        >
    ) {}

    async execute(args: CreateMerchantArgs): Promise<
        SuccessType | FunctionalErrorType | AlreadyExistsType | InvalidArgumentsType
    > {
        let validatedData: CreateMerchantArgs;
        
        try {
            validatedData = schema.parse(args);
        } catch (error) {
            return await this.presenter.invalidArguments(error);
        }

        try {
            const existingMerchant = await this.merchantRepository.findByCompanyName(validatedData.companyName);
            if (existingMerchant) {
                return await this.presenter.alreadyExists();
            }

            await this.merchantRepository.create({
                companyName: validatedData.companyName,
                redirectionUrlConfirm: validatedData.redirectionUrlConfirm,
                redirectionUrlCancel: validatedData.redirectionUrlCancel,
                currency: validatedData.currency,
                kbisUrl: validatedData.kbisUrl
            });
            
            return await this.presenter.success();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return await this.presenter.error(errorMessage);
        }
    }
}