import Chat from "./Chat";
import Upload from "./Upload";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>NER disease detection web Interface</h1>
      <Chat />
      <hr />
      <Upload />
    </div>
  );
}

export default App;