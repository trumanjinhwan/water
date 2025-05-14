import pandas as pd
import pymysql
import os

# ✅ Java 기반 TM → WGS84 변환 함수 (기준점+스케일 방식)
def convert_tm_to_wgs84(tmN, tmE):
    base_tmN = 1987120.384596034
    base_tmE = 1020233.8001620844
    base_lat = 37.88369036216385
    base_lon = 127.73009760812818

    scale_lat = 0.0000090122
    scale_lon = 0.0000113755

    wgs84_lat = (tmN - base_tmN) * scale_lat + base_lat
    wgs84_lon = (tmE - base_tmE) * scale_lon + base_lon

    return wgs84_lon, wgs84_lat  # (longitude, latitude)

# ✅ CSV 불러오기
df = pd.read_csv(
    os.path.join(os.path.dirname(__file__), "data", "수질오염원_정보(2023년11월).csv"),
    encoding="cp949"
)

# ✅ 필요한 열만 추출
columns_needed = ["bsnm_nm", "induty_nm", "bsns_detail_road_addr", "web_bplc_x_katec", "web_bplc_y_katec"]
df = df[columns_needed]

# ✅ 강원도 필터링 및 NaN 제거
df = df[df["bsns_detail_road_addr"].str.contains("강원도", na=False)]
df = df.dropna(subset=["web_bplc_x_katec", "web_bplc_y_katec"])

# ✅ 좌표 변환 수행 (새 열 추가)
def convert_coords(row):
    x, y = row["web_bplc_x_katec"], row["web_bplc_y_katec"]
    try:
        lon, lat = convert_tm_to_wgs84(x, y)  # 순서 주의 (N, E)
        return pd.Series({"longitude": lon, "latitude": lat})
    except Exception as e:
        print(f"⚠️ 변환 실패: {x}, {y} - {e}")
        return pd.Series({"longitude": None, "latitude": None})

df[["longitude", "latitude"]] = df.apply(convert_coords, axis=1)

# ✅ MySQL 연결
conn = pymysql.connect(
    host="www.lifeslike.org",
    user="water",
    password="water1111",
    database="weather_db",
    charset="utf8mb4",
    use_unicode=True
)
cursor = conn.cursor()

# ✅ 테이블 생성 쿼리
create_table_sql = """
CREATE TABLE IF NOT EXISTS pollution_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bsnm_nm VARCHAR(255),
    induty_nm VARCHAR(255),
    bsns_detail_road_addr VARCHAR(500),
    web_bplc_x_katec DOUBLE,
    web_bplc_y_katec DOUBLE,
    longitude DOUBLE,
    latitude DOUBLE
);
"""
cursor.execute(create_table_sql)
conn.commit()

# ✅ INSERT
insert_sql = """
INSERT INTO pollution_sources (
    bsnm_nm, induty_nm, bsns_detail_road_addr,
    web_bplc_x_katec, web_bplc_y_katec,
    longitude, latitude
) VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

# ✅ DB에 삽입
data_to_insert = df.values.tolist()
cursor.executemany(insert_sql, data_to_insert)
conn.commit()

print(f"✅ WGS84 좌표 포함 총 {len(data_to_insert)}건 삽입 완료")

cursor.close()
conn.close()
