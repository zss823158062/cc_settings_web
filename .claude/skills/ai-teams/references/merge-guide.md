# 合并指导

## 合并顺序策略

### 推荐顺序：后端优先

1. **第一轮：后端分支**（按编号顺序）
   - BE-1 → main
   - BE-2 → main
   - BE-3 → main
   - BE-4 → main

2. **第二轮：前端分支**（按编号顺序）
   - FE-1 → main
   - FE-2 → main

### 理由
- 后端代码通常是前端的依赖
- 后端分支间文件重叠概率更低（已通过任务分配保证）
- 前端分支最后合并，便于发现接口对接问题

## 合并命令模板

```bash
# 1. 确保在 main 分支
git checkout main

# 2. 合并后端分支（逐个）
git merge worktrees/backend-1 --no-ff -m "merge(BE-1): 任务描述"
git merge worktrees/backend-2 --no-ff -m "merge(BE-2): 任务描述"
git merge worktrees/backend-3 --no-ff -m "merge(BE-3): 任务描述"
git merge worktrees/backend-4 --no-ff -m "merge(BE-4): 任务描述"

# 3. 合并前端分支（逐个）
git merge worktrees/frontend-1 --no-ff -m "merge(FE-1): 任务描述"
git merge worktrees/frontend-2 --no-ff -m "merge(FE-2): 任务描述"

# 4. 清理 worktree
git worktree remove .worktrees/backend-1
# ... 对每个 worktree 重复
```

## 冲突解决原则

### 不应出现的冲突
如果任务拆解正确（文件范围不重叠），理论上不会有合并冲突。
如果出现冲突，说明任务分配有问题，需要人工审查。

### 可能的冲突场景及处理

1. **共享配置文件冲突**（如 `package.json` 的 dependencies）
   - 策略：合并所有 dependencies，取较新版本
   - 命令：手动合并后 `git add` + `git commit`

2. **共享类型文件冲突**（如 `shared/types.ts`）
   - 策略：这类文件应在基础设施阶段定义好，开发者不应修改
   - 如果开发者添加了新类型：合并保留所有新增类型

3. **路由注册冲突**（如 `backend/src/routes/index.ts`）
   - 策略：合并所有路由注册
   - 确保没有路径冲突

4. **前端路由冲突**（如 `frontend/src/router.tsx`）
   - 策略：合并所有页面路由
   - 确保没有路径冲突

## 合并后验证（必须通过）

合并完成后，**必须**执行以下验证，全部通过后才能进入清理阶段：

### 1. 编译检查（强制）

```bash
# TypeScript 项目
npx tsc --noEmit

# Rust/Tauri 项目
cargo check

# 通用构建
npm run build
```

**编译必须通过**。如果编译失败，执行修复流程（见下方）。

### 2. 跨模块数据流验证

检查以下集成点：
- 前端 API 调用函数的参数类型是否匹配后端接口定义
- 共享类型的导入路径是否正确
- 共享概念命名是否与 `docs/tasks.md` 中的命名规范表一致

### 3. Lint 检查
```bash
npm run lint 2>/dev/null || echo "无 lint 脚本"
```

### 4. 测试运行
```bash
npm test 2>/dev/null || echo "无测试脚本"
```

## 编译失败修复流程

如果合并后编译失败：

1. **收集错误信息**：保存完整的编译错误输出
2. **启动修复 Agent**（sonnet 模型）：
   - 以 API 契约文件为准，统一接口调用方式
   - 修复导入路径、类型不匹配、缺失字段等问题
   - 不改变业务逻辑，只修复编译错误
3. **重新编译验证**：修复后必须重新运行编译检查
4. **提交修复**：`git commit -m "fix(integration): 修复集成编译错误"`
5. **如果修复失败**：暂停并告知用户，提供错误详情供人工介入

> ⚠️ **编译通过是合并完成的前提条件**，未通过编译不能进入清理阶段。

## Worktree 清理

合并完成且编译通过后，清理所有 worktree：

```bash
# 列出所有 worktree
git worktree list

# 移除每个 worktree
git worktree remove .worktrees/frontend-1 --force
git worktree remove .worktrees/frontend-2 --force
git worktree remove .worktrees/backend-1 --force
git worktree remove .worktrees/backend-2 --force
git worktree remove .worktrees/backend-3 --force
git worktree remove .worktrees/backend-4 --force

# 清理残留引用
git worktree prune
```
