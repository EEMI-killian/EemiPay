import { Repository } from "typeorm";
import { CardInfo } from "../../entity/CardInfo";
import { ICardInfoRepository } from "./CardInfo.repository.interface";

export class CardInfoRepository implements ICardInfoRepository {
  constructor(private cardInfoRepository: Repository<CardInfo>) {}

  async save(cardInfo: CardInfo): Promise<void> {
    await this.cardInfoRepository.save(cardInfo);
  }
}
