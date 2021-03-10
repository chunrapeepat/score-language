import React, { useState } from "react";
import styled from "styled-components";
import { ScoreEngine } from "../runtime-system/ScoreEngine";
import CodeEditor from "./CodeEditor";

const Navbar = styled.div`
  height: 55px;
  background: #3a3f43;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Logo = styled.div`
  background: #f65b02;
  height: 55px;
  display: flex;
  align-items: center;
  padding: 0 15px;

  & h1 {
    margin: 0;
    color: white;
    font-size: 1.4rem;
  }
`;
const Container = styled.div`
  display: grid;
  grid-template-columns: 70vw 30vw;
  height: calc(100vh - 42px - 55px);
`;
const Header = styled.h3`
  margin: 0;
  color: white;
  background: #272b2f;
  padding: 10px 15px;
`;
const Output = styled.div`
  font-size: 1.2rem;
  padding: 10px 15px;
  overflow-y: auto;
  height: calc(100vh - 42px - 55px);
`;
const RunButton = styled.button`
  color: white;
  border: 0;
  background: #1e1e1e;
  font-size: 1.2rem;
  margin-right: 20px;
  font-weight: bold;
  cursor: pointer;
  padding: 7px 15px;
  border-radius: 5rem;
  outline: none;
`;

function Playground() {
  const [code, setCode] = useState<string>("");
  const [errors, setErrors] = useState<any>([]);

  const handleRun = (code: string) => {
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
      <Navbar>
        <Logo>
          <h1>The Score Programming Language</h1>
        </Logo>
        <div>
          <RunButton onClick={() => handleRun(code)}>RUN CODE</RunButton>
        </div>
      </Navbar>
      <Container>
        <div>
          <Header>Code Editor</Header>

          <CodeEditor onRun={handleRun} onChange={handleEditorChange} />
        </div>
        <div>
          <Header>Result</Header>

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
