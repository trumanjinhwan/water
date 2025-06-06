  import React, { useState } from "react";
  import image2 from "./svg/image-2.svg";
  import image from "./svg/image.svg";
  import "./InfoPanel.css";

  export const InfoPanel = ({ setDeltaC }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [temperature, setTemperature] = useState("");
    const [rainfall, setRainfall] = useState("");
    const [humidity, setHumidity] = useState("");
    const [windspeed, setWindspeed] = useState("");
    const [discharge, setDischarge] = useState(""); // 유출량(Q)

    const togglePanel = () => {
      setIsVisible(!isVisible);
    };

    const handleSubmit = () => {
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
      if (!discharge.trim()) {
        alert("유출량을 입력해주세요.");
        document.getElementById("discharge-input").focus();
        return;
      }

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
        alert("습도를 숫자로 입력하세요.");
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
      if (isNaN(Number(discharge))) {
        alert("유출량을 숫자로 입력하세요.");
        setDischarge("");
        document.getElementById("discharge-input").focus();
        return;
      }

      const ΔC = 0.12 * Number(rainfall)
              + 0.06 * Number(temperature)
              - 0.015 * Number(humidity)
              + 0.05 * Number(windspeed)
              + Number(discharge);
              
      console.log("📌 계산된 ΔC:", ΔC); // ✅ 이 줄 추가
      setDeltaC(ΔC); // 💡 App.js의 상태 업데이트
    };

    return (
      <div className="box">
        <div className="panel-wrapper">
          {isVisible && (
            <div className="div weather-form">
              <div className="text-wrapper">날씨 정보 입력</div>
              <img className="image" alt="Image" src={image2} />

              <div className="view-2">
                <div className="overlap-group">
                  <div className="element">
                    <input id="temperature-input" type="text" className="view-3" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
                    <div className="text-wrapper-2">기온</div>
                  </div>
                  <div className="text-wrapper-3">℃</div>
                </div>

                <div className="element-2">
                  <input id="rainfall-input" type="text" className="view-3" value={rainfall} onChange={(e) => setRainfall(e.target.value)} />
                  <div className="text-wrapper-2">강수량</div>
                  <div className="text-wrapper-5">mm</div>
                </div>

                <div className="element-3">
                  <input id="humidity-input" type="text" className="view-3" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
                  <div className="text-wrapper-2">습도</div>
                  <div className="text-wrapper-6">%</div>
                </div>

                <div className="overlap">
                  <div className="element">
                    <input id="windspeed-input" type="text" className="view-3" value={windspeed} onChange={(e) => setWindspeed(e.target.value)} />
                    <div className="text-wrapper-2">풍속</div>
                  </div>
                  <div className="text-wrapper-4">m/s</div>
                </div>

                <div className="element-4">
                  <input id="discharge-input" type="text" className="view-3" value={discharge} onChange={(e) => setDischarge(e.target.value)} />
                  <div className="text-wrapper-2">유출량</div>
                </div>
                <div className="text-wrapper-7">kg</div>

                {/* <div className="text-wrapper-5">mm</div>
                <div className="text-wrapper-6">%</div> */}

                <button className="submit-button" onClick={handleSubmit}>입력하기</button>
              </div>
            </div>
          )}

          <div className="image-wrapper" style={{ left: isVisible ? "258px" : "-30px", top: "30px" }}>
            <button onClick={togglePanel}>
              <img className={`img ${isVisible ? "open" : "closed"}`} alt="Toggle" src={image} />
            </button>
          </div>
        </div>
      </div>
    );
  };
