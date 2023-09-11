import { NoteService } from "../services/note.service";
import { CustomResponse } from "../utils/CustomResponse";
import { getCurrentTimestamp } from "../utils/getCurrentTimestamp";
import { parseBody } from "../utils/parseBody";
import { parseQuery } from "../utils/parseQuery";

export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  async createNote(req: Request) {
    const data = await parseBody(req.body);

    const res = await this.noteService.createNote({
      timestamp: getCurrentTimestamp(),
      ...data,
    });

    return new CustomResponse({
      data: res,
    });
  }

  async updateNote(params: string, req: Request) {
    const id = Number(params);
    const data = await parseBody(req.body);

    const isExists = await this.noteService.getNoteById(id);

    if (!isExists) {
      return new CustomResponse(
        { 
          status: 'NOT FOUND',
          message: `Note with id ${id} was not found` 
        },
        { status: 404 }
      );
    }

    const res = await this.noteService.updateNote(id, data)

    return new CustomResponse({
      data: res,
    });
  }

  async getNotes(url: URL) {
    const { skip = 0, take = 10 } = parseQuery(url);
    const data = await this.noteService.getNotes(Number(skip), Number(take));

    return new CustomResponse({
      data,
    });
  }

  async getNoteById(params: string) {
    const id = Number(params);
    const data = await this.noteService.getNoteById(id);

    return new CustomResponse({
      data,
    });
  }

  async deleteNote(params: string) {
    const id = Number(params);
    const data = await this.noteService.getNoteById(id);

    if (!data) {
      return new CustomResponse(
        { 
          status: 'NOT FOUND',
          message: `Note with id ${id} was not found` 
        },
        { status: 404 }
      );
    }

    await this.noteService.deleteNoteById(id);

    return new CustomResponse();
  }
}
