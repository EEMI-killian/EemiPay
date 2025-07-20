import {
  operation,
  TransactionAggregate,
} from "../../../business/transaction.aggregate";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ITransactionRepository } from "../../../repository/Transaction/transaction.repository.interface";
import { ICaptureTransactionUseCase } from "./captureTransaction.usecase.interface";
import { IPaymentMethodRepository } from "../../../repository/PaymentMethod/paymentMethod.repository.interface";
import { OperationStatus, TransactionType } from "../../../entity/Operation";
import { IOperationRepository } from "../../../repository/Operation/operation.repository.interface";
import { v4 as uuidv4 } from "uuid";

interface ICaptureTransactionPresenter<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> {
  success(transaction: TransactionAggregate): Promise<SuccessType>;
  notFound(): Promise<NotFoundType>;
  merchantNotFound(): Promise<NotFoundType>;
  functionnalError(error: string): Promise<FunctionalErrorType>;
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
      return await this.presenter.notFound();
    }

    const merchantInfo = await this.merchantRepository.findById(
      transaction.merchantId,
    );
    if (!merchantInfo) {
      return await this.presenter.merchantNotFound();
    }
    let operations: operation[] = [];
    const operationsFound =
      await this.operationRepository.findByTransactionId(transactionId);

    if (operationsFound) {
      operations = await Promise.all(
        operationsFound.map(async (op) => ({
          id: op.id,
          transactionId: op.transactionId,
          type: op.type,
          amount: op.amount,
          currency: op.currency,
          customerCardInfo: await this.paymentMethodRepository.findById(
            op.customerPaymentMethodId,
          ),
          merchantIban: op.merchantIban,
          status: op.status,
          createdAt: op.createdAt,
          updatedAt: op.updatedAt,
        })),
      );
    }
    try {
      const currentTransaction = new TransactionAggregate(
        transactionId,
        transaction.merchantId,
        transaction.externalRef,
        transaction.amount,
        transaction.currency,
        transaction.createdAt,
        operations,
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

      const operationId = currentTransaction.operations[0].id;
      const paymentMethodId = `paymentMethod-${uuidv4()}`;

      await this.paymentMethodRepository.save({
        id: paymentMethodId,
        cardHolderName,
        cvv,
        expiryDate,
        cardNumber,
      });

      await this.operationRepository.save({
        id: operationId,
        transactionId: currentTransaction.id,
        createdAt: new Date(),
        type: TransactionType.CAPTURE,
        status: OperationStatus.PENDING,
        merchantIban: merchantInfo.iban,
        customerPaymentMethodId: paymentMethodId,
        currency: transaction.currency,
        amount: transaction.amount,
      });

      // fake psp
      currentTransaction.updateOperationStatus({
        operationId,
        status: OperationStatus.COMPLETED,
      });

      await this.operationRepository.updateOperationStatus({
        operationId,
        status: OperationStatus.COMPLETED,
      });

      return await this.presenter.success(currentTransaction);
    } catch (error) {
      return await this.presenter.functionnalError(error.message);
    }
  }
}
