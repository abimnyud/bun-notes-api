import { Database } from "bun:sqlite";

export class DatabaseService {
  private db: Database;
  constructor() {
    this.db = new Database("mydb.sqlite");

    /**
     * Instantiate Notes Table If Not Exists
     */
    this.db.run(
      `CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INTEGER, title TEXT, content TEXT);`
    );
  }

  get getDb(): Database {
    return this.db;
  }
}
