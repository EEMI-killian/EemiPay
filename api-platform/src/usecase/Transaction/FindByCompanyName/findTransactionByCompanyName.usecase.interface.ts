export interface IFindTransactionByCompanyNameUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  execute(
    companyName: string,
  ): Promise<SuccessType | FunctionalErrorType | NotFoundType>;
}
