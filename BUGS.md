# CobbleCreator BUG 记录

## 已知问题（v0.1.0）
- 语言选择仅显示 `English (en_us)`，难以直接填写中文内容
- 导出结果直接在选定目录写入 `assets/`、`data/`、`pack.mcmeta`，未生成包子文件夹

## 修复（v0.1.1）
- 语言配置改为四项：中文名称、中文描述、英文名称、英文描述；导出自动生成 `zh_cn.json` 与 `en_us.json`
- 在选定目录下创建子文件夹（由 `packName` 或 `speciesId` 决定），所有导出内容均写入此文件夹

## 待观察
- `pack_format` 需根据目标 Minecraft 版本调整（当前默认 48）
- 更完整的 `species` 字段对齐与校验将在后续版本逐步完善