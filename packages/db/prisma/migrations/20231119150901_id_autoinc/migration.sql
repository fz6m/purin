-- AlterTable
CREATE SEQUENCE tweet_id_seq;
ALTER TABLE "Tweet" ALTER COLUMN "id" SET DEFAULT nextval('tweet_id_seq');
ALTER SEQUENCE tweet_id_seq OWNED BY "Tweet"."id";
