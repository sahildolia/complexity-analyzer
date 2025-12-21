import { useState } from "react";
import { analyzeCode } from "./analyze";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  
  function analyze(code) {
  const result = analyzeCode(code);
  setResult(result);
}
  return (
    <div style={{ padding: 20 }}>
      <h2>Time & Space Complexity Analyzer</h2>

      <textarea
        rows="12"
        cols="80"
        placeholder="Paste your JavaScript code here"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <button onClick={() => analyze(code)}>
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Time:</strong> {result.time}</p>
          <p><strong>Space:</strong> {result.space}</p>
        </div>
      )}
    </div>
  );

}

export default App;
