import React, { useState } from "react";
import Joyride from "react-joyride";
import NaverMapComponent from "./components/NaverMapComponent";
import { TopPanel } from "./components/TopPanel";
import { InfoPanel } from "./components/InfoPanel";

const App = () => {
  const [run, setRun] = useState(true);
  const [showDEM, setShowDEM] = useState(false);
  const [showWatershed, setShowWatershed] = useState(false);
  const [showPollution, setShowPollution] = useState(false);
  const [showTerrain, setShowTerrain] = useState(false);

  const steps = [
    // {
    //   target: ".top-toggle-buttons",
    //   content: "상단 기능 버튼들입니다. 수질 예측 또는 주제도 기능을 선택하세요.",
    // },
    {
      target: ".top-toggle-buttons", // ✅ 상단 전체 버튼 영역
      content: "DEM과 오염원 보기, 위성 지도 기능을 선택할 수 있어요.",
      placement: "bottom",
      spotlightPadding: 20, // 옵션: 영역을 더 넓게 강조하고 싶을 때
    },
    {
      target: ".weather-form",
      content: "여기에 날씨 데이터를 입력해주세요.",
    },
    {
      target: "#map",
      content: "지도를 확대하거나 마커를 클릭해 정보를 확인할 수 있습니다.",
    },
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Joyride
        steps={steps}
        run={run}
        showSkipButton
        showProgress
        continuous
        styles={{
          options: {
            primaryColor: "#007bff",     // ⬅️ 여기서 Next/Done 버튼 색 변경
            backgroundColor: "#ffffff",
            textColor: "#333333",
            arrowColor: "#ffffff",
            spotlightPadding: 20,
            zIndex: 10000,
          },
        }}
      />

      <NaverMapComponent
        showDEM={showDEM}
        showWatershed={showWatershed}
        showPollution={showPollution}
        showTerrain={showTerrain}
      />

      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1000 }}>
        <TopPanel
          onToggleDEM={setShowDEM}
          onToggleWatershed={setShowWatershed}
          onTogglePollution={setShowPollution}
          onToggleTerrain={setShowTerrain}
        />
      </div>

      <div style={{ position: "absolute", top: 200, left: 20, zIndex: 1000 }}>
        <InfoPanel />
      </div>
    </div>
  );
};

export default App;