import type { TABLES } from "@/types";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

class DatabaseOperations<T> {
  private _db: SQLiteDatabase;
  constructor(dbInstance: SQLiteDatabase) {
    this._db = dbInstance;
  }

  async createTableQuery(table: TABLES): Promise<void> {
    try {
      return this._db.execAsync(
        `CREATE TABLE IF NOT EXISTS ${table}
        (id TEXT PRIMARY KEY, title TEXT, date VARCHAR, description TEXT, picture TEXT, audio Text)`
      );
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async getFromTable(table: TABLES, condition?: string): Promise<Array<T> | null> {
    try {
      return this._db.getAllAsync<T>(`SELECT * from ${table} ${condition}`);
    } catch (err: any) {
      console.error(err.message);
      return null;
    }
  }

  async create(
    table: TABLES,
    columns: (keyof T)[],
    values: unknown[]
  ): Promise<SQLiteRunResult | null> {
    try {
      return await this._db.runAsync(`INSERT INTO ${table}(${columns.join(",")})
                            VALUES(${values
                              .map((item) => (typeof item === "string" ? `'${item}'` : item))
                              .join(",")})`);
    } catch (err: any) {
      console.error(err.message);
      return null;
    }
  }

  async resetTable(table: TABLES): Promise<void> {
    await this._db.runAsync(`DELETE FROM ${table}`);
  }
}

export default DatabaseOperations;
