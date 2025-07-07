import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MerchantContact } from "./MerchantContact";

export enum CurrencyEnum {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
}

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "company_name", unique: true })
  companyName: string;

  @Column({ name: "redirection_url_confirm" })
  redirectionUrlConfirm: string;

  @Column({ name: "redirection_url_cancel" })
  redirectionUrlCancel: string;

  @Column({
    type: "enum",
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @Column({ name: "kbis_url" })
  kbisUrl: string;

  @OneToMany(() => MerchantContact, (contact) => contact.merchant)
  contacts: MerchantContact[];

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
