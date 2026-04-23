# 采集任务SD报表 - 在线版

将飞书导出的 CSV 数据上传后，任何人通过链接即可查看到最新统计结果。无需登录，支持筛选和多 Tab 查看。

## 本地运行

```bash
cd report_online
npm install
npm start
```

然后打开浏览器访问：

- 看板页面：`http://localhost:3000/report.html`
- 上传页面：`http://localhost:3000/admin.html`

## 部署到 Railway（免费）

[Railway](https://railway.app) 提供免费 Node.js 托管，自带持久化文件系统（SQLite 数据库文件会保存）。

### 步骤

1. **准备代码**：将整个 `report_online` 文件夹上传到 GitHub 仓库

2. **创建 Railway 项目**：
   - 访问 [railway.app](https://railway.app) 并登录（可用 GitHub 账号）
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择包含 `report_online` 的仓库
   - Railway 会自动检测 Node.js 并执行 `npm install && npm start`

3. **配置启动命令**（Railway 通常自动识别，如需手动设置）：
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `report_online`

4. **获取访问地址**：Railway 会分配一个 `.railway.app` 域名
   - 看板：`https://your-app.railway.app/report.html`
   - 上传：`https://your-app.railway.app/admin.html`

5. **上传数据**：打开上传页面，选择 CSV 文件，上传成功后会自动跳转到看板

## 部署到 Render（免费）

[Render](https://render.com) 提供免费 Node.js 托管。

### 步骤

1. 将代码上传到 GitHub 仓库

2. 在 Render 创建 Web Service：
   - Connect GitHub repo
   - Region: Singapore（就近选择）
   - Branch: `main`
   - Root Directory: `report_online`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. 部署完成后，访问 `https://your-app.onrender.com/report.html`

## 部署到 Zeabur（免费，国产）

[Zeabur](https://zeabur.com) 提供免费 Node.js 托管，支持中国访问。

### 步骤

1. 将代码上传到 GitHub 仓库

2. 在 Zeabur 创建新服务，选择从 GitHub 部署

3. 设置同 Render，访问分配的域名即可

## 功能说明

- **看板页面** (`/report.html`)：查看统计结果，支持日期范围、班次、出车人、车号、任务五个维度的筛选，三个 Tab 分别展示每日任务汇总、出车人统计、任务统计
- **上传页面** (`/admin.html`)：上传 CSV 文件，上传后替换全部现有数据
- **实时刷新**：看板页面点击"刷新数据"按钮可获取最新数据

## 数据说明

上传的 CSV 文件需要包含以下列（飞书表格标准格式）：

| 列名 | 说明 |
|------|------|
| 时间 | 日期，格式 YYYY-MM-DD 或 YYYY/MM/DD |
| 采集任务 | 任务名称 |
| 出车人SD | 出车人姓名（支持多人用 / 分隔） |
| 出车时间 | 出发时间，格式 HH:MM 或 HH：MM |
| 车号 | 车牌号（非必填） |

## 目录结构

```
report_online/
├── server/
│   ├── index.js    # Express 服务入口
│   ├── db.js       # SQLite 数据库操作
│   └── parse.js    # CSV 解析逻辑
├── public/
│   ├── report.html # 看板页面
│   └── admin.html  # 上传管理页面
├── data/           # SQLite 数据库文件（部署后自动创建）
└── package.json
```
