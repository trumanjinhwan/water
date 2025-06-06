import React, { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";

const NaverMapComponent = ({ showDEM, showWatershed, showPollution, showTerrain, deltaC }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [watershedPolygons, setWatershedPolygons] = useState([]);
  const [pollutionMarkers, setPollutionMarkers] = useState([]);
  const [demOverlay, setDemOverlay] = useState(null);
  const currentLineRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  // 🔽 컴포넌트 최상단에 추가
  const watershedCirclesRef = useRef([]);

  const MAX_DELTA_C = 25;

  const getPollutionRatePercent = (deltaC) => {
    return Math.min((deltaC / MAX_DELTA_C) * 100, 100);
  };

  const getPolylineColorByPollution = (percent) => {
    if (percent >= 91) return "#FF0000";
    if (percent >= 71) return "#FF8000";
    if (percent >= 51) return "#00AA00";
    if (percent >= 30) return "#00CFFF";
    return "#AAAAAA";
  };

  useEffect(() => {
    console.log("\ud83d\udce1 NaverMapComponent\uc5d0\uc11c \ubc1b\uc740 deltaC:", deltaC);
  }, [deltaC]);

  useEffect(() => {
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.926, 127.75),
      zoom: 13,
      mapTypeId: window.naver.maps.MapTypeId.NORMAL,
    });
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setMapTypeId(
      showTerrain ? window.naver.maps.MapTypeId.HYBRID : window.naver.maps.MapTypeId.NORMAL
    );
  }, [showTerrain]);

  useEffect(() => {
    const drawWatershed = async () => {
      if (!mapRef.current) return;
      if (watershedPolygons.length > 0) {
        watershedPolygons.forEach((poly) => {
          poly.setOptions({
            fillOpacity: showWatershed ? 0.3 : 0.0,
            strokeOpacity: showWatershed ? 0.8 : 0.0,
          });
        });
        return;
      }

      try {
        const res = await fetch("/data/clip.geojson");
        const geojson = await res.json();
        setGeoJsonData(geojson);

        const newPolygons = geojson.features.map((feature) => {
          const coords =
            feature.geometry.type === "Polygon"
              ? feature.geometry.coordinates[0]
              : feature.geometry.coordinates[0][0];

          const path = coords.map(
            ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
          );

          return new window.naver.maps.Polygon({
            map: mapRef.current,
            paths: path,
            strokeColor: "#8000FF",
            strokeOpacity: showWatershed ? 0.8 : 0.0,
            strokeWeight: 2,
            fillColor: "#A56AFF",
            fillOpacity: showWatershed ? 0.3 : 0.0,
          });
        });

        setWatershedPolygons(newPolygons);
      } catch (err) {
        console.error("\u274c clip.geojson \ub85c\ub4dc \uc2e4\ud328:", err);
      }
    };

    drawWatershed();
  }, [showWatershed]);

  useEffect(() => {
    const loadMarkers = async () => {
      if (!mapRef.current) return;

      if (!showPollution) {
        pollutionMarkers.forEach((marker) => marker.setMap(null));
        setPollutionMarkers([]);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/pollution-sources");
        const data = await res.json();
        const newMarkers = [];

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

          window.naver.maps.Event.addListener(marker, "click", async () => {

            // 📌 ΔC 미입력 시 알림 후 조기 반환
            if (deltaC === null) {
              alert("변인들을 먼저 입력해주십시오.");
              return;
            }

            // ✅ 항상 실행되는 초기화 코드
            if (currentLineRef.current) {
              currentLineRef.current.setMap(null);
              currentLineRef.current = null;
            }
            if (watershedCirclesRef.current) {
              watershedCirclesRef.current.forEach(c => c.setMap(null));
              watershedCirclesRef.current = [];
            }
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }

            try {
              const res = await fetch(`/data/flow/flow_path_${place.id}.geojson`);
              const flowGeojson = await res.json();

              const coords = flowGeojson.features[0].geometry.coordinates.map(
                ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
              );

              let intersects = false;
              let strokeColor = "#AAAAAA";
              let pollutionPercent = 0;

              if (geoJsonData) {
                const polygon = turf.featureCollection(geoJsonData.features);
                const line = turf.lineString(flowGeojson.features[0].geometry.coordinates);
                intersects = turf.booleanIntersects(polygon, line);

                if (intersects && deltaC !== null) {
                  pollutionPercent = getPollutionRatePercent(deltaC);
                  strokeColor = getPolylineColorByPollution(pollutionPercent);
                }

                // 🔽 마커 클릭 이벤트 내부 try 블록 안 intersect 검사 이후에 추가
                if (intersects && deltaC !== null) {
                  pollutionPercent = getPollutionRatePercent(deltaC);
                  strokeColor = getPolylineColorByPollution(pollutionPercent);

                  let invalidGeometryCount = 0;

                  geoJsonData.features.forEach((feature) => {
                    const geometry = feature.geometry;
                    if (!geometry || geometry.coordinates.length === 0) return;

                    let polygons = [];

                    if (geometry.type === "Polygon") {
                      polygons = [geometry.coordinates];
                    } else if (geometry.type === "MultiPolygon") {
                      polygons = geometry.coordinates;
                    } else {
                      return; // Unknown geometry type → skip
                    }

                    polygons.forEach((polyCoords) => {
                      const poly = turf.polygon(polyCoords);
                      const intersections = turf.lineIntersect(poly, line);

                      // ✅ 모든 교차점에 원을 그림
                      intersections.features.forEach((pt) => {
                        const [lng, lat] = pt.geometry.coordinates;
                        const centerLatLng = new window.naver.maps.LatLng(lat, lng);

                        const circle = new window.naver.maps.Circle({
                          map: mapRef.current,
                          center: centerLatLng,
                          radius: 300,
                          strokeColor: strokeColor,
                          strokeOpacity: 1,
                          strokeWeight: 1.5,
                          fillColor: strokeColor,
                          fillOpacity: 0.3,
                        });

                        watershedCirclesRef.current.push(circle);
                      });
                    });
                  });



                  // ✅ 최종 통계 출력
                  if (invalidGeometryCount > 0) {
                    console.warn(`⚠️ 총 ${invalidGeometryCount}개의 유효하지 않은 geometry가 존재합니다.`);
                  }

                }
              }

              const polyline = new window.naver.maps.Polyline({
                map: mapRef.current,
                path: coords,
                strokeColor: strokeColor,
                strokeOpacity: 0.9,
                strokeWeight: 3,
              });

              currentLineRef.current = polyline;

              const infoHtml = `
                <div style="
                  background:white;
                  border:1px solid #888;
                  border-radius:8px;
                  padding:10px;
                  font-size:13px;
                  line-height:1.5;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                  white-space:nowrap;
                ">
                  <strong>${place.bsnm_nm}</strong><br/>
                  ${place.bsns_detail_road_addr}<br/>
                  ${place.induty_nm}<br/>
                  ${intersects ? `오염률: ${pollutionPercent.toFixed(1)}%` : "<span style='color:gray'>하천 유역과 맞닿지 않음</span>"}
                </div>`;

              const infoWindow = new window.naver.maps.InfoWindow({
                content: infoHtml,
                pixelOffset: new window.naver.maps.Point(0, -60),
                disableAutoPan: true,
              });

              infoWindow.open(mapRef.current, marker);
              infoWindowRef.current = infoWindow;
              mapRef.current.panTo(marker.getPosition());
            } catch (err) {
              alert("흐름 경로를 불러오지 못했습니다.");
              console.error(err);
            }
          });

          newMarkers.push(marker);
        }

        setPollutionMarkers(newMarkers);
      } catch (err) {
        console.error("\u274c 오염원 API 호출 에러:", err);
      }
    };

    loadMarkers();
  }, [showPollution, geoJsonData, deltaC]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (showDEM) {
      const bounds = new window.naver.maps.LatLngBounds(
        new window.naver.maps.LatLng(37.7331240, 127.4980451),
        new window.naver.maps.LatLng(38.0200258, 127.9446376)
      );

      const overlay = new window.naver.maps.GroundOverlay(
        "/images/hillshade.png",
        bounds,
        {
          map: mapRef.current,
          opacity: 0.6,
        }
      );
      setDemOverlay(overlay);
    } else {
      if (demOverlay) {
        demOverlay.setMap(null);
        setDemOverlay(null);
      }
    }
  }, [showDEM]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default NaverMapComponent;
