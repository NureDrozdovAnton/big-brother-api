import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCameraUrl1766805564193 implements MigrationInterface {
    name = 'AddCameraUrl1766805564193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "camera" ADD "rtspUrl" text`);
        await queryRunner.query(`ALTER TABLE "camera" ADD "ptzUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "camera" DROP COLUMN "ptzUrl"`);
        await queryRunner.query(`ALTER TABLE "camera" DROP COLUMN "rtspUrl"`);
    }

}
