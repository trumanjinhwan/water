import pandas as pd
import pymysql

# CSV 파일 불러오기
df = pd.read_csv("weather_sample.csv")

# MySQL 연결 정보
host = "localhost"  # MySQL 서버 주소
user = "water"          # MySQL 사용자명
password = "1111"       # MySQL 비밀번호
database = "weather_db" # 사용할 데이터베이스
charset = "utf8mb4"

# MySQL 연결
conn = pymysql.connect(host=host, user=user, password=password, database=database, charset=charset, use_unicode=True)
cursor = conn.cursor()

# ✅ 테이블 생성 쿼리 (존재하지 않을 경우만 생성)
create_table_sql = """
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    날짜 DATE,
    시간 TIME,
    종류 VARCHAR(50),
    값 FLOAT
);
"""

cursor.execute(create_table_sql)
conn.commit()

# ✅ 데이터 삽입 쿼리
insert_sql = """
INSERT INTO weather_data (날짜, 시간, 종류, 값)
VALUES (%s, %s, %s, %s)
"""

# ✅ 데이터프레임 데이터를 튜플 형태로 변환 후 삽입
data_to_insert = df.values.tolist()
cursor.executemany(insert_sql, data_to_insert)

# ✅ 변경사항 저장
conn.commit()

print("✅ 테이블 생성 및 데이터 삽입 완료!")

# ✅ 연결 종료
cursor.close()
conn.close()
