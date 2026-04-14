import Chat from "./Chat";
import Upload from "./Upload";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>MedGPT Interface</h1>
      <Chat />
      <hr />
      <Upload />
    </div>
  );
}

export default App;