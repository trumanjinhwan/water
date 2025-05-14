import React, { useState } from "react";
import NaverMapComponent from "./components/NaverMapComponent";
import { TopPanel } from "./components/TopPanel";
import { InfoPanel } from "./components/InfoPanel";

const App = () => {
  const [showDEM, setShowDEM] = useState(false);
  const [showWatershed, setShowWatershed] = useState(false);
  const [showPollution, setShowPollution] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <NaverMapComponent
        showDEM={showDEM}
        showWatershed={showWatershed}
        showPollution={showPollution}
      />

      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1000 }}>
        <TopPanel
          onToggleDEM={setShowDEM}
          onToggleWatershed={setShowWatershed}
          onTogglePollution={setShowPollution}
        />
      </div>

      <div style={{ position: "absolute", top: 200, left: 20, zIndex: 1000 }}>
        <InfoPanel />
      </div>
    </div>
  );
};

export default App;