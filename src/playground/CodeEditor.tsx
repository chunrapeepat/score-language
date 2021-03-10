import React from "react";
import Editor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

interface CodeEditorProps {
  onChange: (val: string) => void;
  onRun: (code: string) => void;
}
function CodeEditor({ onChange, onRun }: CodeEditorProps) {
  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    editor.focus();
    editor.updateOptions({ fontSize: 22 });
    editor.addAction({
      id: "run",
      label: "run the code",
      keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.Enter],
      run: (ed) => onRun(ed.getValue()),
    });

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
