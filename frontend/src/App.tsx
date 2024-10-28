import React from "react";
import Header from "./components/common/Header";

import spider from "./assets/spider.png";
import { Route, Routes } from "react-router-dom";
import CharacterList from "./components/CharacterList";
import CharacterDetails from "./components/CharacterDetails";

const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#000", color: "#f00", minHeight: "100vh", position: "relative" }}>
      <Header />
      <img
        src={spider}
        alt="Small Description"
        style={{
          position: "absolute",
          left: "2%",
          maxWidth: "30px",
        }}
      />
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/character/:nickname" element={<CharacterDetails />} />
      </Routes>
    </div>
  );
};

export default App;
