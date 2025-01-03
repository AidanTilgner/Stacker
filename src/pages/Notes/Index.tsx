import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Grid,
  Group,
  Modal,
  SegmentedControl,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Note } from "../../../app/database/models/note";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Code,
  Copy,
  Eye,
  TrashSimple,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router";
import {
  getTitle,
  htmlToMarkdown,
  noteStatus,
} from "../../library/utils/notes";
import { prettyDateTime } from "../../library/utils/dates";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";

export default function Index() {
  const navigate = useNavigate();
  const { load: createNote, loading: loadingNewNote } = useFetch<
    Partial<Note>,
    Note
  >({
    url: "/notes",
    method: "POST",
    body: {
      body: "This is a brand new note with wonderful potential.",
    },
    onSuccess: (data) => {
      notifications.show({
        title: "Note Created",
        message: "Note created successfully",
        color: "blue",
      });
      navigate(`/notes/${data.id}`);
    },
    onError: (error) => {
      console.error(error);
      notifications.show({
        title: "Failed to Create Note",
        message: "Failed to create note",
        color: "red",
      });
    },
  });

  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const { load: deleteNote } = useFetch<undefined, Note>({
    url: `/notes/${deletingNote?.id}`,
    method: "DELETE",
    onSuccess: () => {
      notifications.show({
        title: "Note Deleted",
        message: "Note deleted successfully",
        color: "red",
      });
      reloadNotes();
    },
    onError: () => {
      notifications.show({
        title: "Failed to Delete Note",
        message: "Failed to delete note",
        color: "red",
      });
    },
    dependencies: [deletingNote],
  });

  useEffect(() => {
    if (deletingNote) {
      openConfirmModal({
        title: "Delete Note",
        children: "Are you sure you want to delete this note?",
        onConfirm: () => {
          deleteNote();
        },
        onCancel: () => {
          setDeletingNote(null);
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
  }, [deletingNote]);

  const { data: notes, load: reloadNotes } = useFetch<undefined, Note[]>({
    url: "/notes",
    runOnMount: true,
  });

  const scheduledNotes = notes?.filter((note) => note.scheduledAt);
  const postedNotes = notes?.filter((note) => note.postedAt);

  const [sort, setSort] = useState<"all" | "scheduled" | "posted">("all");

  const notesToDisplay = () => {
    switch (sort) {
      case "all":
        return notes;
      case "scheduled":
        return scheduledNotes;
      case "posted":
        return postedNotes;
    }
  };

  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  return (
    <div>
      <Modal
        opened={!!viewingNote}
        onClose={() => {
          setViewingNote(null);
        }}
        title="Viewing Note"
      >
        {!viewingNote ? (
          <Text>Nothing to see here...</Text>
        ) : (
          <Grid>
            <Grid.Col>{getTitle(viewingNote)}</Grid.Col>
            <Grid.Col>
              <Card radius="md" shadow="md" withBorder>
                <Text
                  dangerouslySetInnerHTML={{
                    __html: viewingNote.body,
                  }}
                />
              </Card>
            </Grid.Col>
            <Grid.Col span={{ sm: 12 }}>
              <Group>
                <Link to={`/notes/${viewingNote.id}`} title="Edit Note">
                  <ActionIcon color="blue">
                    <ArrowRight weight="bold" />
                  </ActionIcon>
                </Link>
                <ActionIcon color="red" title="Delete Note">
                  <TrashSimple weight="bold" />
                </ActionIcon>
                <CopyButton value={htmlToMarkdown(viewingNote.body)}>
                  {({ copied, copy }) => {
                    return (
                      <ActionIcon
                        color={copied ? "green" : "cyan"}
                        onClick={copy}
                        title="Copy Note"
                      >
                        {copied ? (
                          <Check weight="bold" />
                        ) : (
                          <Copy weight="bold" />
                        )}
                      </ActionIcon>
                    );
                  }}
                </CopyButton>
                <CopyButton value={htmlToMarkdown(viewingNote.body)}>
                  {({ copied, copy }) => {
                    return (
                      <ActionIcon
                        color={copied ? "green" : "cyan"}
                        onClick={copy}
                        title="Copy Note"
                      >
                        {copied ? (
                          <Check weight="bold" />
                        ) : (
                          <Code weight="bold" />
                        )}
                      </ActionIcon>
                    );
                  }}
                </CopyButton>
              </Group>
            </Grid.Col>
          </Grid>
        )}
      </Modal>

      <Group justify="space-between">
        <Title>{sort.toLocaleUpperCase()} NOTES</Title>
        <Button
          onClick={() => {
            createNote();
          }}
        >
          {loadingNewNote ? "Creating Note..." : "New Note"}
        </Button>
      </Group>
      <Space my="md" mb="lg" />
      <SegmentedControl
        data={[
          {
            value: "all",
            label: "All",
          },
          {
            value: "scheduled",
            label: "Scheduled",
          },
          {
            value: "posted",
            label: "Posted",
          },
        ]}
        value={sort}
        onChange={(v) => setSort(v as "all" | "scheduled" | "posted")}
      />
      <Space my="md" />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Body</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>When</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notesToDisplay()?.map((note) => (
            <Table.Tr key={note.id}>
              <Table.Td
                dangerouslySetInnerHTML={{
                  __html: note.body,
                }}
              />
              <Table.Td>{noteStatus(note)}</Table.Td>
              <Table.Td>
                {note.scheduledAt
                  ? prettyDateTime(note.scheduledAt)
                  : note.postedAt
                    ? prettyDateTime(note.postedAt)
                    : "N/A"}
              </Table.Td>
              <Table.Td>
                <Group>
                  <ActionIcon
                    onClick={() => {
                      setViewingNote(note);
                    }}
                    title="View Note"
                    variant="light"
                  >
                    <Eye weight="bold" />
                  </ActionIcon>
                  <Link to={`/notes/${note.id}`} title="Edit Note">
                    <ActionIcon color="blue">
                      <ArrowRight weight="bold" />
                    </ActionIcon>
                  </Link>
                  <ActionIcon
                    color="red"
                    title="Delete Note"
                    onClick={() => {
                      setDeletingNote(note);
                    }}
                  >
                    <TrashSimple weight="bold" />
                  </ActionIcon>
                  <CopyButton value={note.body}>
                    {({ copied, copy }) => {
                      return (
                        <ActionIcon
                          color={copied ? "green" : "cyan"}
                          onClick={copy}
                          title="Copy Note"
                        >
                          {copied ? (
                            <Check weight="bold" />
                          ) : (
                            <Copy weight="bold" />
                          )}
                        </ActionIcon>
                      );
                    }}
                  </CopyButton>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
