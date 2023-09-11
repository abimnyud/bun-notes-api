import Database from "bun:sqlite";
import { Note, NoteBody } from "../types/note.type";

export class NoteService {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async createNote(dto: Omit<Note, "id">): Promise<Note> {
    const insertQuery = this.db.prepare(
      "INSERT INTO notes (timestamp, title, content) VALUES (?, ?, ?)"
    );
    const insertNote = this.db.transaction((note: Omit<Note, "id">) => {
      insertQuery.run(note.timestamp, note.title, note.content);

      /**
       * Get latest data
       */
      const selectQuery = this.db.query(
        "SELECT * FROM notes ORDER BY id DESC LIMIT 1"
      );
      return selectQuery.get();
    });

    return insertNote(dto);
  }

  async updateNote(id: number, dto: NoteBody): Promise<Note> {
    const updateQuery = this.db.prepare(
      "UPDATE notes SET title = ?, content = ? WHERE id = ?"
    );

    const updateNote = this.db.transaction((note: NoteBody) => {
      updateQuery.run(note.title, note.content, id);

      /**
       * Get latest data
       */
      const selectQuery = this.db.query("SELECT * FROM notes WHERE id = $id");
      return selectQuery.get(id.toString());
    });

    return updateNote(dto);
  }

  async getNoteById(id: number): Promise<any> {
    const query = this.db.query("SELECT * FROM notes WHERE id = $id");
    const data = query.get(id.toString());

    return data;
  }

  async getNotes(skip: number, take: number): Promise<any> {
    const query = this.db.query(
      "SELECT * FROM notes ORDER BY id DESC LIMIT $skip, $take"
    );

    return query.all({ $skip: skip, $take: take });
  }

  async deleteNoteById(id: number) {
    const query = this.db.query("DELETE FROM notes WHERE id = $id");

    return query.run(id);
  }
}
