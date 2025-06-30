import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { length: 100 })
    firstName: string

    @Column("varchar", { length: 100 })
    lastName: string

    @Column("varchar", { length: 200 , unique: true })
    email: string

    @Column("varchar", { length: 200 })
    password: string

    @Column( "boolean" ,{ default: false })
    isActive: boolean

    @Column( "date" ,{ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
