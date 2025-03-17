import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Leaflet 기본 마커 아이콘 설정
const DefaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ✅ 오염률에 따라 원(Circle) 색상 변경
const getPollutionColor = (level) => {
  if (level === undefined || level === null || isNaN(level)) return "green";
  const pollution = parseFloat(level);

  if (pollution === 0) return "green"; // ✅ 오염률 0 → 초록색
  if (pollution > 75) return "red";    // 🔴 심각한 오염 (75% 이상)
  if (pollution > 50) return "orange"; // 🟠 중간 오염 (50~75%)
  if (pollution > 25) return "yellow"; // 🟡 경미한 오염 (25~50%)
  return "green";
};

// ✅ 서울 주요 강/하천 위치 데이터 (위도/경도, 오염률)
const riverPollutionData = [
  { id: 1, name: "마포대교", latitude: 37.5396, longitude: 126.9452, pollution_level: 70.5 },
  { id: 2, name: "한강철교", latitude: 37.5194, longitude: 126.9635, pollution_level: 50.2 },
  { id: 3, name: "성산대교", latitude: 37.5491, longitude: 126.9026, pollution_level: 30.8 },
  { id: 4, name: "동작대교", latitude: 37.5092, longitude: 126.9803, pollution_level: 10.3 },
  { id: 5, name: "잠실대교", latitude: 37.5218, longitude: 127.1030, pollution_level: 5.6 },
];

const MapComponent = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    setWeatherData(riverPollutionData);
  }, []);

  return (
    <MapContainer center={[37.541, 126.986]} zoom={12} style={{ height: "600px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {weatherData.map((data, index) => (
        <>
          {/* ✅ 강/하천에 마커 추가 */}
          <Marker 
            key={index} 
            position={[data.latitude, data.longitude]} 
            icon={DefaultIcon}  
          >
            <Popup>
              📍 {data.name} <br />
              💧 오염률: {data.pollution_level.toFixed(1)}%
            </Popup>
          </Marker>

          {/* ✅ 오염률을 원(Circle)으로 시각화 */}
          <Circle
            center={[data.latitude, data.longitude]}
            radius={data.pollution_level * 10} // 오염률에 따라 반경 조정
            color={getPollutionColor(data.pollution_level)}
            fillColor={getPollutionColor(data.pollution_level)}
            fillOpacity={0.5}
          />
        </>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
