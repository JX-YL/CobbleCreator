// CobbleCreator v0.1.0 前端原型
// 作者：江下犹泷（JX-YL）

const { createApp, ref, reactive } = Vue;

// 创建并配置应用：注册 Element Plus，确保组件正常渲染
const app = createApp({
  setup() {
    const typeOptions = [
      'normal','fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'
    ];

    // 表单数据模型
    const form = reactive({
      namespace: 'cobblemon',
      packName: 'cobble-pack',
      speciesId: '',
      packDescription: 'CobbleCreator datapack by JX-YL',
      // 项目版本（v0.2.0 项目文件用）
      projectVersion: '0.2.0',
      // 语言配置（四项）：中文/英文 名称与描述
      zhName: '',
      zhDesc: '',
      enName: '',
      enDesc: '',
      // 以下旧字段保留兼容（不再用于导出）
      locale: 'zh_cn',
      displayName: '',
      dex1: '',
      dex2: '',
      primaryType: 'poison',
      secondaryType: 'water',
      baseStats: {
        hp: 60, attack: 60, defence: 60, special_attack: 60, special_defence: 60, speed: 60
      },
      height: 10,
      weight: 100,
      catchRate: 45,
      maleRatio: 0.5,
      experienceGroup: 'medium_fast',
      baseFriendship: 50,
      eggGroups: [],
    });

    /**
     * 使用示例数据填充表单
     * @function useExample
     * @description 用官方示例 Tentaquil 的合理近似填充，便于快速导出验证。
     */
    function useExample() {
      form.namespace = 'cobblemon';
      form.packName = 'tentaquil-pack';
      form.speciesId = 'tentaquil';
      form.packDescription = 'CobbleCreator datapack demo - Tentaquil';
      form.locale = 'en_us';
      // 新语言字段
      form.enName = 'Tentaquil';
      form.enDesc = 'If its bold colors do not sufficiently ward off predators, it secretes toxins that smell strongly of copper.\nThere has only been one recorded sighting of this pokémon. Until recently, this was considered to be a joke.';
      form.zhName = '';
      form.zhDesc = '';
      // 旧字段（兼容无需再手填）
      form.displayName = 'Tentaquil';
      form.dex1 = 'If its bold colors do not sufficiently ward off predators, it secretes toxins that smell strongly of copper.';
      form.dex2 = 'There has only been one recorded sighting of this pokémon. Until recently, this was considered to be a joke.';
      form.primaryType = 'poison';
      form.secondaryType = 'water';
      form.baseStats = { hp:125, attack:105, defence:95, special_attack:120, special_defence:85, speed:70 };
      form.height = 11;
      form.weight = 300;
      form.catchRate = 30;
      form.maleRatio = 0.5;
      form.experienceGroup = 'medium_slow';
      form.baseFriendship = 50;
      form.eggGroups = ['field','fairy'];
    }

    /**
     * 生成 pack.mcmeta 的 JSON 内容
     * @function buildPackMcmeta
     * @param {string} description - 包描述
     * @returns {object} pack.mcmeta 对应的对象
     */
    function buildPackMcmeta(description) {
      return {
        pack: {
          pack_format: 48,
          description,
        },
      };
    }

    /**
     * 根据传入的本地化内容生成语言 JSON
     * @function buildLangJsonForLocale
     * @param {string} locale - 语言代码，如 zh_cn 或 en_us
     * @param {string} speciesId - 物种ID
     * @param {string} name - 名称（对应 .name）
     * @param {string} desc - 描述（对应 .desc）
     * @returns {object} 语言键值对象
     */
    function buildLangJsonForLocale(locale, speciesId, name, desc) {
      const keyBase = `cobblemon.species.${speciesId}`;
      return {
        [`${keyBase}.name`]: name || speciesId,
        [`${keyBase}.desc`]: desc || '',
      };
    }

    /**
     * 生成物种基础 JSON
     * @function buildSpeciesJson
     * @param {object} form - 表单数据
     * @returns {object} species 基础配置 JSON
     */
    function buildSpeciesJson(form) {
      const json = {
        implemented: true,
        // 物种显示名优先使用英文名，其次中文名，再次回退 speciesId
        name: form.enName || form.zhName || form.displayName || form.speciesId,
        labels: [ 'custom' ],
        pokedex: [ `cobblemon.species.${form.speciesId}.desc` ],
        height: form.height,
        weight: form.weight,
        features: [],
        aspects: [],
        forms: [ { name: 'normal' } ],
        primaryType: form.primaryType,
        baseStats: { ...form.baseStats },
        catchRate: form.catchRate,
        maleRatio: form.maleRatio,
        experienceGroup: form.experienceGroup,
        baseFriendship: form.baseFriendship,
      };
      if (form.secondaryType) json.secondaryType = form.secondaryType;
      if (form.eggGroups && form.eggGroups.length) json.eggGroups = [...form.eggGroups];
      return json;
    }

    /**
     * 生成最小生成配置 JSON（可选）
     * @function buildSpawnJson
     * @param {string} speciesId - 物种ID
     * @returns {object} spawn_pool_world 条目
     */
    function buildSpawnJson(speciesId) {
      return {
        enabled: true,
        neededInstalledMods: [],
        neededUninstalledMods: [],
        spawns: [
          {
            id: `${speciesId}-example`,
            pokemon: speciesId,
            presets: [ 'underground' ],
            type: 'pokemon',
            context: 'grounded',
            bucket: 'rare',
            level: '10-30',
            weight: 1.0,
            condition: { canSeeSky: false, biomes: [ '#minecraft:is_overworld' ] },
          },
        ],
      };
    }

    /**
     * 在目标目录递归创建子目录并返回其句柄
     * @function getDir
     * @param {FileSystemDirectoryHandle} root - 根目录句柄
     * @param {string[]} parts - 子目录路径片段数组
     * @returns {Promise<FileSystemDirectoryHandle>} 最终子目录句柄
     */
    async function getDir(root, parts) {
      let dir = root;
      for (const p of parts) {
        dir = await dir.getDirectoryHandle(p, { create: true });
      }
      return dir;
    }

    /**
     * 在指定目录写入文本文件
     * @function writeTextFile
     * @param {FileSystemDirectoryHandle} dir - 目录句柄
     * @param {string} filename - 文件名
     * @param {string} content - 文本内容
     * @returns {Promise<void>}
     */
    async function writeTextFile(dir, filename, content) {
      const handle = await dir.getFileHandle(filename, { create: true });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    }

    /**
     * 写入 JSON 文件（带缩进）
     * @function writeJsonFile
     * @param {FileSystemDirectoryHandle} dir - 目录句柄
     * @param {string} filename - 文件名
     * @param {object} data - JSON 对象
     * @returns {Promise<void>}
     */
    async function writeJsonFile(dir, filename, data) {
      await writeTextFile(dir, filename, JSON.stringify(data, null, 2));
    }

    /**
     * 从参考 species JSON 导入为表单模板
     * @function importTemplateFromFile
     * @param {File} file - 选择的 JSON 文件对象
     * @returns {Promise<void>}
     */
    async function importTemplateFromFile(file) {
      const text = await file.text();
      /** @type {any} */
      const data = JSON.parse(text);
      const basename = file.name.replace(/\.json$/i, '');
      form.speciesId = basename.toLowerCase();
      form.enName = data.name || basename;
      form.zhName = '';
      form.primaryType = data.primaryType || form.primaryType;
      form.secondaryType = data.secondaryType || '';
      form.baseStats = data.baseStats ? { ...data.baseStats } : form.baseStats;
      form.height = typeof data.height === 'number' ? data.height : form.height;
      form.weight = typeof data.weight === 'number' ? data.weight : form.weight;
      form.catchRate = typeof data.catchRate === 'number' ? data.catchRate : form.catchRate;
      form.maleRatio = typeof data.maleRatio === 'number' ? data.maleRatio : form.maleRatio;
      form.experienceGroup = data.experienceGroup || form.experienceGroup;
      form.baseFriendship = typeof data.baseFriendship === 'number' ? data.baseFriendship : form.baseFriendship;
      form.eggGroups = Array.isArray(data.eggGroups) ? data.eggGroups : [];
      ElementPlus.ElMessage.success('模板导入成功，已填充表单');
    }

    /**
     * 构建项目文件（*.ccproj）的 JSON 对象
     * @function buildProjectJson
     * @param {object} form - 当前表单数据
     * @returns {object} 项目文件对象（不用于直接导入游戏）
     */
    function buildProjectJson(form) {
      return {
        version: form.projectVersion || '0.2.0',
        namespace: form.namespace || 'cobblemon',
        meta: {
          packName: form.packName || (form.speciesId ? `${form.speciesId}-pack` : 'cobble-pack'),
          description: form.packDescription || 'CobbleCreator datapack by JX-YL',
        },
        language: {
          zh_cn: { name: form.zhName || '', desc: form.zhDesc || '' },
          en_us: { name: form.enName || '', desc: form.enDesc || '' },
        },
        species: [
          {
            id: form.speciesId || '',
            name: form.enName || form.zhName || form.speciesId || '',
            primaryType: form.primaryType,
            secondaryType: form.secondaryType || undefined,
            baseStats: { ...form.baseStats },
            height: form.height,
            weight: form.weight,
            catchRate: form.catchRate,
            maleRatio: form.maleRatio,
            experienceGroup: form.experienceGroup,
            baseFriendship: form.baseFriendship,
            eggGroups: Array.isArray(form.eggGroups) ? [...form.eggGroups] : [],
          }
        ],
        spawns: [
          { speciesId: form.speciesId || '', data: buildSpawnJson(form.speciesId || '') }
        ],
        extensions: { moves: [], abilities: [], types: [], statuses: [], items: [] },
      };
    }

    /**
     * 对项目文件进行基础校验
     * @function validateProject
     * @param {object} project - 项目文件对象
     * @returns {{valid:boolean, errors:string[], warnings:string[]}} 校验结果
     */
    function validateProject(project) {
      const errors = [];
      const warnings = [];

      if (!project || typeof project !== 'object') {
        errors.push('项目文件必须是对象');
        return { valid: false, errors, warnings };
      }

      if (!project.version) warnings.push('缺少版本字段，已假定为 0.2.0');
      if (!project.namespace) warnings.push('缺少命名空间，已默认 cobblemon');

      if (!Array.isArray(project.species) || project.species.length === 0) {
        errors.push('species 列表为空或缺失（至少需 1 项）');
      } else {
        const s = project.species[0];
        if (!s.id) errors.push('species[0].id 为空');
        if (!s.primaryType) errors.push('species[0].primaryType 为空');
        const bs = s.baseStats || {};
        const needed = ['hp','attack','defence','special_attack','special_defence','speed'];
        for (const k of needed) {
          if (typeof bs[k] !== 'number') warnings.push(`baseStats.${k} 缺失或非数字，已回退默认`);
        }
        if (typeof s.maleRatio !== 'number' || s.maleRatio < 0 || s.maleRatio > 1) warnings.push('maleRatio 建议为 0~1 的数字');
        if (typeof s.catchRate !== 'number') warnings.push('catchRate 建议为数字');
        if (typeof s.baseFriendship !== 'number') warnings.push('baseFriendship 建议为数字');
      }

      // 语言项建议但非强制
      if (!project.language || (!project.language.zh_cn && !project.language.en_us)) {
        warnings.push('未提供语言项，将在导出时使用 speciesId 作为显示名');
      }

      return { valid: errors.length === 0, errors, warnings };
    }

    /**
     * 迁移旧版本项目文件到 v0.2.0 结构（容错）
     * @function migrateProject
     * @param {object} project - 原始项目文件对象
     * @returns {object} 迁移后的项目对象
     */
    function migrateProject(project) {
      if (!project || typeof project !== 'object') return project;

      const migrated = { ...project };
      // 版本字段标准化
      if (!migrated.version) migrated.version = '0.2.0';

      // 语言从旧字段回填（兼容 v0.1.x 的临时字段）
      migrated.language = migrated.language || {};
      const zh = migrated.language.zh_cn || {};
      const en = migrated.language.en_us || {};

      if (!en.name && migrated.enName) en.name = migrated.enName;
      if (!en.desc && migrated.enDesc) en.desc = migrated.enDesc;
      if (!zh.name && migrated.zhName) zh.name = migrated.zhName;
      if (!zh.desc && migrated.zhDesc) zh.desc = migrated.zhDesc;
      migrated.language.zh_cn = zh;
      migrated.language.en_us = en;

      // species 数组规范化
      if (!Array.isArray(migrated.species) || migrated.species.length === 0) {
        migrated.species = [];
        const s = {
          id: migrated.speciesId || '',
          name: migrated.enName || migrated.zhName || migrated.speciesId || '',
          primaryType: migrated.primaryType,
          secondaryType: migrated.secondaryType,
          baseStats: migrated.baseStats || undefined,
          height: migrated.height,
          weight: migrated.weight,
          catchRate: migrated.catchRate,
          maleRatio: migrated.maleRatio,
          experienceGroup: migrated.experienceGroup,
          baseFriendship: migrated.baseFriendship,
          eggGroups: migrated.eggGroups || [],
        };
        migrated.species.push(s);
      }

      // meta 规范化
      migrated.meta = migrated.meta || { packName: migrated.packName, description: migrated.packDescription };

      return migrated;
    }

    /**
     * 将项目文件应用到表单
     * @function applyProjectToForm
     * @param {object} project - 项目文件对象（已迁移）
     * @returns {void}
     */
    function applyProjectToForm(project) {
      try {
        form.projectVersion = project.version || '0.2.0';
        form.namespace = project.namespace || form.namespace;
        form.packName = (project.meta && project.meta.packName) || form.packName;
        form.packDescription = (project.meta && project.meta.description) || form.packDescription;

        const lang = project.language || {};
        const zh = lang.zh_cn || {};
        const en = lang.en_us || {};
        form.zhName = zh.name || '';
        form.zhDesc = zh.desc || '';
        form.enName = en.name || '';
        form.enDesc = en.desc || '';

        if (Array.isArray(project.species) && project.species.length) {
          const s = project.species[0];
          form.speciesId = s.id || form.speciesId;
          form.primaryType = s.primaryType || form.primaryType;
          form.secondaryType = s.secondaryType || '';
          form.baseStats = s.baseStats ? { ...form.baseStats, ...s.baseStats } : form.baseStats;
          form.height = typeof s.height === 'number' ? s.height : form.height;
          form.weight = typeof s.weight === 'number' ? s.weight : form.weight;
          form.catchRate = typeof s.catchRate === 'number' ? s.catchRate : form.catchRate;
          form.maleRatio = typeof s.maleRatio === 'number' ? s.maleRatio : form.maleRatio;
          form.experienceGroup = s.experienceGroup || form.experienceGroup;
          form.baseFriendship = typeof s.baseFriendship === 'number' ? s.baseFriendship : form.baseFriendship;
          form.eggGroups = Array.isArray(s.eggGroups) ? s.eggGroups : [];
        }
      } catch (e) {
        console.error(e);
        ElementPlus.ElMessage.error('应用项目到表单时发生错误');
      }
    }

    /**
     * 保存当前项目为 .ccproj 文件
     * @function saveProject
     * @returns {Promise<void>}
     */
    async function saveProject() {
      const project = buildProjectJson(form);
      const result = validateProject(project);
      if (!result.valid) {
        ElementPlus.ElMessage.error(`项目校验失败：\n${result.errors.join('\n')}`);
        return;
      }
      if (result.warnings.length) {
        ElementPlus.ElMessage.warning(result.warnings.join('\n'));
      }

      try {
        if ('showSaveFilePicker' in window) {
          const suggestedName = `${project.meta.packName || 'cobble-pack'}.ccproj`;
          const handle = await window.showSaveFilePicker({
            suggestedName,
            types: [{ description: 'CobbleCreator Project', accept: { 'application/json': ['.ccproj', '.json'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(JSON.stringify(project, null, 2));
          await writable.close();
          ElementPlus.ElMessage.success('项目已保存为 .ccproj');
        } else {
          // 回退：下载文件
          const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project.meta.packName || 'cobble-pack'}.ccproj`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          ElementPlus.ElMessage.success('项目已下载为 .ccproj');
        }
      } catch (e) {
        console.error(e);
        ElementPlus.ElMessage.error('保存项目失败');
      }
    }

    /**
     * 从 .ccproj 文件加载项目并应用到表单
     * @function loadProject
     * @returns {Promise<void>}
     */
    async function loadProject() {
      try {
        let file;
        if ('showOpenFilePicker' in window) {
          const [handle] = await window.showOpenFilePicker({
            types: [{ description: 'CobbleCreator Project', accept: { 'application/json': ['.ccproj', '.json'] } }],
            multiple: false,
          });
          file = await handle.getFile();
        } else {
          // 回退：input 选择
          await new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.ccproj,.json,application/json';
            input.onchange = () => resolve(input.files && input.files[0]);
            input.click();
          }).then(f => { file = f; });
          if (!file) return;
        }

        const text = await file.text();
        /** @type {any} */
        const raw = JSON.parse(text);
        const migrated = migrateProject(raw);
        const result = validateProject(migrated);
        if (!result.valid) {
          ElementPlus.ElMessage.error(`加载的项目校验失败：\n${result.errors.join('\n')}`);
          return;
        }
        if (result.warnings.length) {
          ElementPlus.ElMessage.warning(result.warnings.join('\n'));
        }
        applyProjectToForm(migrated);
        ElementPlus.ElMessage.success('项目已加载并应用到表单');
      } catch (e) {
        console.error(e);
        ElementPlus.ElMessage.error('加载项目失败');
      }
    }

    /**
     * 导出数据包主流程
     * @function exportPack
     * @description 通过 File System Access API 生成完整目录与文件：pack.mcmeta、语言、species、spawn。
     * @returns {Promise<void>}
     */
    async function exportPack() {
      if (!('showDirectoryPicker' in window)) {
        ElementPlus.ElMessage.error('当前浏览器不支持目录导出，请使用 Edge/Chrome 最新版');
        return;
      }

      if (!form.speciesId) {
        ElementPlus.ElMessage.error('请填写物种ID');
        return;
      }

      const root = await window.showDirectoryPicker({ mode: 'readwrite' });

      // 在选定目录下创建一个子文件夹作为导出根
      const packFolderName = (form.packName || form.speciesId || 'cobble-pack').trim();
      const packRoot = await getDir(root, [packFolderName]);

      // 写入 pack.mcmeta
      await writeJsonFile(packRoot, 'pack.mcmeta', buildPackMcmeta(form.packDescription));

      // assets/cobblemon/lang：根据中英四项分别生成文件
      const langDir = await getDir(packRoot, ['assets','cobblemon','lang']);
      if (form.zhName || form.zhDesc) {
        await writeJsonFile(langDir, 'zh_cn.json', buildLangJsonForLocale('zh_cn', form.speciesId, form.zhName, form.zhDesc));
      }
      if (form.enName || form.enDesc) {
        await writeJsonFile(langDir, 'en_us.json', buildLangJsonForLocale('en_us', form.speciesId, form.enName, form.enDesc));
      }

      // data/cobblemon/species/custom
      const speciesDir = await getDir(packRoot, ['data','cobblemon','species','custom']);
      await writeJsonFile(speciesDir, `${form.speciesId}.json`, buildSpeciesJson(form));

      // data/cobblemon/spawn_pool_world（可选，帮助快速生成出现）
      const spawnDir = await getDir(packRoot, ['data','cobblemon','spawn_pool_world']);
      await writeJsonFile(spawnDir, `${form.speciesId}.json`, buildSpawnJson(form.speciesId));

      ElementPlus.ElMessage.success(`导出成功！已生成子文件夹 "${packFolderName}"，请按说明放入 resourcepacks 与 datapacks 测试`);
    }

    return { form, typeOptions, useExample, exportPack, importTemplateFromFile, saveProject, loadProject };
  }
});

// 注册 Element Plus 插件以启用 el-* 组件渲染
/**
 * 注册 Element Plus 插件
 * @function useElementPlus
 * @description 让所有 el-* 组件在页面中正常工作。
 */
app.use(ElementPlus);

// 挂载到页面
app.mount('#app');