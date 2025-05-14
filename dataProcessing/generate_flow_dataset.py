import os
import json
import numpy as np
import pandas as pd
from shapely.geometry import LineString
import rasterio
from rasterio.transform import rowcol
from math import sqrt

# === 경로 설정 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DEM_PATH = os.path.join(DATA_DIR, "DEM.tif")
GEOJSON_PATH = os.path.join(DATA_DIR, "지하수흐름.geojson")
OUTPUT_CSV = os.path.join(DATA_DIR, "flow_learning_dataset.csv")

# === DEM 열기 ===
with rasterio.open(DEM_PATH) as src:
    dem = src.read(1)
    transform = src.transform
    nodata = src.nodata

# NoData 마스킹
dem = np.ma.masked_equal(dem, nodata)

# === GeoJSON 로드 ===
with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
    gj = json.load(f)

samples = []

# === 흐름선 따라 10m 간격 샘플링 ===
for feature in gj["features"]:
    coords_multi = feature["geometry"]["coordinates"]
    for coords in coords_multi:
        if len(coords) < 2:
            continue
        line = LineString(coords)
        for dist in np.arange(0, line.length, 10):  # 10m 간격
            pt = line.interpolate(dist)
            lon, lat = pt.x, pt.y
            try:
                row, col = rowcol(transform, lon, lat)
                if row < 1 or col < 1 or row + 2 > dem.shape[0] or col + 2 > dem.shape[1]:
                    continue
                kernel = dem[row-1:row+2, col-1:col+2]
                if np.ma.is_masked(kernel):
                    continue
                pt_next = line.interpolate(min(dist + 1, line.length))
                vx = pt_next.x - pt.x
                vy = pt_next.y - pt.y
                magnitude = sqrt(vx**2 + vy**2)
                if magnitude == 0:
                    continue
                vx /= magnitude
                vy /= magnitude
                samples.append((kernel.flatten().tolist(), [vx, vy]))
            except:
                continue

# === DataFrame 생성 및 저장 ===
X = [x for x, _ in samples]
y = [y for _, y in samples]
df_X = pd.DataFrame(X, columns=[f"elev_{i}" for i in range(9)])
df_y = pd.DataFrame(y, columns=["vx", "vy"])
df = pd.concat([df_X, df_y], axis=1)

df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")
print(f"✅ 학습 데이터 저장 완료: {OUTPUT_CSV}")
print(f"총 샘플 수: {len(df)}")


