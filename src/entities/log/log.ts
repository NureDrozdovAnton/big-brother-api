import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "../user";
import { EventType } from "./interfaces";

@Entity()
export default class Log {
    @PrimaryGeneratedColumn("uuid")
    declare id: string;

    @Column("uuid", { nullable: false })
    declare userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    declare user: User;

    @Column("enum", { enum: EventType, nullable: false })
    declare eventType: EventType;

    @Column("jsonb", { nullable: false, default: {} })
    declare meta: Record<string, unknown>;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    declare createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    declare updatedAt: Date;
}
