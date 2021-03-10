import React from "react";
import Editor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

interface CodeEditorProps {
  onChange: (val: string) => void;
}
function CodeEditor({ onChange }: CodeEditorProps) {
  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) => {
    editor.focus();
    onChange(localStorage.getItem("current_code_value") || "");
  };

  const handleChange = (val: string) => {
    localStorage.setItem("current_code_value", val);
    onChange(val);
  };

  return (
    <Editor
      defaultValue={localStorage.getItem("current_code_value") || ""}
      onChange={handleChange}
      editorDidMount={editorDidMount}
      theme="vs-dark"
    />
  );
}

export default CodeEditor;
