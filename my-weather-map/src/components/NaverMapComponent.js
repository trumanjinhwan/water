import React, { useEffect, useRef, useState } from "react";

const NaverMapComponent = ({ showDEM, showWatershed, showPollution, showTerrain }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [watershedPolygons, setWatershedPolygons] = useState([]);
  const [pollutionMarkers, setPollutionMarkers] = useState([]);
  const [demOverlay, setDemOverlay] = useState(null);
  const currentLineRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.926, 127.75),
      zoom: 13,
      mapTypeId: window.naver.maps.MapTypeId.NORMAL, // 초기값
    });
    mapRef.current = map;
  }, []);

  // 2. 지형지도 on/off에 따른 타입 변경 useEffect
useEffect(() => {
  if (!mapRef.current) return;

  mapRef.current.setMapTypeId(
    showTerrain
      ? window.naver.maps.MapTypeId.HYBRID
      : window.naver.maps.MapTypeId.NORMAL
  );
}, [showTerrain]);


  useEffect(() => {
    const drawWatershed = async () => {
      if (!mapRef.current) return;

      if (!showWatershed && watershedPolygons.length > 0) {
        watershedPolygons.forEach((poly) => poly.setMap(null));
        setWatershedPolygons([]);
        return;
      }

      if (showWatershed && watershedPolygons.length === 0) {
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
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#880000",
              fillOpacity: 0.3,
            });
          });

          setWatershedPolygons(newPolygons);
        } catch (err) {
          console.error("❌ clip2.geojson 로딩 실패:", err);
        }
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

          const infoWindow = new window.naver.maps.InfoWindow();

          window.naver.maps.Event.addListener(marker, "click", async () => {
            if (currentLineRef.current) {
              currentLineRef.current.setMap(null);
              currentLineRef.current = null;
            }

            try {
              const res = await fetch(`/data/flow/flow_path_${place.id}.geojson`);
              const geojson = await res.json();

              const coords = geojson.features[0].geometry.coordinates.map(
                ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
              );

              const polyline = new window.naver.maps.Polyline({
                map: mapRef.current,
                path: coords,
                strokeColor: "#00AAFF",
                strokeOpacity: 0.9,
                strokeWeight: 3,
              });

              currentLineRef.current = polyline;

              const infoHtml = `
                <div style="padding:8px">
                  <strong>${place.bsnm_nm}</strong><br/>
                  ${place.bsns_detail_road_addr}<br/>
                  ${place.induty_nm}<br/>
                  예측된 지하수 흐름이 표시되었습니다.
                </div>`;
              infoWindow.setContent(infoHtml);
              infoWindow.open(mapRef.current, marker);
            } catch (err) {
              alert("흐름 경로를 불러오지 못했습니다.");
              console.error(err);
            }
          });

          newMarkers.push(marker);
        }

        setPollutionMarkers(newMarkers);
      } catch (err) {
        console.error("❌ 오염원 API 호출 에러:", err);
      }
    };

    loadMarkers();
  }, [showPollution]);

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