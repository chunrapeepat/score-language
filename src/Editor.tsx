import React, { useState } from "react";
import { ScoreEngine } from "./runtime-system/ScoreEngine";

function Editor() {
  const [code, setCode] = useState<string>("");

  const handleSubmit = () => {
    const engine = new ScoreEngine(code);
    if (!engine.compile()) {
      return console.error(engine.getErrors());
    }

    engine.execute();
  };

  return (
    <div>
      <textarea
        cols={30}
        rows={10}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>RUN</button>

      <hr />
      <h3>Output:</h3>
      <div id="score_runtime_output" />
    </div>
  );
}

export default Editor;
