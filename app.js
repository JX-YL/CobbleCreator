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

    return { form, typeOptions, useExample, exportPack, importTemplateFromFile };
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