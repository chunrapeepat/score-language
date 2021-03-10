import React, { useState } from "react";
import styled from "styled-components";
import { ScoreEngine } from "../runtime-system/ScoreEngine";
import CodeEditor from "./CodeEditor";

const Container = styled.div`
  display: grid;
  grid-template-columns: 70vw 30vw;
  height: 100vh;
`;
const ResultHeader = styled.h3`
  margin: 0;
  color: white;
  background: #272b2f;
  padding: 10px 15px;
`;
const Output = styled.div`
  font-size: 1.2rem;
  padding: 10px 15px;
  overflow-y: auto;
  height: calc(100vh - 42px);
`;

function Playground() {
  const [code, setCode] = useState<string>("");
  const [errors, setErrors] = useState<any>([]);

  const handleRun = () => {
    _handleRun(code);
  };
  const _handleRun = (code: string) => {
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
          <CodeEditor onRun={_handleRun} onChange={handleEditorChange} />
        </div>
        <div>
          <ResultHeader>Result</ResultHeader>

          <Output
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
          </Output>
        </div>
      </Container>
    </>
  );
}

export default Playground;
