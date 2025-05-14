import pandas as pd
import random
from datetime import datetime, timedelta

# 샘플 데이터 생성
num_samples = 20  # 샘플 데이터 개수

# 날짜 & 시간 생성 (최근 20시간 기준)
base_datetime = datetime.now()
date_list = [(base_datetime - timedelta(hours=i)).strftime("%Y%m%d") for i in range(num_samples)]
time_list = [(base_datetime - timedelta(hours=i)).strftime("%H%M") for i in range(num_samples)]

# 기상 요소 (온도, 강수량, 습도, 풍속 등)
categories = ["T1H", "RN1", "REH", "WSD"]
values = {
    "T1H": [round(random.uniform(5, 30), 1) for _ in range(num_samples)],  # 기온 (°C)
    "RN1": [round(random.uniform(0, 10), 1) for _ in range(num_samples)],  # 강수량 (mm)
    "REH": [random.randint(30, 90) for _ in range(num_samples)],  # 습도 (%)
    "WSD": [round(random.uniform(0.5, 5.0), 1) for _ in range(num_samples)]  # 풍속 (m/s)
}

# 데이터프레임 생성
data_list = []
for i in range(num_samples):
    for category in categories:
        data_list.append([date_list[i], time_list[i], category, values[category][i]])

df_sample = pd.DataFrame(data_list, columns=["날짜", "시간", "종류", "값"])

# 날짜 변환
df_sample["날짜"] = pd.to_datetime(df_sample["날짜"], format="%Y%m%d")

# CSV 파일로 저장
df_sample.to_csv("weather_sample.csv", index=False, encoding="utf-8")

print("CSV 파일 저장 완료: weather_sample.csv")
