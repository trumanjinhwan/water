import pandas as pd
import pymysql

# CSV 파일 불러오기
df = pd.read_csv("weather_sample.csv")

# MySQL 연결 정보
host = "localhost"  # MySQL 서버 주소 (로컬이면 localhost)
user = "root"       # MySQL 사용자명
password = "1111"  # MySQL 비밀번호
database = "weather_db"  # 사용할 데이터베이스
charset="utf8mb4"

# MySQL 연결
conn = pymysql.connect(host=host, user=user, password=password, database=database, charset=charset, use_unicode=True)
cursor = conn.cursor()

# 데이터 삽입 쿼리
sql = """
INSERT INTO weather_data (날짜, 시간, 종류, 값)
VALUES (%s, %s, %s, %s)
"""

# 데이터프레임 데이터를 튜플 형태로 변환 후 삽입
data_to_insert = df.values.tolist()
cursor.executemany(sql, data_to_insert)

# 변경사항 저장
conn.commit()

print("✅ 데이터 삽입 완료!")

# 연결 종료
cursor.close()
conn.close()
