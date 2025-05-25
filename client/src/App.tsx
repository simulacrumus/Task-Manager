import "./App.css";
import { Header } from "./layouts/Header";
import { Container } from "./layouts/Container";
import { TaskContainer } from "@components/Task/TaskContainer";

function App() {
  return (
    <>
      <Header title="Task Manager" />
      <Container>
        <TaskContainer />
      </Container>
    </>
  );
}

export default App;
