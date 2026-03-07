# AI 工具配置生成器

一个用于生成 AI 工具配置文件的 Web 应用，支持 Codex、Claude Code 和 Gemini CLI 三种工具。

## 技术栈

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS 3
- React Hook Form 7 + Zod 3
- 部署平台：Cloudflare Pages

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

## 构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 测试

```bash
npm run test
```

## 项目结构

```
cc_settings_web/
├── src/
│   ├── components/       # UI 组件
│   ├── hooks/            # 自定义 Hooks
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript 类型定义
│   ├── schemas/          # Zod 验证 Schema
│   └── constants/        # 常量定义
├── public/               # 静态资源
└── docs/                 # 文档
```

## 功能特性

- 支持三种 AI 工具配置生成（Codex、Claude Code、Gemini CLI）
- 实时配置预览
- 配置文件导入导出
- 表单验证
- 配置模板快速填充
- 响应式设计
- 暗色模式支持

## License

MIT
