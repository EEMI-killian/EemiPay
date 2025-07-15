import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ name: "contact_email", unique: true })
  contactEmail: string;

  @Column({ name: "contact_phone" })
  contactPhone: string;

  @Column({ name: "contact_first_name" })
  contactFirstName: string;

  @Column({ name: "contact_last_name" })
  contactLastName: string;

  @Column({ name: "user_id" })
  userId: number;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
