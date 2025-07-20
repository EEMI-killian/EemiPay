export interface ICaptureTransactionUseCase<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> {
  execute({
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
  }): Promise<SuccessType | NotFoundType | FunctionalErrorType>;
}
