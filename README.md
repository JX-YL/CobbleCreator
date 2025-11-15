# CobbleCreator

作者：江下犹泷（JX-YL）｜基于 Vue3 + Element Plus

## 简介
CobbleCreator 是一个用于快速生成 Cobblemon 数据包与资源包最小结构的原型工具，支持在浏览器中填写表单并直接导出到本地文件夹。

## 当前版本
- v0.4.0：技能配置（升级/蛋/TM/导师）与 `species.moves` 序列化/解析；项目保存/加载与模板导入支持 `moves`；新增示例 `enter/aurorafang.ccproj`（已发布标签）
- v0.3.1：修复召唤（`id` 字段与导出路径到 `species/` 根）、语言描述按换行拆分为 `desc1/desc2`、掉落支持数量范围语法、保留 `pack_format` 自定义
- v0.3.0：行为扩展（新增 swim/fly 能力与速度）、UI 控件完善、测试项目 `mistlynx.ccproj`、`.gitignore` 维护（已发布标签）
- v0.2.0：项目文件保存/加载（`*.ccproj`）、基础校验与迁移、导出写入 `pack.mcmeta`
- v0.1.1：修复导出子文件夹、语言四项配置、新增版本与 BUG 记录
- v0.1.0：初始原型，支持基础字段与最小导出

## 功能
- 表单字段：命名空间、物种ID、包描述、包名称、属性与数值、生理参数、成长与亲密、蛋组
- 语言配置：中文名称、中文描述、英文名称、英文描述，同时生成 `zh_cn.json` 与 `en_us.json`（描述支持按换行拆分为 `desc1`/`desc2`）
- 导出结构：在选定目录下创建一个子文件夹写出完整内容

## 技能配置（v0.4.0）
- 新增入口：在“行为与掉落”之前的“技能配置（v0.4.0）”区域，点击“新增技能”添加条目。
- 学习方式：支持 `升级`、`蛋招 (egg)`、`招式机 (tm)`、`导师 (tutor)`；当选择“升级”时需填写等级。
- 格式规则：
  - 升级：`<等级>:<技能ID>` 例如 `20:crushclaw`
  - 蛋招：`egg:<技能ID>` 例如 `egg:aquajet`
  - 招式机：`tm:<技能ID>` 例如 `tm:protect`
  - 导师：`tutor:<技能ID>` 例如 `tutor:superpower`
- JSON 预览：`previewSpeciesJson` 的 `moves` 字段会实时反映上述列表。
- 示例项目：<mcfile name="aurorafang.ccproj" path="e:\AI Super Personal Studio\Workspace\Cobblemon\CobbleCreator\enter\aurorafang.ccproj"></mcfile>（不使用原版宝可梦），用于快速验证该功能。
- 注意：当前未对重复技能进行去重；“升级”条目未填等级将被忽略（后续版本将增加校验与高亮）。

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
        │   └── <speciesId>.json
        └── spawn_pool_world/<speciesId>.json
```

## 游戏内验证
- 将 `assets` 复制到资源包、`data` 与 `pack.mcmeta` 放入数据包根目录
- `/reload` 后使用 `/pokespawn` 或 `/spawnpokemon <speciesId>` 验证
- 注意根据目标 Minecraft 版本调整 `pack_format`（代码默认 `48`）
 - 掉落语法：`item:percent@数量范围`（数量范围可选，示例：`minecraft:feather:20@1-3; minecraft:phantom_membrane:10@1-2`）

## 目录说明
- `enter/`：输入/参考文件目录（不纳入版本控制）
- `putout/`：测试导出产物目录（不纳入版本控制）
- `CHANGELOG.md`：版本更新记录（详细变更请查阅）

## 许可
此原型仅用于学习与演示，正式许可与发布以仓库公告为准。