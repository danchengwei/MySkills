# EMAS 智能分析工具

基于阿里云 EMAS 平台的应用性能分析工具。

## 安装

```bash
cd ~/.agents/skills/emas-intelligent-analysis
npm install
npm run build
```

## 使用

### 1. 检查环境

```bash
npm run dev -- check
# 或
node dist/index.js check
```

如果未安装阿里云 CLI，会自动下载安装。

### 2. 配置 AK/SK

```bash
npm run dev -- configure --ak YOUR_ACCESS_KEY --sk YOUR_SECRET_KEY
```

### 3. 崩溃分析

```bash
npm run dev -- crash --app-id YOUR_APP_ID --start-date 2026-04-01 --end-date 2026-04-17
```

### 4. 性能分析

```bash
npm run dev -- performance --app-id YOUR_APP_ID --metric startup_time
```

### 5. 网络分析

```bash
npm run dev -- network --app-id YOUR_APP_ID --start-date 2026-04-01
```

## 全局安装

```bash
npm link
# 之后可直接使用
emas-analyze check
emas-analyze configure --ak xxx --sk xxx
emas-analyze crash --app-id xxx
```

## 阿里云 CLI 下载

如自动安装失败，可手动下载：

- **macOS**: https://aliyuncli.alicdn.com/aliyun-cli-latest.pkg
- **Linux**: https://aliyuncli.alicdn.com/aliyun-cli-latest-linux-amd64.tgz
- **Windows**: https://aliyuncli.alicdn.com/aliyun-cli-latest.exe

## 参考

- [阿里云 EMAS](https://www.aliyun.com/product/emas)
- [EMAS OpenAPI](https://next.api.aliyun.com/api/Emas/2019-06-11)
