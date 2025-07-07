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

  @Column({ unique: true })
  companyName: string

  @Column()
  redirectionUrlConfirm : string

  @Column()
  redirectionUrlCancel : string

  @Column({
    type : "enum",
    enum : CurrencyEnum
  })
  currency : CurrencyEnum

  @Column()
  kbisUrl: string

  @OneToMany(() => MerchantContact, (contact) => contact.merchant)
  contacts : MerchantContact[]

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

}