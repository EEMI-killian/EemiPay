import { CardInfo } from "../../entity/CardInfo";

export interface ICardInfoRepository {
  save(cardInfo: CardInfo): Promise<void>;
}
