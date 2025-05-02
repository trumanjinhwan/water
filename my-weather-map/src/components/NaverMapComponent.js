import React, { useEffect, useRef, useState, useCallback } from "react";

const NaverMapComponent = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const currentLineRef = useRef(null);
  const mapRef = useRef(null);

  //하천과의 거리계산
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  //가까운 하천이 한 지점 찾기 
  const findClosestPoint = useCallback((markerPos, geojson) => {
    let minDist = Infinity;
    let closestPoint = { lat: null, lng: null };

    geojson.features.forEach((feature) => {
      const geometry = feature.geometry;

      const checkCoords = (coords) => {
        coords.forEach(([lng, lat]) => {
          const dist = calculateDistance(
            markerPos.lat(),
            markerPos.lng(),
            lat,
            lng
          );
          if (dist < minDist) {
            minDist = dist;
            closestPoint = { lat, lng };
          }
        });
      };

      if (geometry.type === "Polygon") {
        checkCoords(geometry.coordinates[0]);
      } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => checkCoords(polygon[0]));
      }
    });

    return closestPoint;
  }, []);

  useEffect(() => {
    const loadMapAndGeoJson = async () => {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(37.926, 127.75),
        zoom: 13,
      });
      mapRef.current = map;

      try {
        const res = await fetch("/data/clip2.geojson");
        const geojson = await res.json();
        setGeoJsonData(geojson);

        for (const feature of geojson.features) {
          const geometry = feature.geometry;

          const drawPolygon = (coords) => {
            const paths = coords.map(
              ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
            );

            new window.naver.maps.Polygon({
              map,
              paths,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#880000",
              fillOpacity: 0.4,
            });
          };

          if (geometry.type === "Polygon") {
            drawPolygon(geometry.coordinates[0]);
          } else if (geometry.type === "MultiPolygon") {
            for (const polygon of geometry.coordinates) {
              drawPolygon(polygon[0]);
            }
          }
        }
      } catch (err) {
        console.error("❌ 하천구역 로딩 실패:", err);
      }
    };

    loadMapAndGeoJson();
  }, []);

  useEffect(() => {
    const loadMarkers = async () => {
      if (!geoJsonData || !mapRef.current) return;

      try {
        const res = await fetch("http://localhost:8080/pollution-sources");
        const data = await res.json();

        for (const place of data) {
          const markerPosition = new window.naver.maps.LatLng(
            place.web_bplc_x_katec,
            place.web_bplc_y_katec
          );

          const marker = new window.naver.maps.Marker({
            position: markerPosition,
            map: mapRef.current,
            title: place.bsnm_nm,
          });

          const infoWindow = new window.naver.maps.InfoWindow();

          window.naver.maps.Event.addListener(marker, "click", () => {
            console.log("마커 클릭 이벤트 발생");
            //가까운 하천이 한 지점
            const closest = findClosestPoint(markerPosition, geoJsonData);
            //하천과의 거리
            const distance = calculateDistance(
              markerPosition.lat(),
              markerPosition.lng(),
              closest.lat,
              closest.lng
            );

            console.log("📍 마커 위치:", markerPosition.lat(), markerPosition.lng());
            console.log("📌 가장 가까운 하천 경계점:", closest.lat, closest.lng);
            console.log("📏 계산된 거리:", distance, "미터");

            if (!closest.lat || !closest.lng || isNaN(distance)) {
              console.warn("❗ 유효하지 않은 거리 또는 좌표입니다.");
              return;
            }

            if (currentLineRef.current) {
              currentLineRef.current.setMap(null);
            }

            currentLineRef.current = new window.naver.maps.Polyline({
              map: mapRef.current,
              path: [
                markerPosition,
                new window.naver.maps.LatLng(closest.lat, closest.lng),
              ],
              strokeColor: "#00FF00",
              strokeOpacity: 0.9,
              strokeWeight: 2,
            });

            const infoHtml = `
              <div style="padding:8px">
                <strong>${place.bsnm_nm}</strong><br/>
                ${place.bsns_detail_road_addr}<br/>
                ${place.induty_nm}<br/>
                거리: ${Math.round(distance)} 미터
              </div>`;
            infoWindow.setContent(infoHtml);
            infoWindow.open(mapRef.current, marker);
          });
        }
      } catch (err) {
        console.error("❌ 오염원 API 호출 에러:", err);
      }
    };

    loadMarkers();
  }, [geoJsonData, findClosestPoint]);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
};

export default NaverMapComponent;
