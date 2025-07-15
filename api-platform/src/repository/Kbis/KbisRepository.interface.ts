export interface IKbisRepository {
  upload(path: string): Promise<void>;
  download(path: string): Promise<void | string>;
}
