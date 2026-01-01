# LL-Group Platform 前端项目

这是 LL-Group Platform 的前端项目仓库，基于 React + Vite 构建。

## 📋 环境准备

在开始之前，请确保您的机器上安装了 Node.js 环境。
推荐版本：Node.js v18 或更高版本。

检查安装情况：
```bash
node -v
npm -v
```

## 🚀 快速开始

### 1. 安装依赖

下载项目后，在项目根目录下运行：

```bash
npm install
```

### 2. 配置后端地址

项目使用环境变量来配置后端 API 地址。
打开根目录下的 `.env` 文件（如果没有，请复制一份），修改 `VITE_API_BASE_URL`：

```env
# .env 文件
VITE_API_BASE_URL=http://10.16.27.222:8080/api
```
*注意：修改 .env 文件后需要重启服务才能生效。*

---

## 🛠️ 开发模式 (Development)

如果您正在开发或调试代码，使用开发模式：

```bash
npm run dev
```
启动后访问终端显示的地址（通常是 `http://localhost:5173`）。

---

## 📦 生产环境部署 (Production)

在服务器上部署时，**不要使用 `npm run dev`**。请按照以下步骤进行构建和运行。

### 第一步：构建项目

这将生成优化后的静态文件到 `dist` 目录。

```bash
npm run build
```

### 第二步：启动服务

使用 `serve` 工具来运行构建好的静态文件。

**方式 A：直接运行 (推荐临时测试)**
```bash
npx serve -s dist -l 5175
```
*   `-s`: 单页应用模式 (SPA)，防止刷新页面 404。
*   `-l 5175`: 指定端口号为 5175 (可根据需要修改)。

**方式 B：使用 PM2 后台运行 (推荐长期部署)**
如果您希望服务在后台一直运行，建议安装 PM2：

1. 全局安装 PM2:
   ```bash
   npm install -g pm2
   ```

2. 启动服务:
   ```bash
   pm2 serve dist 5175 --name "ll-frontend" --spa
   ```

3. 查看状态/停止:
   ```bash
   pm2 list
   pm2 stop ll-frontend
   ```

---

## ❓ 常见问题

**Q: 页面刷新报 404 错误？**
A: 请确保启动命令中包含了 SPA 支持参数（例如 `serve` 的 `-s` 参数或 PM2 的 `--spa` 参数）。

**Q: 无法连接到后端接口？**
A: 请检查 `.env` 文件中的 `VITE_API_BASE_URL` 是否正确，并确保服务器可以访问该 IP 地址。生产环境构建时，Vite 会将这个地址打包进代码中，**如果修改了 .env，必须重新运行 `npm run build`**。
