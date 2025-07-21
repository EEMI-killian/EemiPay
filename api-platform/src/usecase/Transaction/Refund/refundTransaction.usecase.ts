import {
  operation,
  TransactionAggregate,
} from "../../../business/transaction.aggregate";
import { OperationStatus, TransactionType } from "../../../entity/Operation";
import { IPspGateway } from "../../../gateway/psp/Psp.gateway.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IOperationRepository } from "../../../repository/Operation/operation.repository.interface";
import { IPaymentMethodRepository } from "../../../repository/PaymentMethod/paymentMethod.repository.interface";
import { ITransactionRepository } from "../../../repository/Transaction/transaction.repository.interface";
import { IRefundTransactionUseCase } from "./refundTransaction.usecase.interface";

interface IRefundTransactionUseCasePresenter<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> {
  success(transaction: TransactionAggregate): Promise<SuccessType>;
  notFound(): Promise<NotFoundType>;
  merchantNotFound(): Promise<NotFoundType>;
  functionalError(error: string): Promise<FunctionalErrorType>;
}

export class RefundTransactionUseCase<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> implements
    IRefundTransactionUseCase<SuccessType, NotFoundType, FunctionalErrorType>
{
  constructor(
    private transactionRepository: ITransactionRepository,
    private presenter: IRefundTransactionUseCasePresenter<
      SuccessType,
      NotFoundType,
      FunctionalErrorType
    >,
    private merchantRepository: IMerchantRepository,
    private operationRepository: IOperationRepository,
    private paymentMethodRepository: IPaymentMethodRepository,
    private pspGateway: IPspGateway,
  ) {}

  async execute({
    amountToRefund,
    transactionId,
  }: {
    amountToRefund: number;
    transactionId: string;
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
    const paymentMethodId = operationsFound[0].customerPaymentMethodId;
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
      currentTransaction.refund({
        amount: amountToRefund,
        merchantIban: merchantInfo.iban,
        currency: transaction.currency,
        customerCardInfo: {
          cardHolderName: operations[0].customerCardInfo.cardHolderName,
          cardNumber: operations[0].customerCardInfo.cardNumber,
          expiryDate: operations[0].customerCardInfo.expiryDate,
          cvv: operations[0].customerCardInfo.cvv,
        },
      });
      const operationId =
        currentTransaction.operations[currentTransaction.operations.length - 1]
          .id;

      await this.operationRepository.save({
        id: operationId,
        transactionId: currentTransaction.id,
        createdAt: new Date(),
        type: TransactionType.REFUND,
        status: OperationStatus.PENDING,
        merchantIban: merchantInfo.iban,
        customerPaymentMethodId: paymentMethodId,
        currency: transaction.currency,
        amount: amountToRefund,
      });

      const pspResponse = await this.pspGateway.makeTransaction({
        merchantIban: merchantInfo.iban,
        merchantName: merchantInfo.companyName,
        amount: amountToRefund,
        currency: transaction.currency,
        cardInfo: {
          cardNumber: operations[0].customerCardInfo.cardNumber,
          cardExpiry: operations[0].customerCardInfo.expiryDate,
          cardHolderName: operations[0].customerCardInfo.cardHolderName,
          cardCvc: operations[0].customerCardInfo.cvv,
        },
      });
      if (!pspResponse.success) {
        return await this.presenter.functionalError(pspResponse.message);
      }
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
      return await this.presenter.functionalError(error.message);
    }
  }
}
