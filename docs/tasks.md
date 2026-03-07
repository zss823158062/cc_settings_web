# AI 工具配置生成器 - 开发任务分配

## 架构概要

### 技术栈
- 前端框架：React 18 + TypeScript 5
- 构建工具：Vite 5
- 样式方案：Tailwind CSS 3
- 表单管理：React Hook Form 7 + Zod 3
- 配置解析：@iarna/toml（TOML 解析）
- 语法高亮：Prism.js（轻量级）
- 部署平台：Cloudflare Pages

### 目录结构
```
cc_settings_web/
├── src/
│   ├── components/          # UI 组件
│   │   ├── common/          # 通用组件（按钮、输入框、卡片等）
│   │   ├── layout/          # 布局组件（Header、Footer、Container）
│   │   ├── forms/           # 表单组件（Codex、Claude、Gemini 配置表单）
│   │   └── preview/         # 预览组件（配置文件预览、语法高亮）
│   ├── hooks/               # 自定义 Hooks
│   ├── utils/               # 工具函数
│   ├── types/               # TypeScript 类型定义
│   ├── schemas/             # Zod 验证 Schema
│   ├── constants/           # 常量定义（模板、默认值）
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── docs/                    # 文档
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

### API 契约规范

#### 契约文件位置
- `src/types/config.ts` - 配置数据类型定义
- `src/types/form.ts` - 表单相关类型定义
- `src/types/template.ts` - 模板类型定义
- `src/utils/parser.ts` - 配置文件解析和生成函数签名
- `src/utils/validator.ts` - 验证函数签名
- `src/utils/file.ts` - 文件操作函数签名

#### 数据类型定义（含字段语义注释）

**核心配置类型**：

```typescript
/** 工具类型枚举 */
type ToolType = 'codex' | 'claude' | 'gemini';

/** Codex 配置结构（对应 TOML 格式） */
interface CodexConfig {
  api: {
    /** API 密钥，格式：sk- 开头，长度 > 20 */
    key: string;
    /** API 基础 URL，默认 https://api.openai.com/v1 */
    base_url: string;
  };
  model: {
    /** 模型名称，如 gpt-4, gpt-3.5-turbo */
    name: string;
    /** 温度参数，范围 0-2，控制随机性 */
    temperature: number;
    /** 最大 token 数，正整数，< 100000 */
    max_tokens: number;
  };
  behavior: {
    /** 是否自动保存，布尔值 */
    auto_save: boolean;
    /** 超时时间（秒），正整数，建议 30-120 */
    timeout: number;
  };
}

/** Claude Code 配置结构（对应 JSON 格式） */
interface ClaudeConfig {
  /** API 密钥，格式：sk-ant- 开头 */
  apiKey: string;
  /** 模型名称，如 claude-sonnet-4, claude-opus-4 */
  model: string;
  workspace: {
    /** 是否自动保存 */
    autoSave: boolean;
    /** 忽略的文件模式列表，如 ["node_modules", ".git"] */
    ignorePatterns: string[];
  };
  editor: {
    /** Tab 缩进大小，正整数，通常 2 或 4 */
    tabSize: number;
    /** 保存时是否格式化 */
    formatOnSave: boolean;
  };
}

/** Gemini CLI 配置结构（对应 JSON 格式） */
interface GeminiConfig {
  /** API 密钥，格式：AIza 开头 */
  apiKey: string;
  /** 项目 ID，字符串 */
  projectId: string;
  /** 区域，如 us-central1, asia-east1 */
  region: string;
  /** 模型名称，如 gemini-pro, gemini-ultra */
  model: string;
  safetySettings: {
    /** 骚扰内容过滤级别：BLOCK_NONE | BLOCK_LOW_AND_ABOVE | BLOCK_MEDIUM_AND_ABOVE | BLOCK_HIGH */
    harassment: string;
    /** 仇恨言论过滤级别 */
    hateSpeech: string;
  };
}

/** 统一配置值类型（用于表单状态） */
type ConfigValues = CodexConfig | ClaudeConfig | GeminiConfig;

/** 表单字段定义 */
interface FormField {
  /** 字段名称，对应配置对象的键路径，如 "api.key" */
  name: string;
  /** 显示标签，用户可见的字段名 */
  label: string;
  /** 字段类型：text | number | boolean | select | array */
  type: 'text' | 'number' | 'boolean' | 'select' | 'array';
  /** 是否必填 */
  required: boolean;
  /** 默认值 */
  defaultValue: any;
  /** 占位符文本 */
  placeholder?: string;
  /** 帮助提示文本 */
  helpText?: string;
  /** 选项列表（仅 select 类型） */
  options?: Array<{ label: string; value: string }>;
}

/** 验证错误类型 */
type ValidationErrors = Record<string, string>;

/** 配置模板 */
interface ConfigTemplate {
  /** 模板唯一标识，格式：{tool}-{scenario}，如 codex-dev */
  id: string;
  /** 模板显示名称 */
  name: string;
  /** 模板描述，说明适用场景 */
  description: string;
  /** 适用的工具类型 */
  tool: ToolType;
  /** 预设的配置值 */
  values: ConfigValues;
}

/** 文件导出选项 */
interface ExportOptions {
  /** 文件名，不含扩展名 */
  filename: string;
  /** 文件格式：json | toml */
  format: 'json' | 'toml';
  /** 配置内容 */
  content: string;
}

/** 文件导入结果 */
interface ImportResult {
  /** 是否成功 */
  success: boolean;
  /** 解析后的配置值（成功时） */
  data?: ConfigValues;
  /** 错误信息（失败时） */
  error?: string;
}
```

#### 函数签名定义

**配置解析和生成模块（src/utils/parser.ts）**：

```typescript
/**
 * 将配置对象转换为 JSON 字符串
 * @param config - 配置对象
 * @param pretty - 是否格式化输出，默认 true
 * @returns 格式化的 JSON 字符串
 */
function stringifyJSON(config: ClaudeConfig | GeminiConfig, pretty?: boolean): string;

/**
 * 将配置对象转换为 TOML 字符串
 * @param config - Codex 配置对象
 * @returns TOML 格式字符串
 */
function stringifyTOML(config: CodexConfig): string;

/**
 * 解析 JSON 字符串为配置对象
 * @param content - JSON 字符串
 * @returns 解析后的配置对象
 * @throws 格式错误时抛出异常
 */
function parseJSON<T = ClaudeConfig | GeminiConfig>(content: string): T;

/**
 * 解析 TOML 字符串为配置对象
 * @param content - TOML 字符串
 * @returns 解析后的 Codex 配置对象
 * @throws 格式错误时抛出异常
 */
function parseTOML(content: string): CodexConfig;

/**
 * 根据工具类型生成配置字符串
 * @param tool - 工具类型
 * @param config - 配置对象
 * @returns 配置文件字符串（JSON 或 TOML）
 */
function generateConfigString(tool: ToolType, config: ConfigValues): string;
```

**文件操作模块（src/utils/file.ts）**：

```typescript
/**
 * 导出配置文件到本地
 * @param options - 导出选项
 * @returns Promise，导出成功后 resolve
 */
function exportConfigFile(options: ExportOptions): Promise<void>;

/**
 * 导入配置文件
 * @param file - 用户选择的文件对象
 * @param tool - 目标工具类型（用于验证格式）
 * @returns Promise<ImportResult>，包含解析结果或错误信息
 */
function importConfigFile(file: File, tool: ToolType): Promise<ImportResult>;

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本内容
 * @returns Promise<boolean>，成功返回 true，失败返回 false
 */
function copyToClipboard(text: string): Promise<boolean>;

/**
 * 读取文件内容为文本
 * @param file - 文件对象
 * @returns Promise<string>，文件内容
 */
function readFileAsText(file: File): Promise<string>;
```

**验证模块（src/utils/validator.ts）**：

```typescript
/**
 * 验证 API Key 格式
 * @param key - API Key 字符串
 * @param tool - 工具类型（不同工具有不同的格式要求）
 * @returns 验证结果，{ valid: boolean, error?: string }
 */
function validateApiKey(key: string, tool: ToolType): { valid: boolean; error?: string };

/**
 * 验证 URL 格式
 * @param url - URL 字符串
 * @returns 是否为有效的 HTTP/HTTPS URL
 */
function validateURL(url: string): boolean;

/**
 * 验证数值范围
 * @param value - 数值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
function validateNumberRange(value: number, min: number, max: number): boolean;

/**
 * 获取字段的验证错误信息
 * @param fieldName - 字段名
 * @param value - 字段值
 * @param field - 字段定义
 * @returns 错误信息，无错误返回 null
 */
function getFieldError(fieldName: string, value: any, field: FormField): string | null;
```

**模板管理模块（src/utils/template.ts）**：

```typescript
/**
 * 获取指定工具的所有模板
 * @param tool - 工具类型
 * @returns 模板列表
 */
function getTemplatesByTool(tool: ToolType): ConfigTemplate[];

/**
 * 根据模板 ID 获取模板
 * @param templateId - 模板 ID
 * @returns 模板对象，不存在返回 null
 */
function getTemplateById(templateId: string): ConfigTemplate | null;

/**
 * 应用模板到表单
 * @param templateId - 模板 ID
 * @returns 模板的配置值，不存在返回 null
 */
function applyTemplate(templateId: string): ConfigValues | null;
```

#### 跨模块数据流图

**整体数据流**：

```
用户操作 → UI 组件 → React Hook Form → Zod 验证 → 状态更新 → 预览组件
                                            ↓
                                      导出/复制功能
```

**功能 1：填写表单并实时预览**

```
[用户填写表单]
UI: CodexForm / ClaudeForm / GeminiForm
  → onChange 事件触发
  → React Hook Form 更新表单状态
  → Zod Schema 验证（实时）
  → 验证通过：更新 configValues 状态
  → 调用 generateConfigString(tool, configValues)
  → 返回配置字符串
  → PreviewPanel 组件接收并显示
  → Prism.js 语法高亮渲染
```

**功能 2：导出配置文件**

```
[用户点击导出按钮]
UI: ExportButton
  → 获取当前 configValues 和 tool
  → 调用 generateConfigString(tool, configValues)
  → 生成配置字符串
  → 调用 exportConfigFile({ filename, format, content })
  → 创建 Blob 对象
  → 使用 URL.createObjectURL 生成下载链接
  → 触发浏览器下载
  → 显示成功 Toast 通知
```

**功能 3：导入配置文件**

```
[用户选择文件]
UI: ImportButton → <input type="file">
  → 用户选择文件（.json 或 .toml）
  → onChange 事件触发
  → 调用 importConfigFile(file, tool)
  → 内部调用 readFileAsText(file)
  → 根据文件扩展名调用 parseJSON 或 parseTOML
  → 解析成功：返回 { success: true, data: ConfigValues }
  → 解析失败：返回 { success: false, error: string }
  → 成功时：React Hook Form.reset(data) 填充表单
  → 失败时：显示错误 Toast 通知
```

**功能 4：应用配置模板**

```
[用户选择模板]
UI: TemplateSelector (下拉菜单)
  → onChange 事件触发
  → 调用 applyTemplate(templateId)
  → 返回模板的 ConfigValues
  → React Hook Form.reset(values) 填充表单
  → 表单状态更新触发预览更新
```

**功能 5：复制配置内容**

```
[用户点击复制按钮]
UI: CopyButton (预览区右上角)
  → 获取当前配置字符串（configString）
  → 调用 copyToClipboard(configString)
  → 内部调用 navigator.clipboard.writeText(text)
  → 成功：返回 true，显示"已复制"提示
  → 失败：返回 false，显示错误提示
```

#### 共享概念命名规范表

| 概念 | 命名 | 格式 | 生成方 | 消费方 | 示例 |
|------|------|------|--------|--------|------|
| 工具类型 | tool / toolType | 'codex' \| 'claude' \| 'gemini' | UI 组件 | 全部模块 | 'codex' |
| 配置值对象 | configValues | CodexConfig \| ClaudeConfig \| GeminiConfig | 表单组件 | 解析器、预览组件 | { api: { key: '...' } } |
| 配置字符串 | configString / configContent | string (JSON/TOML) | parser.ts | 预览组件、导出功能 | '{"apiKey": "..."}' |
| 验证错误 | errors / validationErrors | Record<string, string> | Zod / validator.ts | 表单组件 | { 'api.key': '必填项' } |
| 模板 ID | templateId | string (格式：{tool}-{scenario}) | 常量定义 | 模板选择器 | 'codex-dev' |
| 文件名 | filename | string (不含扩展名) | 导出功能 | file.ts | 'config' |
| 文件格式 | format | 'json' \| 'toml' | 工具类型推断 | 导出功能 | 'json' |
| 字段路径 | fieldName / fieldPath | string (点分隔) | 表单定义 | React Hook Form | 'api.key' |
| API Key | apiKey / key | string | 用户输入 | 配置对象 | 'sk-ant-xxx' |
| 布尔配置 | autoSave / formatOnSave 等 | boolean | 用户输入 | 配置对象 | true |
| 数组配置 | ignorePatterns 等 | string[] | 用户输入 | 配置对象 | ['node_modules'] |

> 所有开发者必须严格使用此表中的命名和格式，禁止自行发明。

## 任务分配

### FE-1（前端开发 1 号）- UI 基础组件与布局

#### TASK-FE1-001: 通用 UI 组件库
- **关联需求**：F-001, F-009, F-010, F-011
- **文件范围**：
  - `src/components/common/Button.tsx`（新建）
  - `src/components/common/Input.tsx`（新建）
  - `src/components/common/Select.tsx`（新建）
  - `src/components/common/Toggle.tsx`（新建）
  - `src/components/common/Card.tsx`（新建）
  - `src/components/common/Toast.tsx`（新建）
- **依赖**：基础设施就绪
- **验收标准**：
  - [ ] Button 组件支持 primary/secondary/danger 三种样式
  - [ ] Input 组件支持 text/number 类型，支持错误状态显示
  - [ ] Select 组件支持下拉选择，支持占位符
  - [ ] Toggle 组件实现开关效果，支持受控模式
  - [ ] Card 组件支持标题、内容、可折叠功能
  - [ ] Toast 组件支持 success/error/info 三种类型，自动消失
  - [ ] 所有组件使用 Tailwind CSS 样式
  - [ ] 所有组件支持 TypeScript 类型定义

#### TASK-FE1-002: 页面布局组件
- **关联需求**：F-001, F-012
- **文件范围**：
  - `src/components/layout/Header.tsx`（新建）
  - `src/components/layout/Footer.tsx`（新建）
  - `src/components/layout/Container.tsx`（新建）
  - `src/components/layout/TabBar.tsx`（新建）
- **依赖**：TASK-FE1-001
- **验收标准**：
  - [ ] Header 包含应用标题和主题切换按钮（预留位置）
  - [ ] Footer 包含版权信息和链接
  - [ ] Container 实现响应式布局（桌面端/平板端）
  - [ ] TabBar 实现工具选择器（Codex/Claude/Gemini 三个选项卡）
  - [ ] TabBar 支持选中状态高亮和切换动画
  - [ ] 所有组件适配暗色模式（使用 Tailwind dark: 前缀）

#### TASK-FE1-003: 配置预览组件
- **关联需求**：F-005, F-011
- **文件范围**：
  - `src/components/preview/PreviewPanel.tsx`（新建）
  - `src/components/preview/SyntaxHighlight.tsx`（新建）
- **依赖**：TASK-FE1-001
- **验收标准**：
  - [ ] PreviewPanel 接收 configString 和 format 参数
  - [ ] 使用 SyntaxHighlight 组件渲染代码
  - [ ] 右上角显示复制按钮
  - [ ] 点击复制按钮调用 copyToClipboard 函数
  - [ ] 复制成功显示"已复制"提示（2 秒后消失）
  - [ ] 支持滚动（内容超出时）
  - [ ] 使用等宽字体和浅灰色背景

---

### FE-2（前端开发 2 号）- 表单组件与交互

#### TASK-FE2-001: Codex 配置表单
- **关联需求**：F-002, F-009
- **文件范围**：
  - `src/components/forms/CodexForm.tsx`（新建）
  - `src/components/forms/CodexFormFields.tsx`（新建）
- **依赖**：基础设施就绪、TASK-FE1-001
- **验收标准**：
  - [ ] 表单包含 Codex 所有配置项（api.key, api.base_url, model.name 等）
  - [ ] 使用 React Hook Form 管理表单状态
  - [ ] 使用 Zod Schema 进行验证
  - [ ] 字段分组：基础配置、高级配置（可折叠）
  - [ ] 必填字段显示红色星号
  - [ ] 验证错误显示在字段下方
  - [ ] 表单值变化时触发 onChange 回调
  - [ ] 支持 reset 方法重置表单

#### TASK-FE2-002: Claude Code 配置表单
- **关联需求**：F-003, F-009
- **文件范围**：
  - `src/components/forms/ClaudeForm.tsx`（新建）
  - `src/components/forms/ClaudeFormFields.tsx`（新建）
  - `src/components/forms/ArrayField.tsx`（新建）
- **依赖**：基础设施就绪、TASK-FE1-001
- **验收标准**：
  - [ ] 表单包含 Claude Code 所有配置项
  - [ ] ArrayField 组件支持动态添加/删除数组项（如 ignorePatterns）
  - [ ] 使用 Toggle 组件处理布尔字段
  - [ ] 嵌套对象使用 Card 组件包裹
  - [ ] 使用 React Hook Form 和 Zod 验证
  - [ ] 表单值变化时触发 onChange 回调
  - [ ] 支持 reset 方法重置表单

#### TASK-FE2-003: Gemini CLI 配置表单
- **关联需求**：F-004, F-009
- **文件范围**：
  - `src/components/forms/GeminiForm.tsx`（新建）
  - `src/components/forms/GeminiFormFields.tsx`（新建）
- **依赖**：基础设施就绪、TASK-FE1-001
- **验收标准**：
  - [ ] 表单包含 Gemini CLI 所有配置项
  - [ ] safetySettings 使用 Select 组件（下拉选择）
  - [ ] 验证 API Key 格式（AIza 开头）
  - [ ] 使用 React Hook Form 和 Zod 验证
  - [ ] 表单值变化时触发 onChange 回调
  - [ ] 支持 reset 方法重置表单

---

### BE-1（模块开发 1 号）- 配置解析与生成

#### TASK-BE1-001: 配置解析器实现
- **关联需求**：F-005, F-007
- **文件范围**：
  - `src/utils/parser.ts`（新建）
- **依赖**：基础设施就绪
- **API 实现**：
  - `stringifyJSON(config, pretty)` → 将配置对象转为 JSON 字符串
  - `stringifyTOML(config)` → 将配置对象转为 TOML 字符串
  - `parseJSON(content)` → 解析 JSON 字符串为配置对象
  - `parseTOML(content)` → 解析 TOML 字符串为配置对象
  - `generateConfigString(tool, config)` → 根据工具类型生成配置字符串
- **验收标准**：
  - [ ] stringifyJSON 生成格式化的 JSON（2 空格缩进）
  - [ ] stringifyTOML 使用 @iarna/toml 库生成 TOML
  - [ ] parseJSON 能正确解析 JSON，格式错误时抛出异常
  - [ ] parseTOML 能正确解析 TOML，格式错误时抛出异常
  - [ ] generateConfigString 根据 tool 类型调用对应的 stringify 函数
  - [ ] 所有函数有完整的 TypeScript 类型定义
  - [ ] 所有函数有 JSDoc 注释

#### TASK-BE1-002: 配置解析器单元测试
- **关联需求**：F-005, F-007
- **文件范围**：
  - `src/utils/__tests__/parser.test.ts`（新建）
- **依赖**：TASK-BE1-001
- **验收标准**：
  - [ ] 测试 stringifyJSON 的正确性和格式化
  - [ ] 测试 stringifyTOML 的正确性
  - [ ] 测试 parseJSON 的正确解析和错误处理
  - [ ] 测试 parseTOML 的正确解析和错误处理
  - [ ] 测试 generateConfigString 对三种工具的支持
  - [ ] 测试覆盖率 > 90%

---

### BE-2（模块开发 2 号）- 文件操作与剪贴板

#### TASK-BE2-001: 文件操作工具实现
- **关联需求**：F-006, F-007, F-011
- **文件范围**：
  - `src/utils/file.ts`（新建）
- **依赖**：基础设施就绪
- **API 实现**：
  - `exportConfigFile(options)` → 导出配置文件到本地
  - `importConfigFile(file, tool)` → 导入配置文件并解析
  - `copyToClipboard(text)` → 复制文本到剪贴板
  - `readFileAsText(file)` → 读取文件内容为文本
- **验收标准**：
  - [ ] exportConfigFile 使用 Blob 和 URL.createObjectURL 实现下载
  - [ ] 导出的文件名根据 format 自动添加扩展名（.json 或 .toml）
  - [ ] importConfigFile 调用 readFileAsText 读取文件
  - [ ] importConfigFile 根据文件扩展名调用对应的 parser
  - [ ] importConfigFile 返回 ImportResult 类型（success + data/error）
  - [ ] copyToClipboard 使用 navigator.clipboard.writeText
  - [ ] copyToClipboard 处理不支持的浏览器（返回 false）
  - [ ] 所有函数有完整的 TypeScript 类型定义和 JSDoc 注释

#### TASK-BE2-002: 文件操作单元测试
- **关联需求**：F-006, F-007, F-011
- **文件范围**：
  - `src/utils/__tests__/file.test.ts`（新建）
- **依赖**：TASK-BE2-001
- **验收标准**：
  - [ ] 测试 exportConfigFile 的文件生成
  - [ ] 测试 importConfigFile 的正确解析和错误处理
  - [ ] 测试 copyToClipboard 的成功和失败场景
  - [ ] 测试 readFileAsText 的文件读取
  - [ ] 使用 Mock 模拟浏览器 API（Blob, FileReader, Clipboard）
  - [ ] 测试覆盖率 > 90%

---

### BE-3（模块开发 3 号）- 验证与模板管理

#### TASK-BE3-001: 验证工具实现
- **关联需求**：F-009
- **文件范围**：
  - `src/utils/validator.ts`（新建）
- **依赖**：基础设施就绪
- **API 实现**：
  - `validateApiKey(key, tool)` → 验证 API Key 格式
  - `validateURL(url)` → 验证 URL 格式
  - `validateNumberRange(value, min, max)` → 验证数值范围
  - `getFieldError(fieldName, value, field)` → 获取字段验证错误
- **验收标准**：
  - [ ] validateApiKey 检查不同工具的 API Key 格式（sk-/sk-ant-/AIza）
  - [ ] validateURL 使用 URL 构造函数验证
  - [ ] validateNumberRange 检查数值是否在范围内
  - [ ] getFieldError 根据字段定义返回错误信息
  - [ ] 所有函数有完整的 TypeScript 类型定义和 JSDoc 注释

#### TASK-BE3-002: 配置模板管理
- **关联需求**：F-008
- **文件范围**：
  - `src/utils/template.ts`（新建）
  - `src/constants/templates.ts`（新建）
- **依赖**：基础设施就绪
- **API 实现**：
  - `getTemplatesByTool(tool)` → 获取指定工具的所有模板
  - `getTemplateById(templateId)` → 根据 ID 获取模板
  - `applyTemplate(templateId)` → 应用模板返回配置值
- **验收标准**：
  - [ ] templates.ts 定义每个工具至少 3 个模板（开发/生产/安全）
  - [ ] 模板包含完整的配置值和描述
  - [ ] getTemplatesByTool 过滤并返回对应工具的模板
  - [ ] getTemplateById 查找并返回模板，不存在返回 null
  - [ ] applyTemplate 返回模板的 values 字段
  - [ ] 所有函数有完整的 TypeScript 类型定义和 JSDoc 注释

#### TASK-BE3-003: 验证和模板单元测试
- **关联需求**：F-008, F-009
- **文件范围**：
  - `src/utils/__tests__/validator.test.ts`（新建）
  - `src/utils/__tests__/template.test.ts`（新建）
- **依赖**：TASK-BE3-001, TASK-BE3-002
- **验收标准**：
  - [ ] 测试 validateApiKey 对三种工具的验证
  - [ ] 测试 validateURL 的正确和错误 URL
  - [ ] 测试 validateNumberRange 的边界情况
  - [ ] 测试 getFieldError 的各种验证场景
  - [ ] 测试模板管理函数的正确性
  - [ ] 测试覆盖率 > 90%

---

### BE-4（模块开发 4 号）- 类型定义与 Schema

#### TASK-BE4-001: TypeScript 类型定义
- **关联需求**：全部功能
- **文件范围**：
  - `src/types/config.ts`（新建）
  - `src/types/form.ts`（新建）
  - `src/types/template.ts`（新建）
  - `src/types/common.ts`（新建）
- **依赖**：基础设施就绪
- **验收标准**：
  - [ ] config.ts 定义 CodexConfig, ClaudeConfig, GeminiConfig 类型
  - [ ] config.ts 定义 ToolType, ConfigValues 类型
  - [ ] form.ts 定义 FormField, ValidationErrors 类型
  - [ ] template.ts 定义 ConfigTemplate 类型
  - [ ] common.ts 定义 ExportOptions, ImportResult 类型
  - [ ] 所有类型有完整的 JSDoc 注释（含字段语义说明）
  - [ ] 导出所有类型供其他模块使用

#### TASK-BE4-002: Zod 验证 Schema
- **关联需求**：F-009
- **文件范围**：
  - `src/schemas/codex.schema.ts`（新建）
  - `src/schemas/claude.schema.ts`（新建）
  - `src/schemas/gemini.schema.ts`（新建）
- **依赖**：TASK-BE4-001
- **验收标准**：
  - [ ] codex.schema.ts 定义 CodexConfig 的 Zod Schema
  - [ ] claude.schema.ts 定义 ClaudeConfig 的 Zod Schema
  - [ ] gemini.schema.ts 定义 GeminiConfig 的 Zod Schema
  - [ ] Schema 包含所有字段的验证规则（必填、类型、范围等）
  - [ ] Schema 包含自定义错误信息（中文）
  - [ ] 导出 Schema 供表单组件使用

#### TASK-BE4-003: 表单字段定义
- **关联需求**：F-002, F-003, F-004
- **文件范围**：
  - `src/constants/formFields.ts`（新建）
- **依赖**：TASK-BE4-001
- **验收标准**：
  - [ ] 定义 Codex 表单字段列表（codexFields: FormField[]）
  - [ ] 定义 Claude Code 表单字段列表（claudeFields: FormField[]）
  - [ ] 定义 Gemini CLI 表单字段列表（geminiFields: FormField[]）
  - [ ] 每个字段包含 name, label, type, required, defaultValue 等属性
  - [ ] 字段包含 placeholder 和 helpText 提示信息
  - [ ] Select 类型字段包含 options 列表
  - [ ] 导出字段定义供表单组件使用

---

## 基础设施清单（项目经理负责）

### TASK-INFRA-001: 项目初始化
- **文件范围**：
  - `package.json`（新建）
  - `tsconfig.json`（新建）
  - `vite.config.ts`（新建）
  - `tailwind.config.js`（新建）
  - `postcss.config.js`（新建）
  - `index.html`（新建）
  - `src/main.tsx`（新建）
  - `src/App.tsx`（新建）
  - `src/index.css`（新建）
- **验收标准**：
  - [ ] 安装 React 18 + TypeScript 5 + Vite 5
  - [ ] 安装 Tailwind CSS 3 + PostCSS
  - [ ] 安装 React Hook Form 7 + Zod 3
  - [ ] 安装 @iarna/toml + Prism.js
  - [ ] 安装开发依赖（@types/react, @vitejs/plugin-react 等）
  - [ ] 配置 TypeScript（strict 模式）
  - [ ] 配置 Tailwind（包含 dark 模式）
  - [ ] 配置 Vite（端口、别名等）
  - [ ] 创建基础 HTML 模板
  - [ ] 创建根组件骨架
  - [ ] 运行 `npm install` 确认依赖安装成功
  - [ ] 运行 `npm run dev` 确认项目可启动

### TASK-INFRA-002: 公共类型和契约定义
- **文件范围**：
  - `src/types/config.ts`（新建，骨架）
  - `src/types/form.ts`（新建，骨架）
  - `src/types/template.ts`（新建，骨架）
  - `src/types/common.ts`（新建，骨架）
- **验收标准**：
  - [ ] 创建类型文件骨架（导出空接口或基础类型）
  - [ ] 添加 JSDoc 注释说明每个文件的用途
  - [ ] 确保文件可被其他模块导入
  - [ ] 运行 `npx tsc --noEmit` 确认无类型错误

### TASK-INFRA-003: 目录结构创建
- **文件范围**：
  - `src/components/common/`（新建目录）
  - `src/components/layout/`（新建目录）
  - `src/components/forms/`（新建目录）
  - `src/components/preview/`（新建目录）
  - `src/hooks/`（新建目录）
  - `src/utils/`（新建目录）
  - `src/schemas/`（新建目录）
  - `src/constants/`（新建目录）
  - `public/`（新建目录）
- **验收标准**：
  - [ ] 创建所有必需的目录
  - [ ] 每个目录添加 `.gitkeep` 文件（保持目录结构）
  - [ ] 确认目录结构与架构设计一致

### TASK-INFRA-004: Git 和部署配置
- **文件范围**：
  - `.gitignore`（修改）
  - `README.md`（新建）
  - `.github/workflows/deploy.yml`（新建，可选）
- **验收标准**：
  - [ ] .gitignore 包含 node_modules, dist, .env 等
  - [ ] README.md 包含项目说明、安装步骤、开发命令
  - [ ] （可选）配置 Cloudflare Pages 自动部署

---

## 文件分配矩阵

| 文件路径 | 负责人 | 操作 |
|---------|--------|------|
| `src/components/common/Button.tsx` | FE-1 | 新建 |
| `src/components/common/Input.tsx` | FE-1 | 新建 |
| `src/components/common/Select.tsx` | FE-1 | 新建 |
| `src/components/common/Toggle.tsx` | FE-1 | 新建 |
| `src/components/common/Card.tsx` | FE-1 | 新建 |
| `src/components/common/Toast.tsx` | FE-1 | 新建 |
| `src/components/layout/Header.tsx` | FE-1 | 新建 |
| `src/components/layout/Footer.tsx` | FE-1 | 新建 |
| `src/components/layout/Container.tsx` | FE-1 | 新建 |
| `src/components/layout/TabBar.tsx` | FE-1 | 新建 |
| `src/components/preview/PreviewPanel.tsx` | FE-1 | 新建 |
| `src/components/preview/SyntaxHighlight.tsx` | FE-1 | 新建 |
| `src/components/forms/CodexForm.tsx` | FE-2 | 新建 |
| `src/components/forms/CodexFormFields.tsx` | FE-2 | 新建 |
| `src/components/forms/ClaudeForm.tsx` | FE-2 | 新建 |
| `src/components/forms/ClaudeFormFields.tsx` | FE-2 | 新建 |
| `src/components/forms/ArrayField.tsx` | FE-2 | 新建 |
| `src/components/forms/GeminiForm.tsx` | FE-2 | 新建 |
| `src/components/forms/GeminiFormFields.tsx` | FE-2 | 新建 |
| `src/utils/parser.ts` | BE-1 | 新建 |
| `src/utils/__tests__/parser.test.ts` | BE-1 | 新建 |
| `src/utils/file.ts` | BE-2 | 新建 |
| `src/utils/__tests__/file.test.ts` | BE-2 | 新建 |
| `src/utils/validator.ts` | BE-3 | 新建 |
| `src/utils/template.ts` | BE-3 | 新建 |
| `src/constants/templates.ts` | BE-3 | 新建 |
| `src/utils/__tests__/validator.test.ts` | BE-3 | 新建 |
| `src/utils/__tests__/template.test.ts` | BE-3 | 新建 |
| `src/types/config.ts` | BE-4 | 新建 |
| `src/types/form.ts` | BE-4 | 新建 |
| `src/types/template.ts` | BE-4 | 新建 |
| `src/types/common.ts` | BE-4 | 新建 |
| `src/schemas/codex.schema.ts` | BE-4 | 新建 |
| `src/schemas/claude.schema.ts` | BE-4 | 新建 |
| `src/schemas/gemini.schema.ts` | BE-4 | 新建 |
| `src/constants/formFields.ts` | BE-4 | 新建 |

> ⚠️ **关键规则**：任何文件只能出现在一个开发者的范围内，不允许重叠。

---

## 跨模块数据流

### 核心功能数据流图

#### 1. 表单填写与实时预览

```
[用户在表单中输入]
  ↓
CodexForm/ClaudeForm/GeminiForm (FE-2)
  ↓ onChange 事件
React Hook Form 状态更新
  ↓ 触发验证
Zod Schema 验证 (BE-4)
  ↓ 验证通过
更新 configValues 状态
  ↓ 调用
generateConfigString(tool, configValues) (BE-1)
  ↓ 返回
configString: string
  ↓ 传递给
PreviewPanel (FE-1)
  ↓ 渲染
SyntaxHighlight 语法高亮显示 (FE-1)
```

**涉及模块**：FE-2（表单）→ BE-4（验证）→ BE-1（生成）→ FE-1（预览）

#### 2. 配置文件导出

```
[用户点击导出按钮]
  ↓
ExportButton (FE-1 或 App.tsx)
  ↓ 获取
当前 configValues 和 tool
  ↓ 调用
generateConfigString(tool, configValues) (BE-1)
  ↓ 返回
configString: string
  ↓ 调用
exportConfigFile({ filename, format, content }) (BE-2)
  ↓ 内部处理
创建 Blob → URL.createObjectURL → 触发下载
  ↓ 成功后
显示 Toast 通知 (FE-1)
```

**涉及模块**：FE-1（按钮+通知）→ BE-1（生成）→ BE-2（导出）

#### 3. 配置文件导入

```
[用户选择文件]
  ↓
ImportButton → <input type="file"> (FE-1 或 App.tsx)
  ↓ onChange 事件
获取 File 对象
  ↓ 调用
importConfigFile(file, tool) (BE-2)
  ↓ 内部调用
readFileAsText(file) (BE-2)
  ↓ 根据扩展名调用
parseJSON(content) 或 parseTOML(content) (BE-1)
  ↓ 返回
ImportResult { success, data?, error? }
  ↓ 成功时
React Hook Form.reset(data) 填充表单 (FE-2)
  ↓ 失败时
显示错误 Toast (FE-1)
```

**涉及模块**：FE-1（按钮+通知）→ BE-2（文件读取）→ BE-1（解析）→ FE-2（表单填充）

#### 4. 应用配置模板

```
[用户选择模板]
  ↓
TemplateSelector (FE-1 或 App.tsx)
  ↓ onChange 事件
获取 templateId
  ↓ 调用
applyTemplate(templateId) (BE-3)
  ↓ 内部调用
getTemplateById(templateId) (BE-3)
  ↓ 返回
ConfigValues
  ↓ 调用
React Hook Form.reset(values) (FE-2)
  ↓ 触发
表单状态更新 → 预览更新
```

**涉及模块**：FE-1（选择器）→ BE-3（模板管理）→ FE-2（表单填充）

#### 5. 表单验证

```
[用户输入字段值]
  ↓
Input/Select/Toggle 组件 (FE-1)
  ↓ onChange 事件
React Hook Form 更新字段值 (FE-2)
  ↓ 触发验证
Zod Schema 验证 (BE-4)
  ↓ 验证失败
返回 ValidationErrors
  ↓ 显示
错误信息在字段下方 (FE-1 Input 组件)
```

**涉及模块**：FE-1（输入组件）→ FE-2（表单管理）→ BE-4（验证规则）→ FE-1（错误显示）

---

## 集成验证要点

| 验证项 | 检查内容 | 涉及模块 | 验证方法 |
|--------|---------|---------|---------|
| 类型一致 | 前端组件使用的类型与 types/ 定义完全匹配 | FE-1, FE-2, BE-4 | TypeScript 编译检查 |
| 函数签名 | 调用 utils/ 函数时参数和返回值类型正确 | 全部 | TypeScript 编译检查 |
| 命名一致 | 所有模块使用共享概念命名规范表中的命名 | 全部 | Code Review |
| 数据格式 | 配置对象的字段格式与类型定义一致 | 全部 | 单元测试 + 集成测试 |
| 导入路径 | 所有模块正确导入共享类型和工具函数 | 全部 | TypeScript 编译检查 |
| 验证规则 | Zod Schema 与 FormField 定义的验证规则一致 | BE-4 | 单元测试 |
| 解析正确性 | parser.ts 生成的配置文件能被对应工具正确解析 | BE-1 | 手动测试 + 单元测试 |
| 文件操作 | 导入导出功能在不同浏览器中正常工作 | BE-2 | 手动测试（Chrome/Firefox/Safari） |

---

## 开发顺序建议

### 第一阶段：基础设施（项目经理）
1. TASK-INFRA-001: 项目初始化
2. TASK-INFRA-002: 公共类型和契约定义
3. TASK-INFRA-003: 目录结构创建
4. TASK-INFRA-004: Git 和部署配置

**里程碑**：项目可启动，目录结构就绪，类型骨架完成

### 第二阶段：核心模块（并行开发）
- **BE-4**：完成所有类型定义和 Schema（优先级最高，其他模块依赖）
  - TASK-BE4-001 → TASK-BE4-002 → TASK-BE4-003
- **BE-1**：完成配置解析器（FE-1 和 FE-2 依赖）
  - TASK-BE1-001 → TASK-BE1-002
- **BE-2**：完成文件操作（FE-1 依赖）
  - TASK-BE2-001 → TASK-BE2-002
- **BE-3**：完成验证和模板（FE-2 依赖）
  - TASK-BE3-001 → TASK-BE3-002 → TASK-BE3-003

**里程碑**：所有工具函数和类型定义完成，单元测试通过

### 第三阶段：UI 组件（并行开发）
- **FE-1**：完成基础组件和布局
  - TASK-FE1-001 → TASK-FE1-002 → TASK-FE1-003
- **FE-2**：完成表单组件（依赖 FE-1 的基础组件）
  - TASK-FE2-001 → TASK-FE2-002 → TASK-FE2-003

**里程碑**：所有 UI 组件完成，可独立预览

### 第四阶段：集成与测试
1. 集成所有模块到 App.tsx
2. 端到端测试（表单填写 → 预览 → 导出 → 导入）
3. 浏览器兼容性测试
4. 性能优化（首屏加载、表单响应）
5. 部署到 Cloudflare Pages

**里程碑**：MVP 功能完整，可上线使用

---

## 注意事项

### 开发规范
1. **TypeScript 严格模式**：所有代码必须通过 `npx tsc --noEmit` 检查
2. **代码风格**：使用 Prettier 格式化，遵循 ESLint 规则
3. **组件规范**：所有组件使用函数式组件 + Hooks
4. **样式规范**：优先使用 Tailwind 工具类，避免自定义 CSS
5. **测试规范**：工具函数必须有单元测试，覆盖率 > 90%

### 协作规范
1. **分支管理**：每个开发者在独立分支开发（fe-1, fe-2, be-1 等）
2. **提交规范**：使用语义化提交信息（feat/fix/docs/test）
3. **代码审查**：完成任务后提交 PR，至少一人审查
4. **冲突解决**：如遇文件冲突，立即联系项目经理

### 集成规范
1. **类型导入**：统一从 `@/types` 导入类型
2. **工具导入**：统一从 `@/utils` 导入工具函数
3. **组件导入**：统一从 `@/components` 导入组件
4. **路径别名**：使用 `@/` 代替 `src/`（在 vite.config.ts 配置）

### 测试规范
1. **单元测试**：使用 Vitest + Testing Library
2. **测试文件**：放在 `__tests__` 目录，命名为 `*.test.ts(x)`
3. **Mock 策略**：浏览器 API 使用 Mock（Blob, FileReader, Clipboard）
4. **测试覆盖**：工具函数 > 90%，组件 > 70%

---

## 任务量评估

| 开发者 | 任务数 | 预估工时 | 主要工作 |
|--------|--------|---------|---------|
| FE-1 | 3 | 16-20h | 12 个基础组件 + 4 个布局组件 + 2 个预览组件 |
| FE-2 | 3 | 18-22h | 3 个表单组件 + 表单字段组件 + 数组字段组件 |
| BE-1 | 2 | 12-16h | 5 个解析函数 + 单元测试 |
| BE-2 | 2 | 12-16h | 4 个文件操作函数 + 单元测试 |
| BE-3 | 3 | 14-18h | 4 个验证函数 + 3 个模板函数 + 模板定义 + 单元测试 |
| BE-4 | 3 | 14-18h | 4 个类型文件 + 3 个 Schema 文件 + 表单字段定义 |

**总计**：86-110 小时（约 2-3 周，6 人并行开发）

---

## 风险与依赖

### 关键依赖路径
1. **BE-4 → 所有模块**：类型定义是所有模块的基础，必须优先完成
2. **BE-1 → FE-1（预览）**：预览组件依赖配置生成函数
3. **BE-2 → FE-1（导入导出）**：文件操作依赖 BE-2 的工具函数
4. **FE-1 → FE-2**：表单组件依赖基础 UI 组件

### 潜在风险
1. **浏览器兼容性**：Clipboard API 在旧浏览器可能不支持
   - 缓解措施：提供降级方案（document.execCommand）
2. **TOML 解析库**：@iarna/toml 可能有 Bug
   - 缓解措施：充分测试，必要时切换到其他库
3. **表单复杂度**：嵌套对象和数组字段处理复杂
   - 缓解措施：FE-2 预留更多时间，必要时简化 UI
4. **类型定义变更**：类型定义变更影响所有模块
   - 缓解措施：BE-4 优先完成并冻结类型定义

---

## 交付标准

### MVP 交付标准
- [ ] 用户可选择三种工具之一（Codex/Claude/Gemini）
- [ ] 用户可填写完整的配置表单
- [ ] 表单实时显示配置文件预览
- [ ] 用户可导出配置文件（JSON/TOML）
- [ ] 表单验证能捕获常见错误
- [ ] 所有工具函数有单元测试，覆盖率 > 90%
- [ ] 项目可在 Cloudflare Pages 部署并访问
- [ ] 首屏加载时间 < 2s（3G 网络）
- [ ] 支持 Chrome/Firefox/Safari 最新版本

### V1.1 交付标准（可选）
- [ ] 用户可导入现有配置文件
- [ ] 用户可选择配置模板快速填充
- [ ] 用户可一键复制配置内容
- [ ] 用户可重置表单到默认值
- [ ] 支持暗色模式切换


