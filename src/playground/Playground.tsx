import React, { useState } from "react";
import styled from "styled-components";
import { ScoreEngine } from "../runtime-system/ScoreEngine";
import CodeEditor from "./CodeEditor";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

function Playground() {
  const [code, setCode] = useState<string>("");
  const [errors, setErrors] = useState<any>([]);

  const handleSubmit = () => {
    setErrors([]);
    const engine = new ScoreEngine(code);
    if (!engine.compile()) {
      return setErrors(engine.getErrors());
    }

    engine.execute();
  };

  const handleEditorChange = (val: string) => {
    setCode(val);
  };

  return (
    <>
      <Container>
        <div>
          <h3>Text Editor: (Monaco)</h3>
          <CodeEditor onChange={handleEditorChange} />
        </div>
        <div>
          <h3>Output:</h3>
          <div
            role="region"
            aria-label="output of Development Environment"
            aria-atomic="true"
            aria-live="assertive"
            id="score_runtime_output"
          >
            {errors.length > 0 && (
              <div>
                {errors.map((e: any) => {
                  return (
                    <li style={{ color: "red" }}>
                      {e.name} error: {e.message} at line {e.getLine()}
                    </li>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
      <button style={{ fontSize: 22 }} onClick={handleSubmit}>
        RUN
      </button>
    </>
  );
}

export default Playground;
