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