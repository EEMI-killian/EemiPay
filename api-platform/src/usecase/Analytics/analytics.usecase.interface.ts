


export interface IAnalyticsUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType> {
  execute(): Promise<
    SuccessType | FunctionalErrorType | NotFoundType
  >;
}