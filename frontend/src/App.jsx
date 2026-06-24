import { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const data = input
        .split("\n")
        .map(item => item.trim())
        .filter(item => item);

      const response = await axios.post(
        "https://bajajwork.onrender.com/bfhl",
        { data }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("API Error");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>BFHL Challenge</h1>

      <textarea
        rows="10"
        cols="50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter one edge per line"
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Submit
      </button>

      <hr />

      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default App;