import { BrowserRouter } from "react-router-dom";
import "./App.css";
import BasicRoute from "./routes/BasicRoute";
import AIWidget from "./components/AIWidget";

function App() {
  return (
    <BrowserRouter>
      <BasicRoute />
      <AIWidget />
    </BrowserRouter>
  );
}

export default App;
