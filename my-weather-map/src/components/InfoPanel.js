import React, { useState } from "react";
import image2 from "./svg/image-2.svg";
import image from "./svg/image.svg";
import "./InfoPanel.css";

export const InfoPanel = () => {
  const [isVisible, setIsVisible] = useState(true);

  // 입력값 상태 선언
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windspeed, setWindspeed] = useState("");

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  const handleSubmit = () => {
    // 빈 값 체크
    if (!temperature.trim()) {
      alert("기온을 입력해주세요.");
      document.getElementById("temperature-input").focus();
      return;
    }
    if (!rainfall.trim()) {
      alert("강수량을 입력해주세요.");
      document.getElementById("rainfall-input").focus();
      return;
    }
    if (!humidity.trim()) {
      alert("습도를 입력해주세요.");
      document.getElementById("humidity-input").focus();
      return;
    }
    if (!windspeed.trim()) {
      alert("풍속을 입력해주세요.");
      document.getElementById("windspeed-input").focus();
      return;
    }
  
    // 숫자인지 확인 (NaN 체크)
    if (isNaN(Number(temperature))) {
      alert("기온을 숫자로 입력하세요.");
      setTemperature("");
      document.getElementById("temperature-input").focus();
      return;
    }
    if (isNaN(Number(rainfall))) {
      alert("강수량을 숫자로 입력하세요.");
      setRainfall("");
      document.getElementById("rainfall-input").focus();
      return;
    }
    if (isNaN(Number(humidity))) {
      alert("습도을 숫자로 입력하세요.");
      setHumidity("");
      document.getElementById("humidity-input").focus();
      return;
    }
    if (isNaN(Number(windspeed))) {
      alert("풍속을 숫자로 입력하세요.");
      setWindspeed("");
      document.getElementById("windspeed-input").focus();
      return;
    }
  
    // 유효성 통과 시 로그 출력
    console.log(`
                 기온: ${temperature}
                 강수량: ${rainfall}
                 습도: ${humidity}
                 풍속: ${windspeed}`);
  };
  

  return (
    <div className="box">
      <div className="panel-wrapper">
        {isVisible && (
          <div className="div">
            <div className="text-wrapper">날씨 정보 입력</div>
            <img className="image" alt="Image" src={image2} />

            <div className="view-2">
              <div className="overlap-group">
                <div className="element">
                  <input
                    id="temperature-input"
                    type="text"
                    className="view-3"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                  <div className="text-wrapper-2">기온</div>
                </div>
                <div className="text-wrapper-3">℃</div>
              </div>

              <div className="element-2">
                <input
                  id="rainfall-input"
                  type="text"
                  className="view-3"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                />
                <div className="text-wrapper-2">강수량</div>
              </div>

              <div className="element-3">
                <input
                  id="humidity-input"
                  type="text"
                  className="view-3"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                />
                <div className="text-wrapper-2">습도</div>
              </div>

              <div className="overlap">
                <div className="element">
                  <input
                    id="windspeed-input"
                    type="text"
                    className="view-3"
                    value={windspeed}
                    onChange={(e) => setWindspeed(e.target.value)}
                  />
                  <div className="text-wrapper-2">풍속</div>
                </div>
                <div className="text-wrapper-4">m/s</div>
              </div>

              <div className="text-wrapper-5">mm</div>
              <div className="text-wrapper-6">%</div>

              <button className="submit-button" onClick={handleSubmit}>
                입력하기
              </button>
            </div>
          </div>
        )}

        <div
          className="image-wrapper"
          style={{
            left: isVisible ? "258px" : "-30px",
            top: 80
          }}
        >
          <button onClick={togglePanel}>
            <img
              className={`img ${isVisible ? "open" : "closed"}`}
              alt="Toggle"
              src={image}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
