import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Merchant } from "./Merchant";

@Entity()
export class MerchantContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.contacts)
  merchant: Merchant;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
