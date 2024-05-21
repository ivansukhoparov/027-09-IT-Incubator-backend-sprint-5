import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { appSettings } from '../../../settings/app.settings';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async dropMongoDb() {
    try {
      const db =
        appSettings.api.MONGO_CONNECTION_URI +
        '/' +
        appSettings.api.MONGO_DB_NAME;
      await mongoose.connect(db); // Connecting to the database.
      await mongoose.connection.db.dropDatabase();
    } catch {
      console.log('DB dropping does failed');
      throw new Error('DB dropping did fail');
    }
  }

  async deleteAll() {
    const tables = await this.dataSource.query(
      `SELECT "table_name" FROM information_schema.tables  where table_schema='public'`,
    );
    const deleteAllQuery = tables
      .map((table: any) => {
        return `DELETE FROM "${table.table_name}"`;
      })
      .join(';');

    await this.dataSource.query(deleteAllQuery);
  }
}
//
// [
//   { table_name: 'Blogs' },
//   { table_name: 'Posts' },
//   { table_name: 'Posts Content' },
//   { table_name: 'Posts Likes' },
//   { table_name: 'Users' },
//   { table_name: 'Posts Comments' },
//   { table_name: 'Post Comments Likes' }
// ]
//
