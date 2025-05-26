import React, { useState } from "react";
import "./TopPanel.css";

export const TopPanel = ({ onToggleDEM, onToggleWatershed, onTogglePollution, onToggleTerrain }) => {
  const [showDEM, setShowDEM] = useState(false);
  const [showWatershed, setShowWatershed] = useState(false);
  const [showPollution, setShowPollution] = useState(false);
  const [showTerrain, setShowTerrain] = useState(false);

  return (
    <div className="top-panel">
      <div className="top-row">
        <button className="logo-button">
          <div className="circle" />
          로고
        </button>
        <button className="main-button">수질예측시스템</button>
        <button className="main-button">주제도 찾기</button>
      </div>

      <div className="search-row">
        <select className="dropdown">
          <option>주제도</option>
        </select>
        <div className="search-icon" />
      </div>

      <div className="features">
        <label className="feature">
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

              // ✅ 함께 유역도 활성화
              if (checked) {
                setShowWatershed(true);
                onToggleWatershed(true);
              }

              // 오염원 끄면 유역도도 같이 끔
              if (!checked) {
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
