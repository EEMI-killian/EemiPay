import { TransactionAggregate } from "../../../business/transaction.aggregate";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ITransactionRepository } from "../../../repository/Transaction/transaction.repository.interface";
import { ICaptureTransactionUseCase } from "./captureTransaction.usecase.interface";
import { IPaymentMethodRepository } from "../../../repository/PaymentMethod/paymentMethod.repository.interface";
import { OperationStatus, TransactionType } from "../../../entity/Operation";
import { IOperationRepository } from "../../../repository/Operation/operation.repository.interface";
import { v4 as uuidv4 } from "uuid";

export interface ICaptureTransactionPresenter<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> {
  success(transaction: TransactionAggregate): SuccessType;
  notFound(): NotFoundType;
  merchantNotFound(): NotFoundType;
  functionnalError(error: string): FunctionalErrorType;
}

export class captureTransactionUseCase<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> implements
    ICaptureTransactionUseCase<SuccessType, NotFoundType, FunctionalErrorType>
{
  constructor(
    private transactionRepository: ITransactionRepository,
    private presenter: ICaptureTransactionPresenter<
      SuccessType,
      NotFoundType,
      FunctionalErrorType
    >,
    private merchantRepository: IMerchantRepository,
    private paymentMethodRepository: IPaymentMethodRepository,
    private operationRepository: IOperationRepository,
  ) {}

  async execute({
    transactionId,
    cardHolderName,
    cvv,
    expiryDate,
    cardNumber,
  }: {
    transactionId: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: string;
    cardNumber: string;
  }): Promise<SuccessType | NotFoundType | FunctionalErrorType> {
    const transaction =
      await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      this.presenter.notFound();
    }

    const merchantInfo = await this.merchantRepository.findById(
      transaction.merchantId,
    );
    if (!merchantInfo) {
      this.presenter.merchantNotFound();
    }
    try {
      const currentTransaction = new TransactionAggregate(
        transactionId,
        transaction.merchantId,
        transaction.externalRef,
        transaction.amount,
        transaction.currency,
        transaction.createdAt,
        [],
      );
      currentTransaction.capture({
        amount: transaction.amount,
        currency: transaction.currency,
        customerCardInfo: {
          cardHolderName: cardHolderName,
          cvv: cvv,
          cardNumber: cardNumber,
          expiryDate: expiryDate,
        },
        merchantIban: merchantInfo.iban,
      });
      const paymentMethodId = `paymentMethod-${uuidv4()}`;
      await this.paymentMethodRepository.save({
        id: paymentMethodId,
        cardHolderName,
        cvv,
        expiryDate,
        cardNumber,
      });
      await this.operationRepository.save({
        id: currentTransaction.id,
        createdAt: new Date(),
        type: TransactionType.CAPTURE,
        status: OperationStatus.PENDING,
        merchantIban: merchantInfo.iban,
        customerPaymentMethodId: paymentMethodId,
        currency: transaction.currency,
        amount: transaction.amount,
      });
      return this.presenter.success(currentTransaction);
    } catch (error) {
      return this.presenter.functionnalError(error.message);
    }
  }
}
