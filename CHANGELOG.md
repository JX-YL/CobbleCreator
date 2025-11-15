# CobbleCreator 版本说明

## v0.1.0 (初始原型)
- Vue3 + Element Plus 原型表单
- 完整导出：`pack.mcmeta`、语言文件、`species` 基础配置、`spawn_pool_world` 最小示例
- 支持示例填充与参考 `species` JSON 模板导入
- 核心函数：`useExample`、`buildPackMcmeta`、`buildSpeciesJson`、`buildSpawnJson`、`getDir`、`writeTextFile`、`writeJsonFile`、`exportPack`、`importTemplateFromFile`

## v0.1.1 (修复与体验改进)
- 修复：导出现在会在所选目录下创建一个子文件夹（`packName`），所有内容写入该文件夹
- 改造语言配置为四项：中文名称、中文描述、英文名称、英文描述，同时生成 `zh_cn.json` 与 `en_us.json`
- 新增版本说明与 BUG 记录文件
- 其他：示例数据同步为新语言字段，`species.name` 优先使用英文名、其次中文名、再次回退 `speciesId`

## v0.2.0 (项目文件与迁移)
- 新增：项目保存/加载（`*.ccproj`），用于二次编辑与分享
- 新增：基础校验与迁移逻辑，兼容旧字段并自动填充缺省值
- 优化：UI 控件与表单结构，导出时写入 `pack.mcmeta`
- 语言：规范语言结构，生成 `zh_cn.json` 与 `en_us.json`

## v0.3.0 (行为扩展与测试项目)
- 行为：扩展 `behaviour.moving`，新增 `swim`/`fly` 能力与速度字段；构建与模板导入全面支持
- UI：在“行为与掉落”区域新增“可游泳/游泳速度”“可飞行/飞行速度”控件
- 示例：`useExample` 预设加入 `canSwim = true / swimSpeed = 0.35`、`canFly = true / flySpeed = 0.6`
- 项目：新增测试项目 <mcfile name="mistlynx.ccproj" path="e:\AI Super Personal Studio\Workspace\Cobblemon\CobbleCreator\enter\mistlynx.ccproj"></mcfile>（不随版本发布打包，作为本地示例）
- 维护：更新 `.gitignore`（保持 `enter/` 与 `putout/` 忽略策略）；补充函数级注释以便后续维护
- 作者：江下犹泷（JX-YL）

## v0.3.1 (召唤修复与语言/掉落增强)
- 修复：导出的物种 JSON 现包含必需的 `id` 字段；导出路径从 `data/cobblemon/species/custom/` 调整为 `data/cobblemon/species/<id>.json`，确保物种可被注册与召唤。
- 语言：描述支持按换行拆分为 `desc1`/`desc2`，并在 `species.pokedex` 生成时同步引用键。
- 掉落：解析文本新增可选数量范围语法（`item:percent@数量范围`），导出与项目回填保持一致。
- 包格式：保留 `pack_format` 自定义字段并在导出时写入。
- 测试：使用本地测试项目 `stormshade.ccproj` 验证召唤与导出结构（不随版本发布打包）。

## v0.4.0 (技能配置与示例项目)
- 新增：技能配置（升级/蛋/招式机/导师）UI 与状态管理；支持在表单中动态添加/删除技能条目。
- 新增：`species.moves` 字段序列化与解析；项目保存/加载（`*.ccproj`）与模板导入全面支持该字段。
- 新增：示例项目 <mcfile name="aurorafang.ccproj" path="e:\AI Super Personal Studio\Workspace\Cobblemon\CobbleCreator\enter\aurorafang.ccproj"></mcfile> 用于验证 `moves` 功能，不使用原版物种。
- 预览：`previewSpeciesJson` 现包含 `moves` 字段，便于快速检查输出格式（如 `20:crushclaw`、`egg:aquajet`、`tm:protect`、`tutor:superpower`）。
- 兼容：保持 File System Access API 与回退下载/选择的导出与加载流程一致。
- 标签：发布 `v0.4.0-alpha` 作为预发布验证版本。