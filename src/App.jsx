// import { useState } from "react";
// import { analyzeCode } from "./analyze";

// function App() {
//   const [code, setCode] = useState("");
//   const [result, setResult] = useState(null);
  
//   function analyze(code) {
//   const result = analyzeCode(code);
//   setResult(result);
// }
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Time & Space Complexity Analyzer</h2>

//       <textarea
//         rows="12"
//         cols="80"
//         placeholder="Paste your JavaScript code here"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={() => analyze(code)}>
//         Analyze
//       </button>

//       {result && (
//         <div style={{ marginTop: 20 }}>
//           <p><strong>Time:</strong> {result.time}</p>
//           <p><strong>Space:</strong> {result.space}</p>
//         </div>
//       )}
//     </div>
//   );

// }

// export default App;

import { useState } from "react";
import { useComplexityAnalyzer } from "./hooks/useComplexityAnalyzer";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const { analyzeCode } = useComplexityAnalyzer();

  const analyze = (codeStr) => {
    try {
      const output = analyzeCode(codeStr);
      setResult(output);
    } catch (err) {
      setResult({ time: "N/A", space: "N/A", error: err.message });
    }
  };
  const reset = () => {
    
    try {
      setCode("");
    } catch (err) {
      setCode({ time: "N/A", space: "N/A", error: err.message });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Time &amp; Space Complexity Analyzer</h2>
      <textarea
        rows="12"
        cols="80"
        placeholder="Paste your JavaScript code here"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br /><br />
      <button onClick={() => analyze(code)}>Analyze</button>
      <button onClick={() => reset(code)}>Reset</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Time:</strong> {result.time}</p>
          <p><strong>Space:</strong> {result.space}</p>
          {result.error && (
            <p style={{ color: "crimson" }}><strong>Error:</strong> {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;