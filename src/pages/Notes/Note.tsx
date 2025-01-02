import { useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { Note as NoteType } from "../../../app/database/models/note";
import { useEffect, useState } from "react";
import { Divider, Grid, Loader, Title } from "@mantine/core";
import TextEditor from "../../library/components/RichTextEditor";
import { notifications } from "@mantine/notifications";

export default function Note() {
  const { id } = useParams();
  const [body, setBody] = useState("");
  const { data: note, loading: loadingNote } = useFetch<undefined, NoteType>({
    url: `/notes/${id}`,
    runOnMount: true,
    onSuccess: (data) => {
      setBody(data.body);
    },
  });

  const { load: updateNote } = useFetch<Partial<NoteType>, NoteType>({
    url: `/notes/${id}`,
    method: "PATCH",
    onSuccess: () => {
      notifications.show({
        title: "Note updated",
        message: "Note updated successfully",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to update note",
        color: "red",
      });
    },
    body: {
      body,
    },
    dependencies: [body],
  });

  useEffect(() => {
    if (note && note.body !== body && !loadingNote) {
      updateNote();
    }
  }, [body]);

  const getTitle = () => {
    if (note?.scheduledAt) {
      return `Note scheduled for ${new Date(note.scheduledAt).toLocaleString()}`;
    }
    if (note?.postedAt) {
      return `Note posted at ${new Date(note.postedAt).toLocaleString()}`;
    }
    return "Draft Note";
  };

  const saved = note?.body === body;

  return (
    <div>
      <Grid>
        <Grid.Col span={{ sm: 12 }}>
          {loadingNote && <Loader />}
          <Title order={1}>{getTitle()}</Title>
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>{saved ? "Saved" : "Saving..."}</Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <Divider my={"lg"} />
        </Grid.Col>
        {note && (
          <Grid.Col span={{ sm: 12 }}>
            <TextEditor
              startingContent={note.body}
              onUpdate={(content) => {
                setBody(content);
              }}
            />
          </Grid.Col>
        )}
      </Grid>
    </div>
  );
}
