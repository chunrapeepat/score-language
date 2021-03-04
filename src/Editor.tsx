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
    </div>
  );
}

export default Editor;
