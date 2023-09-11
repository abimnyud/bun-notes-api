import { NoteController } from "./controllers/note.controller";
import { DatabaseService } from "./services/db.service";
import { NoteService } from "./services/note.service";

const db = new DatabaseService().getDb;
const notesService = new NoteService(db);
const controller = new NoteController(notesService);

const server = Bun.serve({
  port: 3000,
  fetch(req: Request) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === "/") {
      return new Response("Hello World!");
    }

    if (pathname === "/api/notes" && req.method === "POST") {
      return controller.createNote(req);
    }

    if (pathname === "/api/notes" && req.method === "GET") {
      return controller.getNotes(url);
    }

    if (/notes+\//.test(pathname) && req.method === "PUT") {
      return controller.updateNote(pathname.split("/")[3], req);
    }

    if (/notes+\//.test(pathname) && req.method === "GET") {
      return controller.getNoteById(pathname.split("/")[3]);
    }

    if (/notes+\//.test(pathname) && req.method === "DELETE") {
      return controller.deleteNote(pathname.split("/")[3]);
    }

    return new Response("Not found!", { status: 404 });
  },
});

console.log(`Listening on port ${server.port}`);
