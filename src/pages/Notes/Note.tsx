import { useNavigate, useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { Note as NoteType } from "../../../app/database/models/note";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import TextEditor from "../../library/components/RichTextEditor";
import { notifications } from "@mantine/notifications";
import { noteStatus, getTitle } from "../../library/utils/notes";
import { openConfirmModal } from "@mantine/modals";

export default function Note() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const { data: note, loading: loadingNote } = useFetch<undefined, NoteType>({
    url: `/notes/${id}`,
    runOnMount: true,
    onSuccess: (data) => {
      setBody(data.body);
    },
  });

  const { load: updateNoteContent } = useFetch<Partial<NoteType>, NoteType>({
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
      updateNoteContent();
    }
  }, [body]);

  const status = note ? noteStatus(note) : "unknown";
  const statusMessage = () => {
    switch (status) {
      case "Draft":
        return "This note is not scheduled.";
      case "Scheduled":
        if (!note?.scheduledAt) {
          return;
        }
        return `This note is scheduled for ${new Date(note.scheduledAt).toLocaleString()}`;
      case "Posted":
        if (!note?.postedAt) {
          return;
        }
        return `This note was posted at ${new Date(note.postedAt).toLocaleString()}`;
    }
  };

  const [schedulingNote, setSchedulingNote] = useState(false);

  const [scheduledAt, setScheduledAt] = useState<string>();
  const { load: updateNoteScheduledAt } = useFetch<Partial<NoteType>, NoteType>(
    {
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
        scheduledAt,
      },
    },
  );

  useEffect(() => {
    if (scheduledAt) {
      updateNoteScheduledAt();
    }
  }, [scheduledAt]);

  const scheduleTomorrowAt10AM = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10);
    tomorrow.setMinutes(0);
    setScheduledAt(tomorrow.toISOString());
  };

  const [deleting, setDeleting] = useState(false);
  const { load: deleteNote } = useFetch<undefined, Note>({
    url: `/notes/${note?.id}`,
    method: "DELETE",
    onSuccess: () => {
      notifications.show({
        title: "Note Deleted",
        message: "Note deleted successfully",
        color: "red",
      });
      navigate("/");
    },
    onError: () => {
      notifications.show({
        title: "Failed to Delete Note",
        message: "Failed to delete note",
        color: "red",
      });
    },
    dependencies: [note],
  });
  useEffect(() => {
    if (deleting) {
      openConfirmModal({
        title: "Delete Note",
        children: "Are you sure you want to delete this note?",
        onConfirm: () => {
          deleteNote();
        },
        onCancel: () => {
          setDeleting(false);
        },
        labels: {
          confirm: "Yes, delete",
          cancel: "Cancel",
        },
        confirmProps: {
          color: "red",
        },
      });
    }
  }, [deleting]);

  return (
    <div>
      <Modal
        opened={schedulingNote}
        onClose={() => setSchedulingNote(false)}
        title="Schedule Note"
      >
        <Grid>
          <Grid.Col span={{ sm: 12, md: 8 }}>
            <Button variant="light" onClick={scheduleTomorrowAt10AM}>
              Schedule for Tomorrow at 10 AM
            </Button>
          </Grid.Col>
          <Grid.Col span={{ sm: 12 }} />
          <Grid.Col span={{ sm: 12 }}>
            <Button onClick={() => setSchedulingNote(false)}>Cancel</Button>
          </Grid.Col>
        </Grid>
      </Modal>

      <Grid>
        <Grid.Col span={{ sm: 12 }}>
          {loadingNote || !note ? (
            <Loader />
          ) : (
            <Title order={1}>{getTitle(note)}</Title>
          )}
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <Text>{statusMessage()}</Text>
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <Group>
            {status === "Draft"} {<Button>Schedule</Button>}
            <Button
              color="red"
              onClick={() => {
                setDeleting(true);
              }}
            >
              Delete
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <Divider my={"md"} />
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
