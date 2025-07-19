import { faker } from "@faker-js/faker";
import {
  cardInfo,
  TransactionAggregate,
} from "../../../business/transaction.aggregate";
import { CurrencyEnum } from "../../../entity/Merchant";
import { TransactionRepository } from "../../../repository/Transaction/transaction.repository";
import { ICaptureTransactionUseCase } from "./captureTransaction.usecase.interface";
import { OperationRepository } from "../../../repository/Operation/Operation.repository";
import { CardInfoRepository } from "../../../repository/CardInfo/cardInfo.repository";
import { v4 as uuidv4 } from "uuid";

export interface ICaptureTransactionUseCasePresenter<
  SuccessType,
  ProviderErrorType,
  NotFoundType,
  FunctionalErrorType,
> {
  success: (urlConfirm: any) => Promise<SuccessType>;
  providerError: (error: string) => Promise<ProviderErrorType>;
  notFound: () => Promise<NotFoundType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
}

export class CaptureTransactionUseCase<
  SuccessType,
  ProviderErrorType,
  NotFoundType,
  FunctionalErrorType,
> implements
    ICaptureTransactionUseCase<
      SuccessType,
      ProviderErrorType,
      NotFoundType,
      FunctionalErrorType
    >
{
  constructor(
    private transactionRepo: TransactionRepository,
    private operationRepo: OperationRepository,
    private cardInfoRepo: CardInfoRepository,
    private presenter: ICaptureTransactionUseCasePresenter<
      SuccessType,
      ProviderErrorType,
      NotFoundType,
      FunctionalErrorType
    >,
  ) {}
  async execute({
    id,
    currency,
    customerCardInfo,
    amount,
  }: {
    id: string;
    currency: CurrencyEnum;
    customerCardInfo: cardInfo;
    amount: number;
  }): Promise<
    SuccessType | ProviderErrorType | NotFoundType | FunctionalErrorType
  > {
    const currentTransaction = await this.transactionRepo.findById(id);
    if (!currentTransaction) {
      return await this.presenter.notFound();
    }
    const operationsExists = await this.operationRepo.findbyTransactionId(id);
    if (operationsExists.some((op) => op.type === "CAPTURE")) {
      return await this.presenter.functionalError(
        "Transaction already captured",
      );
    }
    const transaction = new TransactionAggregate(
      id,
      currentTransaction.merchantId,
      currentTransaction.externalRef,
      100,
      currency,
      currentTransaction.createdAt,
      [],
    );
    try {
      transaction.addOperation({
        type: "CAPTURE",
        amount,
        currency,
        customerCardInfo,
        merchantIban: "merchant-iban",
      });
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
    const currentOperation =
      transaction.operations[transaction.operations.length - 1];
    //save card info
    const cardInfoId = `card-${uuidv4()}`;
    await this.cardInfoRepo.save({
      id: cardInfoId,
      cardNumber: customerCardInfo.cardNumber,
      cardHolderName: customerCardInfo.cardHolderName,
      cardExpiryDate: customerCardInfo.expiryDate,
      cardCvv: customerCardInfo.cvv,
      createdAt: new Date(),
    });

    await this.operationRepo.save({
      id: currentOperation.id,
      type: currentOperation.type,
      amount: currentOperation.amount,
      status: currentOperation.status,
      createdAt: currentOperation.createdAt,
      merchantIban: currentOperation.merchantIban,
      cardInfoId: cardInfoId,
      transactionId: id,
      updatedAt: currentOperation.updatedAt,
      currency: currentOperation.currency,
    });
    // claim the operation to the psp
    const response = faker.datatype.boolean();
    if (response) {
      try {
        transaction.updateOperationStatus({
          operationId: currentOperation.id,
          status: "COMPLETED",
        });
      } catch (error) {
        return await this.presenter.functionalError(error.message);
      }
      await this.operationRepo.updateStatus(
        currentOperation.id,
        "COMPLETED",
        new Date(),
      );
      return await this.presenter.success(transaction.toDto());
    } else {
      try {
        transaction.updateOperationStatus({
          operationId: currentOperation.id,
          status: "FAILED",
        });
      } catch (error) {
        return await this.presenter.functionalError(error.message);
      }
      await this.operationRepo.updateStatus(
        currentOperation.id,
        "FAILED",
        new Date(),
      );
      return await this.presenter.providerError(
        "Payment provider error occurred",
      );
    }
  }
}
