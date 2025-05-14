import pymysql
import pandas as pd

# MySQL 연결 정보
host = "61.43.3.122"  # MySQL 서버 주소
user = "water"       # MySQL 사용자명
password = "water1111"  # MySQL 비밀번호
database = "weather_db"  # 사용할 데이터베이스
charset="utf8mb4"

# MySQL 연결
conn = pymysql.connect(host=host, user=user, password=password, database=database, charset=charset, use_unicode=True)
cursor = conn.cursor()

# 데이터 가져오기
sql = "SELECT * FROM weather_data"
df = pd.read_sql(sql, conn)

# 데이터 확인
print(df.head())  # 상위 5개 데이터 출력

# 연결 종료
cursor.close()
conn.close()

import matplotlib.pyplot as plt
# 한글 폰트 설정 (Windows)
plt.rc("font", family="Malgun Gothic")

# 마이너스(-) 기호 깨짐 방지
plt.rcParams["axes.unicode_minus"] = False

# "T1H" 데이터만 필터링
df_temp = df[df["종류"] == "T1H"].copy()

# 시간 컬럼 정리: "0 days 00:00:46" → "00:00:46"
df_temp["시간"] = df_temp["시간"].astype(str).str.extract(r'(\d{2}:\d{2}:\d{2})')

# 날짜 + 시간 → datetime 변환
df_temp["datetime"] = pd.to_datetime(
    df_temp["날짜"].astype(str) + " " + df_temp["시간"],
    format="%Y-%m-%d %H:%M:%S"
)




# 그래프 그리기
plt.figure(figsize=(10, 5))
plt.plot(df_temp["datetime"], df_temp["값"], marker="o", linestyle="-", label="기온 (°C)")

# 그래프 스타일 설정
plt.xlabel("날짜 및 시간")
plt.ylabel("기온 (°C)")
plt.title("기온 변화 그래프")
plt.xticks(rotation=45)
plt.legend()
plt.grid()

# 그래프 출력
plt.show()

