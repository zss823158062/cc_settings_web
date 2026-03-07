# AI Teams - 多 Agent 协作开发团队

通过多个 AI Agent 协作完成软件开发项目。像一个真实的开发团队一样运作：产品经理分析需求，项目经理拆解任务，开发者并行编码。

## 使用方式

用户输入 `/ai-teams` 后跟需求描述，例如：
```
/ai-teams 做一个 Todo 应用，支持增删改查和分类管理
```

如果用户没有提供需求描述，询问用户想要构建什么。

## 团队配置

| 角色 | Agent | 模型 | 数量 | 职责 |
|------|-------|------|------|------|
| 产品经理 | product-manager | sonnet | 1 | 需求分析 → PRD |
| 项目经理 | project-manager | sonnet | 1 | 任务拆解 → 分配 |
| 前端开发 | frontend-dev | sonnet | 2 | 前端编码 |
| 后端开发 | backend-dev | sonnet | 4 | 后端编码 |

> **说明**：开发者使用 sonnet 模型以保证代码质量和编译通过率。haiku 在复杂项目中容易产生大量编译错误。

## 工作流程

**严格按照以下 7 个阶段顺序执行，每个暂停点必须等待用户确认后才能继续。**

---

### 阶段 0：环境准备

检查并初始化项目环境：

```bash
# 环境预检
echo "=== 环境预检 ==="

# 检查项目路径是否包含非 ASCII 字符或空格
PROJECT_DIR=$(pwd)
if echo "$PROJECT_DIR" | grep -P '[^\x00-\x7F]' > /dev/null 2>&1; then
  echo "⚠️ 警告：项目路径包含非 ASCII 字符（如中文），可能导致部分工具异常"
  echo "   路径: $PROJECT_DIR"
  echo "   建议：将项目移至纯英文路径下"
fi
if echo "$PROJECT_DIR" | grep ' ' > /dev/null 2>&1; then
  echo "⚠️ 警告：项目路径包含空格，可能导致脚本异常"
fi

# 检查必要工具链
echo "--- 工具链检查 ---"
git --version || echo "❌ git 未安装"
node --version 2>/dev/null && echo "✅ Node.js 可用" || echo "⚠️ Node.js 未安装（前端项目需要）"
npm --version 2>/dev/null && echo "✅ npm 可用" || echo "⚠️ npm 未安装"
cargo --version 2>/dev/null && echo "✅ Cargo 可用" || echo "ℹ️ Cargo 未安装（Rust/Tauri 项目需要）"

# 检查是否有 git 仓库，没有则初始化
git rev-parse --git-dir 2>/dev/null || git init

# 创建 docs 目录
mkdir -p docs

# 确保 .gitignore 存在并包含必要条目
touch .gitignore
grep -q "node_modules" .gitignore 2>/dev/null || echo "node_modules/" >> .gitignore
grep -q ".worktrees" .gitignore 2>/dev/null || echo ".worktrees/" >> .gitignore
```

完成后输出：
```
✅ 环境准备完成
- 环境预检：已完成（列出警告项）
- Git 仓库：已初始化
- docs 目录：已创建
- .gitignore：已配置
```

---

### 阶段 1：需求分析

启动产品经理 Agent 分析需求：

```
调用 Agent:
- subagent_type: "coder"
- model: sonnet
- description: "产品经理分析需求"
- prompt: |
    你是产品经理。请阅读 `.claude/agents/product-manager.md` 了解你的角色定义。
    参考 `.claude/skills/ai-teams/references/prd-format.md` 了解输出格式。

    用户需求如下：
    ---
    {用户的原始需求}
    ---

    请完成以下工作：
    1. 使用 Glob 和 Grep 了解项目现有代码结构（如果有）
    2. 分析用户需求，撰写完整的 PRD
    3. 将 PRD 写入 docs/prd.md

    注意：只写文档，不修改任何代码文件。
```

#### **⏸️ 暂停点 1**：

等待 Agent 完成后：
1. 读取 `docs/prd.md`
2. 向用户展示 PRD 摘要（功能清单表格 + 待确认事项）
3. 询问用户：「PRD 已生成，请确认是否满意。如需修改请说明，确认后将进入任务拆解阶段。」
4. **等待用户回复，确认后才能继续**

---

### 阶段 2：任务拆解

启动项目经理 Agent 拆解任务：

```
调用 Agent:
- subagent_type: "coder"
- model: sonnet
- description: "项目经理拆解任务"
- prompt: |
    你是项目经理。请阅读 `.claude/agents/project-manager.md` 了解你的角色定义。
    参考 `.claude/skills/ai-teams/references/task-format.md` 了解输出格式。

    请完成以下工作：
    1. 阅读 docs/prd.md 了解产品需求
    2. 使用 Glob 和 Grep 了解项目现有代码结构（如果有）
    3. 设计系统架构和技术选型
    4. 将需求拆解为 6 个开发者的并行任务（2 前端 + 4 后端）
    5. 确保文件范围不重叠
    6. 定义函数签名级 API 契约（不只是数据结构，必须包含完整的函数签名、参数类型、返回类型、字段语义注释）
    7. 定义跨模块数据流图（说明数据从 UI 到数据库的完整流转路径）
    8. 建立共享概念命名规范表（确保前后端对同一概念使用一致的命名）
    9. 将任务分配写入 docs/tasks.md

    关键规则：
    - 每个文件只分配给一个开发者
    - API 契约必须包含函数签名（参数类型 + 返回类型），不能只有数据结构
    - 共享类型的每个字段必须有语义注释（用途、格式、约束）
    - 任务量尽量均衡
    - 注意：只写文档，不修改代码文件
```

#### **⏸️ 暂停点 2**：

等待 Agent 完成后：
1. 读取 `docs/tasks.md`
2. 向用户展示任务分配概要（每个开发者的任务列表 + 文件分配矩阵）
3. 询问用户：「任务已拆解完成，请确认分配是否合理。确认后将开始搭建基础设施。」
4. **等待用户回复，确认后才能继续**

---

### 阶段 3：基础设施搭建

启动项目经理 Agent 搭建基础设施：

```
调用 Agent:
- subagent_type: "coder"
- model: sonnet
- description: "搭建项目基础设施"
- prompt: |
    你是项目经理。请阅读 `.claude/agents/project-manager.md` 了解你的角色定义。

    现在进入基础设施搭建模式。请完成以下工作：
    1. 阅读 docs/tasks.md 中的基础设施任务清单
    2. 创建项目骨架（目录结构、配置文件、package.json 等）
    3. 创建共享类型定义和 API 契约文件（必须包含完整的函数签名、字段语义注释）
    4. 创建数据库 Schema（如需要）
    5. 安装必要的依赖
    6. 验证所有依赖安装成功（检查 node_modules 或 Cargo.lock 等）
    7. 运行编译检查，确保基础设施代码编译通过：
       - TypeScript 项目：npx tsc --noEmit
       - Rust/Tauri 项目：cargo check
       - 如果编译失败，必须修复所有错误后才能继续
    8. 使用 git add 和 git commit 提交所有基础设施代码
       commit message: "feat(infra): 初始化项目基础设施"

    注意：只创建公共代码和骨架，不实现业务逻辑。
    关键：编译必须通过，否则开发者将在错误的基础上开发。
```

#### **⏸️ 暂停点 3**：

等待 Agent 完成后：
1. 运行 `git log --oneline -5` 确认提交
2. **运行编译命令验证基础设施**（主编排亲自执行）：
   - TypeScript 项目：`npx tsc --noEmit`
   - Rust/Tauri 项目：`cargo check`
   - 其他：根据项目类型选择合适的编译/检查命令
3. 向用户展示基础设施搭建结果（创建的文件列表 + 编译结果）
4. 如果编译失败，告知用户并询问是否手动修复或重新运行基础设施搭建
5. 编译通过后询问用户：「基础设施已搭建完成且编译通过，已提交到 main 分支。确认后将启动 6 个开发者并行编码。」
6. **等待用户回复，确认后才能继续**

---

### 阶段 4：并行开发（核心阶段）

这是最关键的阶段。6 个开发者 Agent 在独立的 git worktree 中并行编码。

#### 4.1 创建 Worktree

```bash
# 创建 6 个 worktree
git worktree add .worktrees/frontend-1 -b dev/frontend-1
git worktree add .worktrees/frontend-2 -b dev/frontend-2
git worktree add .worktrees/backend-1 -b dev/backend-1
git worktree add .worktrees/backend-2 -b dev/backend-2
git worktree add .worktrees/backend-3 -b dev/backend-3
git worktree add .worktrees/backend-4 -b dev/backend-4
```

#### 4.2 启动 6 个 Agent（在同一消息中并行发起）

**在一条消息中同时发起以下 6 个 Agent 调用**，全部使用 `run_in_background: true`：

**前端开发 1 号：**
```
调用 Agent:
- subagent_type: "coder"
- model: sonnet
- run_in_background: true
- description: "前端开发 1 号编码"
- prompt: |
    你是前端开发 1 号 (FE-1)。请阅读 `.claude/agents/frontend-dev.md` 了解你的角色定义。

    你的工作目录是：{项目根目录}/.worktrees/frontend-1

    请完成以下工作：
    1. 阅读 {项目根目录}/docs/tasks.md 找到分配给 FE-1 的所有任务
    2. 阅读 {项目根目录}/docs/prd.md 了解产品需求
    3. 仔细阅读 API 契约文件中的函数签名、字段语义注释和数据流定义
    4. 确认项目依赖版本（查看 package.json 中的框架版本号）
    5. 在当前工作目录中完成所有分配的任务
    6. 只修改任务文件范围内的文件
    7. 编码完成后运行编译检查（npx tsc --noEmit），如果失败则修复（最多尝试 3 次）
    8. 提交代码：
       - 编译通过：git add -A && git commit -m "feat(FE-1): 完成前端任务组 A"
       - 编译失败（3 次修复仍未通过）：git add -A && git commit -m "feat(FE-1): [BUILD FAILED] 完成前端任务组 A"
```

**前端开发 2 号：**（同上结构，替换 FE-1 → FE-2，frontend-1 → frontend-2）

**后端开发 1-4 号：**（同上结构，分别替换为 BE-1 到 BE-4，backend-1 到 backend-4，使用 backend-dev agent 定义）

#### 4.3 等待完成

等待所有 6 个 Agent 完成（系统会自动通知），不要轮询。

#### **⏸️ 暂停点 4**：

所有 Agent 完成后：
1. 检查每个 worktree 的状态：`git -C .worktrees/xxx log --oneline -3`
2. 向用户报告每个开发者的完成状态（特别标注 `[BUILD FAILED]` 的分支）
3. 询问用户：「6 个开发者已完成编码。确认后将开始合并分支。」
4. **等待用户回复，确认后才能继续**

---

### 阶段 5：集成合并

参考 `.claude/skills/ai-teams/references/merge-guide.md` 进行合并。

#### 5.1 合并分支

按顺序合并（后端优先，前端其次）：

```bash
git checkout main

# 后端分支
git merge dev/backend-1 --no-ff -m "merge(BE-1): 后端任务组 A"
git merge dev/backend-2 --no-ff -m "merge(BE-2): 后端任务组 B"
git merge dev/backend-3 --no-ff -m "merge(BE-3): 后端任务组 C"
git merge dev/backend-4 --no-ff -m "merge(BE-4): 后端任务组 D"

# 前端分支
git merge dev/frontend-1 --no-ff -m "merge(FE-1): 前端任务组 A"
git merge dev/frontend-2 --no-ff -m "merge(FE-2): 前端任务组 B"
```

#### 5.2 冲突处理

如果出现合并冲突：
1. 分析冲突原因
2. 按 merge-guide.md 中的原则解决
3. 如果冲突复杂，暂停并告知用户

#### 5.3 集成编译验证

合并完成后，**必须**运行编译检查：

```bash
# 根据项目类型选择编译命令
# TypeScript 项目
npx tsc --noEmit 2>&1

# Rust/Tauri 项目
cargo check 2>&1

# 通用构建
npm run build 2>&1 || echo "无构建脚本"
```

**如果编译失败**，启动集成修复 Agent：

```
调用 Agent:
- subagent_type: "coder"
- model: sonnet
- description: "集成修复编译错误"
- prompt: |
    你是集成修复工程师。合并后的代码编译失败，请修复所有编译错误。

    编译错误信息：
    ---
    {编译错误输出}
    ---

    修复原则：
    1. 以 API 契约文件为准，统一接口调用方式
    2. 阅读 docs/tasks.md 中的 API 契约和数据流定义
    3. 修复导入路径、类型不匹配、缺失字段等问题
    4. 不要改变业务逻辑，只修复编译错误
    5. 修复后重新运行编译检查，确保通过
    6. 提交修复：git add -A && git commit -m "fix(integration): 修复集成编译错误"
```

编译通过后才能进入下一步。

#### 5.4 清理

```bash
# 移除所有 worktree
git worktree remove .worktrees/frontend-1 --force
git worktree remove .worktrees/frontend-2 --force
git worktree remove .worktrees/backend-1 --force
git worktree remove .worktrees/backend-2 --force
git worktree remove .worktrees/backend-3 --force
git worktree remove .worktrees/backend-4 --force
git worktree prune

# 删除开发分支
git branch -d dev/frontend-1 dev/frontend-2 dev/backend-1 dev/backend-2 dev/backend-3 dev/backend-4
```

#### 5.5 最终验证

运行完整的构建和测试：
```bash
npm run build 2>/dev/null || echo "无构建脚本"
npm test 2>/dev/null || echo "无测试脚本"
```

---

### 阶段 6：完成报告

输出团队执行摘要：

```markdown
## 🏁 AI Teams 执行报告

### 团队成员
| 角色 | 状态 | 编译 | 提交数 | 核心文件 |
|------|------|------|--------|---------|
| 产品经理 | ✅ | - | - | docs/prd.md |
| 项目经理 | ✅ | ✅ | N | 基础设施 |
| FE-1 | ✅/❌ | ✅/❌ | N | file1, file2 |
| FE-2 | ✅/❌ | ✅/❌ | N | file1, file2 |
| BE-1 | ✅/❌ | ✅/❌ | N | file1, file2 |
| BE-2 | ✅/❌ | ✅/❌ | N | file1, file2 |
| BE-3 | ✅/❌ | ✅/❌ | N | file1, file2 |
| BE-4 | ✅/❌ | ✅/❌ | N | file1, file2 |

### 合并结果
- 合并冲突：X 个
- 集成编译：✅/❌（修复次数）
- 最终构建：✅/❌
- 测试状态：✅/❌/未配置

### 项目统计
- 总文件数：X
- 总代码行数：X
- 总提交数：X

### 后续建议
1. ...
2. ...
3. ...
```

---

## 错误处理

### Agent 执行失败
- 如果某个开发者 Agent 失败，报告给用户并询问是否重试
- 不要自动重试，让用户决定

### 合并冲突无法自动解决
- 暂停并向用户展示冲突详情
- 等待用户指示如何处理

### 基础设施搭建失败
- 回到阶段 2 重新检查任务分配
- 不要跳过基础设施直接开发

### 编译失败处理
- 基础设施阶段编译失败：必须修复后才能进入开发阶段
- 开发者编译失败：标记 `[BUILD FAILED]` 继续合并，在集成阶段统一修复
- 集成编译失败：启动修复 Agent 自动修复，修复失败则暂停告知用户

## 注意事项

- 全程使用中文交流
- 每个暂停点必须等待用户明确确认
- 不要跳过任何阶段
- 不要在用户未确认的情况下继续下一阶段
- Agent 的 prompt 中必须包含完整的上下文路径
- worktree 路径使用相对路径 `.worktrees/xxx`
- 三道编译防线必须严格执行：基础设施编译 → 开发者编译 → 集成编译
