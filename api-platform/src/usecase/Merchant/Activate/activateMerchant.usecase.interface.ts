export interface IActivateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  execute({
    id,
  }: {
    id: string;
  }): Promise<SuccessType | FunctionalErrorType | NotFoundType>;
}
