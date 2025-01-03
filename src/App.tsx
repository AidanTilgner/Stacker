import { Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import Notes from "./pages/Notes/Index";
import Note from "./pages/Notes/Note";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Notes />} />
        <Route path="/notes">
          <Route path=":id" element={<Note />} />
        </Route>
      </Route>
    </Routes>
  );
}
