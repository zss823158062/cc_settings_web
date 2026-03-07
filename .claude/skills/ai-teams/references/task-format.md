# 任务分配格式规范

项目经理输出 `docs/tasks.md` 时必须遵循以下格式：

---

```markdown
# [项目名称] - 开发任务分配

## 架构概要

### 技术栈
- 前端：xxx
- 后端：xxx
- 数据库：xxx

### 目录结构
```
project/
├── frontend/     # 前端代码
├── backend/      # 后端代码
├── shared/       # 共享类型/契约
└── docs/         # 文档
```

### API 契约规范

#### 契约文件位置
- `shared/types.ts` 或类似路径
- `shared/api-contracts.ts` 或类似路径

#### 数据类型定义（含字段语义注释）

每个共享类型的每个字段必须包含语义注释：

```typescript
/** 用户信息 */
interface User {
  /** 用户唯一标识，UUID v4 格式 */
  id: string;
  /** 用户显示名称，2-50 字符 */
  name: string;
  /** 创建时间，ISO 8601 格式，UTC 时区 */
  createdAt: string;
  /** 用户状态：active=正常, disabled=禁用 */
  status: 'active' | 'disabled';
}
```

#### 函数签名定义

API 契约必须包含完整的函数签名，不能只有数据结构：

```typescript
// 后端服务函数签名
/** 创建用户，返回新用户信息 */
function createUser(params: CreateUserParams): Promise<User>;
/** 根据 ID 查询用户，不存在返回 null */
function getUserById(id: string): Promise<User | null>;

// 前端 API 调用函数签名
/** 调用后端创建用户接口 */
function apiCreateUser(params: CreateUserParams): Promise<ApiResponse<User>>;

// Tauri Command 签名（如适用）
#[tauri::command]
async fn create_user(params: CreateUserParams) -> Result<User, AppError>;
```

#### 跨模块数据流图

描述数据从 UI 到持久层的完整流转：

```
用户操作 → 前端组件 → API 调用函数 → HTTP/IPC → 后端路由 → 服务层 → 数据库
                ↓                                            ↓
          前端状态更新 ←── 响应数据 ←── API 响应 ←── 服务返回值
```

对每个核心功能，画出具体的数据流：

```
[创建用户]
UI: CreateUserForm
  → 调用 apiCreateUser({ name, email })
  → POST /api/users (body: CreateUserParams)
  → UsersController.create()
  → UserService.createUser(params)
  → INSERT INTO users (...)
  → 返回 User 对象
  → 前端更新用户列表状态
```

#### 共享概念命名规范表

| 概念 | 命名 | 格式 | 生成方 | 消费方 | 示例 |
|------|------|------|--------|--------|------|
| 用户 ID | userId | UUID v4 | 后端 | 前端+后端 | "550e8400-..." |
| 时间戳 | xxxAt | ISO 8601 UTC | 后端 | 前端+后端 | "2024-01-01T00:00:00Z" |
| 分页参数 | page/pageSize | 正整数 | 前端 | 后端 | page=1, pageSize=20 |

> 所有开发者必须严格使用此表中的命名和格式，禁止自行发明。

## 任务分配

### FE-1（前端开发 1 号）

#### TASK-FE1-001: [任务标题]
- **关联需求**：F-001
- **文件范围**：
  - `frontend/src/components/Xxx.tsx`（新建）
  - `frontend/src/hooks/useXxx.ts`（新建）
- **依赖**：基础设施就绪
- **验收标准**：
  - [ ] 标准 1
  - [ ] 标准 2

#### TASK-FE1-002: [任务标题]
...

### FE-2（前端开发 2 号）
（同上格式）

### BE-1（后端开发 1 号）

#### TASK-BE1-001: [任务标题]
- **关联需求**：F-001
- **文件范围**：
  - `backend/src/routes/xxx.ts`（新建）
  - `backend/src/services/xxxService.ts`（新建）
  - `backend/src/models/xxx.ts`（新建）
- **依赖**：基础设施就绪
- **API 实现**：
  - `POST /api/xxx` → 实现创建逻辑
  - `GET /api/xxx/:id` → 实现查询逻辑
- **验收标准**：
  - [ ] 标准 1
  - [ ] 标准 2

### BE-2（后端开发 2 号）
（同上格式）

### BE-3（后端开发 3 号）
（同上格式）

### BE-4（后端开发 4 号）
（同上格式）

## 基础设施清单（项目经理负责）

### TASK-INFRA-001: 项目初始化
- 创建项目骨架
- 配置文件
- 安装依赖

### TASK-INFRA-002: 公共类型定义
- 共享类型文件（每个字段含语义注释）
- API 契约定义（含完整函数签名）
- 共享概念命名规范

### TASK-INFRA-003: 数据库 Schema
- 数据库初始化脚本
- 模型定义

## 文件分配矩阵

| 文件路径 | 负责人 | 操作 |
|---------|--------|------|
| `frontend/src/components/A.tsx` | FE-1 | 新建 |
| `frontend/src/components/B.tsx` | FE-2 | 新建 |
| `backend/src/routes/a.ts` | BE-1 | 新建 |
| ... | ... | ... |

> ⚠️ **关键规则**：任何文件只能出现在一个开发者的范围内，不允许重叠。

## 跨模块数据流

### 数据流图

对每个核心功能绘制数据流图（格式见上方 API 契约规范中的数据流图模板）。

### 集成验证要点

| 验证项 | 检查内容 | 涉及模块 |
|--------|---------|---------|
| 类型一致 | 前后端共享类型是否完全匹配 | 前端 + 后端 |
| 函数签名 | API 调用是否匹配契约函数签名 | 前端 + 后端 |
| 命名一致 | 共享概念命名是否与规范表一致 | 全部 |
| 数据格式 | 日期/ID/枚举格式是否统一 | 全部 |
| 导入路径 | 共享类型导入路径是否正确 | 全部 |
```

## 编号规则

- 基础设施任务：`TASK-INFRA-XXX`
- 前端任务：`TASK-FE{N}-XXX`（N = 开发者编号 1-2）
- 后端任务：`TASK-BE{N}-XXX`（N = 开发者编号 1-4）

## 拆解原则

1. **文件不重叠**：每个文件只属于一个开发者
2. **接口先行**：API 契约在基础设施阶段完成
3. **工作量均衡**：每个开发者的任务量大致相当
4. **独立可测**：每个任务完成后可独立验证
5. **粒度适中**：每个任务 1-3 个文件，避免过大或过小
6. **数据流一致**：前后端对同一数据的命名、格式、流转路径必须在契约中明确
7. **编译可通**：每个任务的代码必须能独立通过编译检查（在 worktree 环境中）
