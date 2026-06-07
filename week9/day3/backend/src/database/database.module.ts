import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export const MONGO_DB = 'MONGO_DB';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (config: ConfigService): Promise<MongoClient> => {
        const url = config.get<string>('MONGODB_URL', 'mongodb://localhost:27017');
        const client = new MongoClient(url);
        await client.connect();
        console.log('✅ MongoDB connected (same cluster as Day 2)');
        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: MONGO_DB,
      useFactory: (client: MongoClient, config: ConfigService): Db => {
        const dbName = config.get<string>('DB_NAME', 'cricket_db');
        return client.db(dbName);
      },
      inject: [DATABASE_CONNECTION, ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION, MONGO_DB],
})
export class DatabaseModule {}
