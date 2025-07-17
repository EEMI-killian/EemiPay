export interface IUuidGateway {
  generate(prefix: string): Promise<string>;
}
