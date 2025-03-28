import React, { useEffect } from "react";

const NaverMapComponent = () => {
  useEffect(() => {
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.926, 127.75), // 소양강 위치
      zoom: 13,
    });

    const keywords = ["소양강 주유소", "소양강 공장", "소양강 아파트", "소양강 주택"];

    keywords.forEach((keyword) => {
      //fetch(`http://localhost:8080/api/naver/search?query=${keyword}`)
      fetch(`https://www.lifeslike.org/api/naver/search?query=${keyword}`)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((place) => {
            console.log("📍 마커 위치 확인:", place.lat, place.lng); // ← 이 줄 추가!

            const marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(place.lat, place.lng),
              map,
              title: place.title.replace(/<[^>]+>/g, ""),
            });

            const infoWindow = new window.naver.maps.InfoWindow({
              content: `<div style="padding:8px">
                          <strong>${place.title.replace(/<[^>]+>/g, "")}</strong><br/>
                          ${place.address}
                        </div>`,
            });

            window.naver.maps.Event.addListener(marker, "click", () => {
              infoWindow.open(map, marker);
            });
          });
        })
        .catch((err) => console.error("❌ API 호출 에러:", err));
    });
  }, []);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
};

export default NaverMapComponent;
