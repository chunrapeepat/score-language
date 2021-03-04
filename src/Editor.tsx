import React, { useState } from "react";

function Editor() {
  const [code, setCode] = useState<string>("");

  const handleSubmit = () => {
    console.log("code =", code);
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
