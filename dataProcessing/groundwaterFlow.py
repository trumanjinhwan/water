import os
import pymysql
import geojson
import rasterio
import numpy as np
from math import sqrt
from rasterio.transform import rowcol

# ✅ DEM 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TIF_PATH = os.path.join(BASE_DIR, "data", "prac.tif")

# ✅ prac.tif 로드
with rasterio.open(TIF_PATH) as src:
    elevation = src.read(1)
    transform = src.transform
    crs = src.crs
    nodata = src.nodata

# ✅ NoData 처리 및 gradient 계산
elevation = np.ma.masked_equal(elevation, nodata)
dy, dx = np.gradient(elevation)
K = 0.0001  # 유압 전도도
vx = -K * dx
vy = -K * dy
STEP_SIZE = 1.0

# ✅ 지하수 흐름 경로 추적 함수
def trace_flow_path(start_lat, start_lng, max_steps=200):
    try:
        row, col = rowcol(transform, start_lng, start_lat)
    except:
        return []

    path = []

    for _ in range(max_steps):
        if (row < 0 or row >= elevation.shape[0] or
            col < 0 or col >= elevation.shape[1]):
            break

        lng, lat = transform * (col, row)
        path.append((lat, lng))

        vx_val = vx[row, col]
        vy_val = vy[row, col]
        mag = sqrt(vx_val**2 + vy_val**2)
        if mag == 0 or np.ma.is_masked(mag):
            break

        row -= int(round((vy_val / mag) * STEP_SIZE))
        col += int(round((vx_val / mag) * STEP_SIZE))

    return path

# ✅ DB 연결 정보
conn = pymysql.connect(
    host="www.lifeslike.org",
    user="water",
    password="water1111",
    database="weather_db",
    charset="utf8mb4",
    use_unicode=True
)
cursor = conn.cursor()

# ✅ 오염원 좌표 가져오기
cursor.execute("""
    SELECT id, latitude, longitude 
    FROM pollution_sources
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
""")
rows = cursor.fetchall()

# ✅ 결과 저장 경로: ../my-weather-map/public/flow/
output_dir = os.path.join(BASE_DIR, "..", "my-weather-map", "public", "data", "flow")
os.makedirs(output_dir, exist_ok=True)

count = 0

for id, lat, lng in rows:
    path = trace_flow_path(lat, lng)
    if not path or len(path) < 2:
        continue

    feature = geojson.Feature(
        geometry=geojson.LineString([(lng_, lat_) for lat_, lng_ in path]),
        properties={"id": id}
    )
    geojson_obj = geojson.FeatureCollection([feature])

    file_path = os.path.join(output_dir, f"flow_path_{id}.geojson")
    with open(file_path, "w", encoding="utf-8") as f:
        geojson.dump(geojson_obj, f, ensure_ascii=False, indent=2)

    count += 1

print(f"✅ 지하수 흐름 GeoJSON {count}개 생성 완료")

cursor.close()
conn.close()
