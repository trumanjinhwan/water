import os
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split

# ✅ 하이퍼파라미터
EPOCHS = 200
BATCH_SIZE = 64
LR = 0.001

# ✅ 현재 파일 기준으로 data 디렉토리 경로 만들기
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 현재 .py 파일 경로
SAVE_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(SAVE_DIR, "model.pth")

# ✅ 데이터 불러오기
csv_path = os.path.join(os.path.dirname(__file__), "data", "flow_learning_dataset.csv")
df = pd.read_csv(csv_path, encoding="utf-8-sig")  # <- 여기에 쉼표 ❌
X = df[[f"elev_{i}" for i in range(9)]].values
y = df[["vx", "vy"]].values

# ✅ train/test 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ✅ Tensor 변환
X_train = torch.FloatTensor(X_train)
y_train = torch.FloatTensor(y_train)
X_test = torch.FloatTensor(X_test)
y_test = torch.FloatTensor(y_test)

# ✅ DataLoader
train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(TensorDataset(X_test, y_test), batch_size=BATCH_SIZE)

# ✅ MLP 모델 정의
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(9, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 2)  # vx, vy 출력
        )

    def forward(self, x):
        return self.net(x)

model = MLP()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)

# ✅ 학습 루프
for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    for xb, yb in train_loader:
        pred = model(xb)
        loss = criterion(pred, yb)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        running_loss += loss.item()

    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1}/{EPOCHS}, Loss: {running_loss/len(train_loader):.6f}")

# ✅ 모델 저장
torch.save(model.state_dict(), MODEL_PATH)
print("✅ 학습 완료 및 모델 저장: data/model.pth")
