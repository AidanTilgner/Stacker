import {
  ActionIcon,
  Divider,
  SegmentedControl,
  Table,
  Title,
} from "@mantine/core";
import { Note } from "../../../app/database/models/note";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router";

export default function Index() {
  const { data: notes } = useFetch<undefined, Note[]>({
    url: "/notes",
    runOnMount: true,
  });

  console.log("Notes: ", notes);

  const [sort, setSort] = useState<"all" | "scheduled" | "posted">("all");

  const noteStatus = (note: Note) => {
    if (note.postedAt) {
      return "Posted";
    } else if (note.scheduledAt) {
      return "Scheduled";
    } else {
      return "Draft";
    }
  };

  return (
    <div>
      <Title>All Notes</Title>
      <br />
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
      />
      <Divider my="lg" />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Id</Table.Th>
            <Table.Th>Body</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notes?.map((note) => (
            <Table.Tr key={note.id}>
              <Table.Td>{note.id}</Table.Td>
              <Table.Td
                dangerouslySetInnerHTML={{
                  __html: note.body,
                }}
              />
              <Table.Td>{noteStatus(note)}</Table.Td>
              <Table.Td>
                <Link to={`/notes/${note.id}`}>
                  <ActionIcon color="blue">
                    <ArrowRight weight="bold" />
                  </ActionIcon>
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
