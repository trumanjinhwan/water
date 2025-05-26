import os
import torch
import geojson
import numpy as np
import pymysql
from math import sqrt
import rasterio
from rasterio.transform import rowcol
from shapely.geometry import LineString

# ✅ 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEM_PATH = os.path.join(BASE_DIR, "data", "DEM.tif")
MODEL_PATH = os.path.join(BASE_DIR, "data", "model.pth")
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "my-weather-map", "public", "data", "flow")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ✅ DEM 불러오기
with rasterio.open(DEM_PATH) as src:
    dem = src.read(1)
    transform = src.transform
    nodata = src.nodata

dem = np.ma.masked_equal(dem, nodata)

# ✅ MLP 모델 구조와 로드
class MLP(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.net = torch.nn.Sequential(
            torch.nn.Linear(9, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 2)  # vx, vy
        )

    def forward(self, x):
        return self.net(x)

model = MLP()
model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()

# ✅ 흐름 경로 예측 함수
def predict_path(start_lat, start_lng, max_steps=200, step_size=1.0):
    try:
        row, col = rowcol(transform, start_lng, start_lat)
    except:
        return []

    path = []

    for _ in range(max_steps):
        if (row < 1 or row + 2 >= dem.shape[0] or col < 1 or col + 2 >= dem.shape[1]):
            break

        kernel = dem[row-1:row+2, col-1:col+2]
        if np.ma.is_masked(kernel):
            break

        input_tensor = torch.FloatTensor(kernel.flatten()).unsqueeze(0)
        with torch.no_grad():
            vx, vy = model(input_tensor).squeeze().tolist()

        mag = sqrt(vx**2 + vy**2)
        if mag == 0:
            break

        # 이동
        row -= int(round((vy / mag) * step_size))
        col += int(round((vx / mag) * step_size))

        lng, lat = transform * (col, row)
        path.append((lat, lng))

    return path

# ✅ 오염원 DB에서 위치 불러오기
conn = pymysql.connect(
    host="www.lifeslike.org",
    user="water",
    password="water1111",
    database="weather_db",
    charset="utf8mb4",
    use_unicode=True
)
cursor = conn.cursor()
cursor.execute("SELECT id, latitude, longitude FROM pollution_sources WHERE latitude IS NOT NULL AND longitude IS NOT NULL")
rows = cursor.fetchall()

# ✅ 예측 및 저장
count = 0
# for id, lat, lng in rows:
#     path = predict_path(lat, lng)
#     if len(path) < 2:
#         continue

path = predict_path(34.88701, 126.59409)

feature = geojson.Feature(
    geometry=geojson.LineString([(lng_, lat_) for lat_, lng_ in path]),
    properties={"id": " "}
)
geojson_obj = geojson.FeatureCollection([feature])

out_path = os.path.join(OUTPUT_DIR, f"flow_path_{"연습용5"}.geojson")
with open(out_path, "w", encoding="utf-8") as f:
    geojson.dump(geojson_obj, f, ensure_ascii=False, indent=2)

count += 1

print(f"✅ 예측된 흐름 경로 GeoJSON {count}개 생성 완료")
cursor.close()
conn.close()
