# CobbleCreator

作者：江下犹泷（JX-YL）｜基于 Vue3 + Element Plus

## 简介
CobbleCreator 是一个用于快速生成 Cobblemon 数据包与资源包最小结构的原型工具，支持在浏览器中填写表单并直接导出到本地文件夹。

## 当前版本
- v0.1.0：初始原型，支持基础字段与最小导出
- v0.1.1：修复导出子文件夹、语言四项配置、新增版本与 BUG 记录（待标签发布）

## 功能
- 表单字段：命名空间、物种ID、包描述、包名称、属性与数值、生理参数、成长与亲密、蛋组
- 语言配置：中文名称、中文描述、英文名称、英文描述，同时生成 `zh_cn.json` 与 `en_us.json`
- 导出结构：在选定目录下创建一个子文件夹写出完整内容

## 运行要求
- 浏览器需支持 File System Access API（推荐 Edge/Chrome 最新版）
- Windows 环境（已在 Windows 测试）

## 快速开始
- 打开预览：`http://localhost:5500/`
- 填写表单或点击“填充示例”/“导入参考Species模板”
- 点击“导出数据包”，选择一个空文件夹；工具会在其下创建子文件夹（来自“包名称”）并写入以下结构：

```
<子文件夹>/
├── pack.mcmeta
├── assets/
│   └── cobblemon/
│       └── lang/
│           ├── zh_cn.json   # 若填写中文
│           └── en_us.json   # 若填写英文
└── data/
    └── cobblemon/
        ├── species/
        │   └── custom/<speciesId>.json
        └── spawn_pool_world/<speciesId>.json
```

## 游戏内验证
- 将 `assets` 复制到资源包、`data` 与 `pack.mcmeta` 放入数据包根目录
- `/reload` 后使用 `/pokespawn` 或 `/spawnpokemon <speciesId>` 验证
- 注意根据目标 Minecraft 版本调整 `pack_format`（代码默认 `48`）

## 目录说明
- `enter/`：输入/参考文件目录（不纳入版本控制）
- `putout/`：测试导出产物目录（不纳入版本控制）

## 许可
此原型仅用于学习与演示，正式许可与发布以仓库公告为准。