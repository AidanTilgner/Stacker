import {
  Button,
  Container,
  Divider,
  Group,
  Text,
  Title,
  Loader,
} from "@mantine/core";
import { Link, useNavigate } from "react-router";
import useFetch from "../hooks/useFetch";
import { Note } from "../../app/database/models/note";
import { notifications } from "@mantine/notifications";

export default function Home() {
  const navigate = useNavigate();
  const { load: createNote, loading: loadingNewNote } = useFetch<
    Partial<Note>,
    Note
  >({
    url: "/notes",
    method: "POST",
    body: {
      body: "World",
    },
    onSuccess: (data) => {
      notifications.show({
        title: "Note Created",
        message: data.body,
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

  return (
    <Container h={"80vh"}>
      <Title order={1}>Welcome to Stacker</Title>
      <Text c="dimmed">What would you like to do?</Text>
      <Divider my="lg" />
      <Group>
        <Button
          onClick={() => {
            createNote();
          }}
        >
          {loadingNewNote && <Loader size={"xs"} />}
          New Note
        </Button>
        <Link to="/notes">
          <Button variant="light">View Notes</Button>
        </Link>
      </Group>
    </Container>
  );
}
