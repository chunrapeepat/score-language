import React from "react";
import TextareaEditor from "./TextareaEditor";
import MonacoEditor from "./MonacoEditor";

function App() {
  if (localStorage.getItem("test") === "1") {
    return (
      <div>
        <TextareaEditor />
      </div>
    );
  } else {
    return (
      <div>
        <MonacoEditor />
      </div>
    );
  }
}

export default App;
