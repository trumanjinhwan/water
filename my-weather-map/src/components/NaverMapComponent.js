import React, { useEffect } from "react";

const NaverMapComponent = () => {
  useEffect(() => {
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.926, 127.75), // 소양강 위치
      zoom: 13,
    });

    // API 호출하여 오염원 데이터 가져오기
    //fetch(`https://www.lifeslike.org/pollution-sources`)
    fetch('http://localhost:8080/pollution-sources')
      .then((res) => res.json())
      .then((data) => {
        data.forEach((place) => {
          console.log("📍 마커 위치 확인:", place.web_bplc_y_katec, place.web_bplc_x_katec); // 위치 확인

          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(place.web_bplc_x_katec, place.web_bplc_y_katec),
            map,
            title: place.bsnm_nm,
          });

          const infoWindow = new window.naver.maps.InfoWindow({
            content: `<div style="padding:8px">
                        <strong>${place.bsnm_nm}</strong><br/>
                        ${place.bsns_detail_road_addr}<br/>
                        ${place.induty_nm}
                      </div>`,
          });

          window.naver.maps.Event.addListener(marker, "click", () => {
            infoWindow.open(map, marker);
          });
        });
      })
      .catch((err) => console.error("❌ API 호출 에러:", err));
  }, []);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
};

export default NaverMapComponent;
