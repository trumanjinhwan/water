import React from "react";
import "./TopPanel.css";

export const TopPanel = ({
  onToggleDEM,
  onToggleWatershed,
  onTogglePollution,
  onToggleTerrain,
  showDEM,
  showWatershed,
  showPollution,
  showTerrain,
}) => {
  return (
    <div className="top-panel top-toggle-buttons">
      <div className="top-row">
        <button className="logo-button">
          <img src="/images/wateracle.png" alt="Wateracle 로고" className="logo-image" />
        </button>

        <button className="main-button">Wateracle</button>
        <button className="main-button">주제도 찾기</button>
      </div>

      <div className="features">
        <label className="feature checkbox-dem">
          <input
            type="checkbox"
            checked={showDEM}
            onChange={(e) => onToggleDEM(e.target.checked)}
          />
          DEM 보기
        </label>

        <label className="feature">
          <input
            type="checkbox"
            checked={showPollution}
            onChange={(e) => onTogglePollution(e.target.checked)}
          />
          오염원 보기
        </label>

        <label className="feature">
          <input
            type="checkbox"
            checked={showWatershed}
            onChange={(e) => onToggleWatershed(e.target.checked)}
          />
          하천 유역 보기
        </label>

        <label className="feature">
          <input
            type="checkbox"
            checked={showTerrain}
            onChange={(e) => onToggleTerrain(e.target.checked)}
          />
          위성지도
        </label>
      </div>
    </div>
  );
};
