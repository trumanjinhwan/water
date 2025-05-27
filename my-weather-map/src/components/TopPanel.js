import React, { useState } from "react";
import "./TopPanel.css";

export const TopPanel = ({ onToggleDEM, onToggleWatershed, onTogglePollution, onToggleTerrain }) => {
  const [showDEM, setShowDEM] = useState(false);
  const [showWatershed, setShowWatershed] = useState(false);
  const [showPollution, setShowPollution] = useState(false);
  const [showTerrain, setShowTerrain] = useState(false);

  return (
    <div className="top-panel top-toggle-buttons">
      <div className="top-row">
        <button className="logo-button">
          <div className="circle" />
          로고
        </button>
        <button className="main-button">수질예측시스템</button>
        <button className="main-button">주제도 찾기</button>
      </div>

      <div className="features">
        <label className="feature checkbox-dem"> {/* ✅ 클래스 위치 변경 */}
          <input
            type="checkbox"
            checked={showDEM}
            onChange={(e) => {
              setShowDEM(e.target.checked);
              onToggleDEM(e.target.checked);
            }}
          />
          DEM 보기
        </label>


        <label className="feature">
          <input
            type="checkbox"
            checked={showPollution}
            onChange={(e) => {
              const checked = e.target.checked;
              setShowPollution(checked);
              onTogglePollution(checked);
              if (checked) {
                setShowWatershed(true);
                onToggleWatershed(true);
              } else {
                setShowWatershed(false);
                onToggleWatershed(false);
              }
            }}
          />
          오염원 보기
        </label>

        <label className="feature">
          <input
            type="checkbox"
            checked={showTerrain}
            onChange={(e) => {
              setShowTerrain(e.target.checked);
              onToggleTerrain(e.target.checked);
            }}
          />
          위성지도
        </label>
      </div>
    </div>
  );
};