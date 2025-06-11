import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import SearchPage from "./components/SearchPage";
import TimelinePage from "./components/TimelinePage";
import NetworkPage from "./components/NetworkPage";
import "./App.css";

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/person/:id" element={<TimelinePage />} />
            <Route path="/network/:id" element={<NetworkPage />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
