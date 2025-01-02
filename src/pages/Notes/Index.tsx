import { Note } from "../../../app/database/models/note";
import useFetch from "../../hooks/useFetch";

export default function Index() {
  const { data: notes } = useFetch<undefined, Note[]>({
    url: "/notes",
    runOnMount: true,
  });

  console.log("Notes: ", notes);

  return (
    <div>
      <h1>Notes</h1>
    </div>
  );
}
