import z from "zod";
import { TransactionAggregate } from "../../../business/transaction.aggregate";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ICreateTransactionUseCase } from "./createTransaction.usecase.interface";
import { CurrencyEnum } from "../../../entity/Merchant";
import { ITransactionRepository } from "../../../repository/Transaction/transaction.repository.interface";

const schema = z.object({
  merchantId: z.string(),
  externalRef: z.string(),
  amount: z.number().min(0),
  currency: z.nativeEnum(CurrencyEnum),
});

type CreateTransactionUseCaseSchema = z.infer<typeof schema>;
interface ICreateTransactionUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
  NotFoundType,
> {
  success: (paymentUrl: string) => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
  notFound: (error: string) => Promise<NotFoundType>;
}

export class CreateTransactionUseCase<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
  NotFoundType,
> implements
    ICreateTransactionUseCase<
      SuccessType,
      FunctionalErrorType,
      InvalidArgumentsType,
      NotFoundType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly presenter: ICreateTransactionUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      InvalidArgumentsType,
      NotFoundType
    >,
  ) {}

  async execute({
    merchantId,
    externalRef,
    amount,
    currency,
  }: CreateTransactionUseCaseSchema) {
    let validateData: CreateTransactionUseCaseSchema;
    try {
      validateData = schema.parse({
        merchantId,
        externalRef,
        amount,
        currency,
      });
    } catch (error) {
      return await this.presenter.invalidArguments(error.message);
    }

    try {
      const merchant = await this.merchantRepository.findById(merchantId);
      if (!merchant) {
        await this.presenter.notFound("Merchant not found");
      }

      const transaction = new TransactionAggregate(
        merchantId,
        externalRef,
        amount,
        currency,
      );

      await this.transactionRepository.save({
        id: transaction.id,
        merchantId: transaction.merchantId,
        externalRef: transaction.externalRef,
        amount: transaction.amount,
        currency: transaction.currency,
      });

      return await this.presenter.success(
        `http://localhost:3051/transaction/capture/${transaction.id}`,
      );
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}
