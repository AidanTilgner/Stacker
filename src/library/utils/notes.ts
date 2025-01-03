import { Note } from "../../../app/database/models/note";
import { prettyDateTime } from "./dates";
import showdown from "showdown";

export const noteStatus = (note: Note): "Posted" | "Scheduled" | "Draft" => {
  if (note.postedAt) {
    return "Posted";
  } else if (note.scheduledAt) {
    return "Scheduled";
  } else {
    return "Draft";
  }
};

export const getTitle = (note: Note) => {
  if (note?.scheduledAt) {
    return `Note scheduled for ${prettyDateTime(note.scheduledAt)}`;
  }
  if (note?.postedAt) {
    return `Note posted at ${prettyDateTime(note.postedAt)}`;
  }
  return "Draft Note";
};

export const htmlToMarkdown = (html: string) => {
  return new showdown.Converter().makeMarkdown(html);
};
