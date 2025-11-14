// CobbleCreator v0.3.0 前端原型
// 作者：江下犹泷（JX-YL）

const { createApp, ref, reactive } = Vue;

// 创建并配置应用：注册 Element Plus，确保组件正常渲染
const app = createApp({
  setup() {
    // 类型、蛋组、成长速率选项（统一英文[中文]标签）
    const typeOptions = [
      { value:'normal', label:'normal[一般]' },
      { value:'fire', label:'fire[火]' },
      { value:'water', label:'water[水]' },
      { value:'grass', label:'grass[草]' },
      { value:'electric', label:'electric[电]' },
      { value:'ice', label:'ice[冰]' },
      { value:'fighting', label:'fighting[格斗]' },
      { value:'poison', label:'poison[毒]' },
      { value:'ground', label:'ground[地面]' },
      { value:'flying', label:'flying[飞行]' },
      { value:'psychic', label:'psychic[超能力]' },
      { value:'bug', label:'bug[虫]' },
      { value:'rock', label:'rock[岩石]' },
      { value:'ghost', label:'ghost[幽灵]' },
      { value:'dragon', label:'dragon[龙]' },
      { value:'dark', label:'dark[恶]' },
      { value:'steel', label:'steel[钢]' },
      { value:'fairy', label:'fairy[妖精]' },
    ];

    const eggGroupOptions = [
      { value:'monster', label:'monster[怪兽]' },
      { value:'water1', label:'water1[水中1]' },
      { value:'water2', label:'water2[水中2]' },
      { value:'water3', label:'water3[水中3]' },
      { value:'bug', label:'bug[昆虫]' },
      { value:'flying', label:'flying[飞行]' },
      { value:'field', label:'field[陆地]' },
      { value:'fairy', label:'fairy[妖精]' },
      { value:'ditto', label:'ditto[百变怪]' },
      { value:'human-like', label:'human-like[人形]' },
      { value:'mineral', label:'mineral[矿物]' },
      { value:'amorphous', label:'amorphous[不定形]' },
      { value:'dragon', label:'dragon[龙]' },
      { value:'undiscovered', label:'undiscovered[未发现]' },
      { value:'plant', label:'plant[植物]' },
    ];

    const expGroupOptions = [
      { value:'slow', label:'slow[慢生长]' },
      { value:'medium_slow', label:'medium_slow[中慢]' },
      { value:'medium_fast', label:'medium_fast[中快]' },
      { value:'fast', label:'fast[快]' },
      { value:'fluctuating', label:'fluctuating[波动]' },
      { value:'erratic', label:'erratic[不稳定]' },
    ];

    // 说明中心选项键（用于统一点击查看）
    const helpKey = ref('speciesId');
    const helpKeyOptions = [
      { value:'speciesId', label:'speciesId[物种ID]' },
      { value:'primaryType', label:'primaryType[主属性]' },
      { value:'secondaryType', label:'secondaryType[副属性]' },
      { value:'baseStats.hp', label:'baseStats.hp[生命值]' },
      { value:'baseStats.attack', label:'baseStats.attack[攻击]' },
      { value:'baseStats.defence', label:'baseStats.defence[防御]' },
      { value:'baseStats.special_attack', label:'baseStats.special_attack[特攻]' },
      { value:'baseStats.special_defence', label:'baseStats.special_defence[特防]' },
      { value:'baseStats.speed', label:'baseStats.speed[速度]' },
      { value:'evYield', label:'evYield[努力值]' },
      { value:'experienceGroup', label:'experienceGroup[成长速率]' },
      { value:'baseFriendship', label:'baseFriendship[基础亲密度]' },
      { value:'baseExperienceYield', label:'baseExperienceYield[基础经验值]' },
      { value:'eggCycles', label:'eggCycles[蛋轮数]' },
      { value:'eggGroups', label:'eggGroups[蛋组]' },
      { value:'collisionBox', label:'collisionBox[碰撞箱]' },
      { value:'scale', label:'scale[缩放]' },
      { value:'behaviors', label:'behaviors[行为]' },
      { value:'drops', label:'drops[掉落]' },
      { value:'walkSpeed', label:'walkSpeed[行走速度]' },
      { value:'enableRiding', label:'enableRiding[启用骑乘]' },
      { value:'canSleep', label:'canSleep[可睡觉]' },
      { value:'sleepOnBed', label:'sleepOnBed[在床上睡]' },
      { value:'sleepLightLevel', label:'sleepLightLevel[睡眠光照]' },
      { value:'maxDrops', label:'maxDrops[掉落最大数量]' },
      { value:'dropsString', label:'dropsString[掉落 item:percent]'},
      { value:'formsBehaviour', label:'forms[].behaviour[形态能力配置]'},
    ];

    // 统一“英文[中文]”的行为/形态/特性/方面选项
    const behaviorOptions = [
      { value:'daytime_spawn', label:'daytime_spawn[白天出现]' },
      { value:'non_aggressive', label:'non_aggressive[不主动攻击]' },
      { value:'nocturnal', label:'nocturnal[夜行]' },
    ];

    const formOptions = [
      { value:'normal', label:'normal[默认]' },
      { value:'alolan', label:'alolan[阿罗拉]' },
      { value:'galarian', label:'galarian[伽勒尔]' },
      { value:'hisui', label:'hisui[洗翠]' },
      { value:'winter', label:'winter[冬季]' },
      { value:'summer', label:'summer[夏季]' },
    ];

    const featuresOptions = [
      { value:'torrential_fumes', label:'torrential_fumes[浓烈烟雾]' },
      { value:'heated_shell', label:'heated_shell[热壳]' },
      { value:'bioluminescent', label:'bioluminescent[生物发光]' },
    ];

    const aspectsOptions = [
      { value:'shiny', label:'shiny[闪光]' },
      { value:'female', label:'female[女性]' },
      { value:'male', label:'male[男性]' },
      { value:'sleeping', label:'sleeping[睡眠]' },
    ];

    // 形态折叠面板激活项
    const activeFormPanels = ref([]);
    // 能力复制工具栏状态
    const copySourceForm = ref(null);
    const copyTargetForms = ref([]);
    const copyMode = ref('overwrite');

    // 表单数据模型（v0.3.0 扩展）
    const form = reactive({
      namespace: 'cobblemon',
      packName: 'cobble-pack',
      speciesId: '',
      packDescription: 'CobbleCreator datapack by JX-YL',
      // 项目版本（v0.3.0 项目文件用）
      projectVersion: '0.3.0',
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
      // v0.3.0 新增字段
      evYield: { hp: 0, attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0 },
      baseExperienceYield: 100,
      eggCycles: 20,
      shoulderMountable: false,
      preEvolution: '',
      forms: [],
      features: [],
      aspects: [],
      // 碰撞箱与缩放、行为与掉落
      collisionBox: { width: 0.6, height: 1.8 },
      scale: 1.0,
      behaviors: [],
      dropsText: '',
      // 行为与掉落细化
      walkSpeed: 0.42,
      enableRiding: false,
      canSleep: null,
      sleepOnBed: null,
      sleepLightLevel: '0-4',
      dropsString: '',
      maxDrops: 3,
      // 每个形态的能力覆盖（按名称索引）
      formBehaviors: {},
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
      // v0.3.0 新字段示例
      form.evYield = { hp:2, attack:0, defence:0, special_attack:1, special_defence:0, speed:0 };
      form.baseExperienceYield = 270;
      form.eggCycles = 25;
      form.shoulderMountable = false;
      form.preEvolution = '';
      form.forms = ['normal'];
      // 为 normal 形态设置能力覆盖示例
      form.formBehaviors['normal'] = {
        moving: { walkSpeed: 0.42 },
        fly: { canFly: false },
        swim: { canSwimInWater: true, swimSpeed: 0.3, canBreatheUnderwater: true },
        sleep: { canSleep: null, sleepOnBed: null, lightLevel: '0-4' },
        enableRiding: false,
      };
      form.features = [];
      form.aspects = [];
      form.collisionBox = { width: 0.8, height: 2.0 };
      form.scale = 1.0;
      form.behaviors = ['daytime_spawn','non_aggressive'];
      form.dropsText = `[
  { "itemId": "cobblemon:poison_barb", "countMin": 1, "countMax": 1, "chance": 0.25 }
]`;
      // 行为与掉落细化示例
      form.walkSpeed = 0.42;
      form.enableRiding = false;
      form.canSleep = null; // 默认行为由服务端决定
      form.sleepOnBed = null;
      form.sleepLightLevel = '0-4';
      form.dropsString = 'cobblemon:poison_barb:25';
      form.maxDrops = 3;
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
    /**
     * 构建物种配置 JSON（包含 v0.3.0 扩展）
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
        // v0.3.0：新增或可编辑项
        features: Array.isArray(form.features) ? [...form.features] : [],
        aspects: Array.isArray(form.aspects) ? [...form.aspects] : [],
        forms: (() => {
          const names = Array.isArray(form.forms) && form.forms.length ? form.forms : ['normal'];
          return names.map(n => {
            const name = String(n).trim() || 'normal';
            const fb = form.formBehaviors && form.formBehaviors[name];
            const entry = { name };
            if (fb && typeof fb === 'object') {
              // 将形态能力覆盖写入 species JSON（如引擎不识别，可用于扩展）
              entry.behaviour = {
                moving: { walkSpeed: fb.moving?.walkSpeed },
                fly: { canFly: fb.fly?.canFly },
                swim: {
                  canSwimInWater: fb.swim?.canSwimInWater,
                  swimSpeed: fb.swim?.swimSpeed,
                  canBreatheUnderwater: fb.swim?.canBreatheUnderwater,
                },
                sleep: {
                  canSleep: fb.sleep?.canSleep,
                  sleepOnBed: fb.sleep?.sleepOnBed,
                  lightLevel: fb.sleep?.lightLevel,
                },
                enableRiding: fb.enableRiding,
              };
            }
            return entry;
          });
        })(),
        primaryType: form.primaryType,
        baseStats: { ...form.baseStats },
        evYield: { ...form.evYield },
        catchRate: form.catchRate,
        maleRatio: form.maleRatio,
        experienceGroup: form.experienceGroup,
        baseFriendship: form.baseFriendship,
        baseExperienceYield: form.baseExperienceYield,
        eggCycles: form.eggCycles,
        shoulderMountable: !!form.shoulderMountable,
        collisionBox: { width: form.collisionBox?.width ?? 0.6, height: form.collisionBox?.height ?? 1.8 },
        scale: form.scale ?? 1.0,
        behaviors: Array.isArray(form.behaviors) ? [...form.behaviors] : [],
        // 自定义行为参数（可选，供其他扩展消费）
        behaviorParams: {
          walkSpeed: typeof form.walkSpeed === 'number' ? form.walkSpeed : undefined,
          enableRiding: typeof form.enableRiding === 'boolean' ? form.enableRiding : undefined,
          sleep: {
            canSleep: typeof form.canSleep === 'boolean' ? form.canSleep : undefined,
            sleepOnBed: typeof form.sleepOnBed === 'boolean' ? form.sleepOnBed : undefined,
            lightLevel: typeof form.sleepLightLevel === 'string' ? form.sleepLightLevel : undefined,
          }
        }
      };
      if (form.secondaryType) json.secondaryType = form.secondaryType;
      if (form.eggGroups && form.eggGroups.length) json.eggGroups = [...form.eggGroups];
      if (form.preEvolution) json.preEvolution = form.preEvolution;
      // 掉落：优先 JSON，其次按字符串 item:percent 解析（受 maxDrops 限制）
      try {
        const txt = String(form.dropsText || '').trim();
        if (txt) {
          const drops = JSON.parse(txt);
          if (Array.isArray(drops)) json.drops = drops;
        } else if (String(form.dropsString || '').trim()) {
          json.drops = parseDropsString(form.dropsString, form.maxDrops);
        }
      } catch {
        if (String(form.dropsString || '').trim()) {
          json.drops = parseDropsString(form.dropsString, form.maxDrops);
        }
      }
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
    /**
     * 从参考 species JSON 导入为表单模板（兼容 v0.3.0 字段）
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
      // v0.3.0：导入新字段（容错）
      form.evYield = data.evYield ? { ...form.evYield, ...data.evYield } : form.evYield;
      form.baseExperienceYield = typeof data.baseExperienceYield === 'number' ? data.baseExperienceYield : form.baseExperienceYield;
      form.eggCycles = typeof data.eggCycles === 'number' ? data.eggCycles : form.eggCycles;
      form.shoulderMountable = typeof data.shoulderMountable === 'boolean' ? data.shoulderMountable : form.shoulderMountable;
      form.preEvolution = typeof data.preEvolution === 'string' ? data.preEvolution : form.preEvolution;
      form.forms = Array.isArray(data.forms) ? data.forms.map(f => (typeof f === 'string' ? f : f && f.name)).filter(Boolean) : form.forms;
      // 形态能力覆盖导入
      if (Array.isArray(data.forms)) {
        for (const f of data.forms) {
          if (f && typeof f === 'object' && f.name && f.behaviour) {
            form.formBehaviors[f.name] = {
              moving: { walkSpeed: f.behaviour.moving?.walkSpeed },
              fly: { canFly: f.behaviour.fly?.canFly },
              swim: {
                canSwimInWater: f.behaviour.swim?.canSwimInWater,
                swimSpeed: f.behaviour.swim?.swimSpeed,
                canBreatheUnderwater: f.behaviour.swim?.canBreatheUnderwater,
              },
              sleep: {
                canSleep: f.behaviour.sleep?.canSleep,
                sleepOnBed: f.behaviour.sleep?.sleepOnBed,
                lightLevel: f.behaviour.sleep?.lightLevel,
              },
              enableRiding: f.behaviour.enableRiding,
            };
          }
        }
      }
      form.features = Array.isArray(data.features) ? [...data.features] : form.features;
      form.aspects = Array.isArray(data.aspects) ? [...data.aspects] : form.aspects;
      form.collisionBox = data.collisionBox ? { width: data.collisionBox.width ?? form.collisionBox.width, height: data.collisionBox.height ?? form.collisionBox.height } : form.collisionBox;
      form.scale = typeof data.scale === 'number' ? data.scale : form.scale;
      form.behaviors = Array.isArray(data.behaviors) ? [...data.behaviors] : form.behaviors;
      form.dropsText = Array.isArray(data.drops) ? JSON.stringify(data.drops, null, 2) : form.dropsText;
      // 行为与掉落细化（容错导入）
      form.walkSpeed = typeof data.walkSpeed === 'number' ? data.walkSpeed : form.walkSpeed;
      form.enableRiding = typeof data.enableRiding === 'boolean' ? data.enableRiding : form.enableRiding;
      if (data.behaviorParams && typeof data.behaviorParams === 'object') {
        const sp = data.behaviorParams.sleep || {};
        form.canSleep = typeof sp.canSleep === 'boolean' ? sp.canSleep : form.canSleep;
        form.sleepOnBed = typeof sp.sleepOnBed === 'boolean' ? sp.sleepOnBed : form.sleepOnBed;
        form.sleepLightLevel = typeof sp.lightLevel === 'string' ? sp.lightLevel : form.sleepLightLevel;
      }
      form.dropsString = typeof data.dropsString === 'string' ? data.dropsString : form.dropsString;
      form.maxDrops = typeof data.maxDrops === 'number' ? data.maxDrops : form.maxDrops;
      ElementPlus.ElMessage.success('模板导入成功，已填充表单');
    }

    /**
     * 构建项目文件（*.ccproj）的 JSON 对象
     * @function buildProjectJson
     * @param {object} form - 当前表单数据
     * @returns {object} 项目文件对象（不用于直接导入游戏）
     */
    /**
     * 构建项目文件 JSON（包含 v0.3.0 字段）
     * @function buildProjectJson
     * @param {object} form - 当前表单数据
     * @returns {object} 项目文件对象（不用于直接导入游戏）
     */
    function buildProjectJson(form) {
      return {
        version: form.projectVersion || '0.3.0',
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
            evYield: { ...form.evYield },
            height: form.height,
            weight: form.weight,
            catchRate: form.catchRate,
            maleRatio: form.maleRatio,
            experienceGroup: form.experienceGroup,
            baseFriendship: form.baseFriendship,
            baseExperienceYield: form.baseExperienceYield,
            eggCycles: form.eggCycles,
            shoulderMountable: !!form.shoulderMountable,
            eggGroups: Array.isArray(form.eggGroups) ? [...form.eggGroups] : [],
            preEvolution: form.preEvolution || undefined,
            features: Array.isArray(form.features) ? [...form.features] : [],
            aspects: Array.isArray(form.aspects) ? [...form.aspects] : [],
            forms: Array.isArray(form.forms) && form.forms.length
              ? form.forms.map(n => ({ name: String(n).trim() || 'normal' }))
              : [ { name: 'normal' } ],
            // 形态能力覆盖仅保存在项目文件，便于再次编辑
            formsConfig: { ...form.formBehaviors },
            collisionBox: { width: form.collisionBox?.width ?? 0.6, height: form.collisionBox?.height ?? 1.8 },
            scale: form.scale ?? 1.0,
            behaviors: Array.isArray(form.behaviors) ? [...form.behaviors] : [],
            behaviorParams: {
              walkSpeed: typeof form.walkSpeed === 'number' ? form.walkSpeed : undefined,
              enableRiding: typeof form.enableRiding === 'boolean' ? form.enableRiding : undefined,
              sleep: {
                canSleep: typeof form.canSleep === 'boolean' ? form.canSleep : undefined,
                sleepOnBed: typeof form.sleepOnBed === 'boolean' ? form.sleepOnBed : undefined,
                lightLevel: typeof form.sleepLightLevel === 'string' ? form.sleepLightLevel : undefined,
              }
            },
            drops: (() => {
              try {
                const d = JSON.parse(form.dropsText||'');
                return Array.isArray(d)? d: [];
              } catch {
                if (String(form.dropsString||'').trim()) return parseDropsString(form.dropsString, form.maxDrops);
                return [];
              }
            })(),
            // 便于二次编辑的原始输入
            maxDrops: typeof form.maxDrops === 'number' ? form.maxDrops : undefined,
            dropsString: String(form.dropsString||'') || undefined,
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
    /**
     * 校验项目文件（基础 + v0.3.0 字段）
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

      if (!project.version) warnings.push('缺少版本字段，已假定为 0.3.0');
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
        // v0.3.0 新增字段的容错校验
        const ev = s.evYield || {};
        for (const k of needed) {
          if (typeof ev[k] !== 'number') warnings.push(`evYield.${k} 应为数字（0~3）`);
        }
        if (typeof s.baseExperienceYield !== 'number') warnings.push('baseExperienceYield 建议为数字');
        if (typeof s.eggCycles !== 'number') warnings.push('eggCycles 建议为数字');
        if (s.forms && !Array.isArray(s.forms)) warnings.push('forms 应为数组');
        if (s.features && !Array.isArray(s.features)) warnings.push('features 应为数组');
        if (s.aspects && !Array.isArray(s.aspects)) warnings.push('aspects 应为数组');
        if (s.collisionBox && (typeof s.collisionBox.width !== 'number' || typeof s.collisionBox.height !== 'number')) warnings.push('collisionBox.width/height 建议为数字');
        if (typeof s.scale !== 'undefined' && typeof s.scale !== 'number') warnings.push('scale 建议为数字');
        if (s.behaviors && !Array.isArray(s.behaviors)) warnings.push('behaviors 应为数组');
        if (s.drops && !Array.isArray(s.drops)) warnings.push('drops 应为数组');
        // 行为与掉落细化字段（非强制）
        if (s.behaviorParams) {
          const bp = s.behaviorParams;
          if (typeof bp.walkSpeed !== 'undefined' && typeof bp.walkSpeed !== 'number') warnings.push('behaviorParams.walkSpeed 建议为数字');
          if (typeof bp.enableRiding !== 'undefined' && typeof bp.enableRiding !== 'boolean') warnings.push('behaviorParams.enableRiding 建议为布尔');
          if (bp.sleep) {
            if (typeof bp.sleep.canSleep !== 'undefined' && typeof bp.sleep.canSleep !== 'boolean') warnings.push('behaviorParams.sleep.canSleep 建议为布尔');
            if (typeof bp.sleep.sleepOnBed !== 'undefined' && typeof bp.sleep.sleepOnBed !== 'boolean') warnings.push('behaviorParams.sleep.sleepOnBed 建议为布尔');
            if (typeof bp.sleep.lightLevel !== 'undefined' && typeof bp.sleep.lightLevel !== 'string') warnings.push('behaviorParams.sleep.lightLevel 建议为字符串（如 0-4）');
          }
        }
        if (typeof s.maxDrops !== 'undefined' && typeof s.maxDrops !== 'number') warnings.push('maxDrops 建议为数字');
        // 形态能力覆盖校验（项目文件）
        if (s.formsConfig && typeof s.formsConfig !== 'object') warnings.push('formsConfig 建议为对象');
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
    /**
     * 迁移旧版本项目文件到 v0.3.0 结构（容错）
     * @function migrateProject
     * @param {object} project - 原始项目文件对象
     * @returns {object} 迁移后的项目对象
     */
    function migrateProject(project) {
      if (!project || typeof project !== 'object') return project;

      const migrated = { ...project };
      // 版本字段标准化（v0.3.0）
      if (!migrated.version) migrated.version = '0.3.0';

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
          evYield: migrated.evYield || undefined,
          height: migrated.height,
          weight: migrated.weight,
          catchRate: migrated.catchRate,
          maleRatio: migrated.maleRatio,
          experienceGroup: migrated.experienceGroup,
          baseFriendship: migrated.baseFriendship,
          baseExperienceYield: migrated.baseExperienceYield,
          eggCycles: migrated.eggCycles,
          shoulderMountable: migrated.shoulderMountable,
          eggGroups: migrated.eggGroups || [],
          preEvolution: migrated.preEvolution,
          features: migrated.features || [],
          aspects: migrated.aspects || [],
          forms: Array.isArray(migrated.forms) ? migrated.forms.map(n => ({ name: String(n).trim() || 'normal' })) : undefined,
          collisionBox: migrated.collisionBox,
          scale: migrated.scale,
          behaviors: migrated.behaviors,
          drops: migrated.drops,
          behaviorParams: migrated.behaviorParams,
          maxDrops: migrated.maxDrops,
          dropsString: migrated.dropsString,
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
    /**
     * 将项目文件应用到表单（涵盖 v0.3.0 字段）
     * @function applyProjectToForm
     * @param {object} project - 项目文件对象（已迁移）
     * @returns {void}
     */
    function applyProjectToForm(project) {
      try {
        form.projectVersion = project.version || '0.3.0';
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
          form.evYield = s.evYield ? { ...form.evYield, ...s.evYield } : form.evYield;
          form.height = typeof s.height === 'number' ? s.height : form.height;
          form.weight = typeof s.weight === 'number' ? s.weight : form.weight;
          form.catchRate = typeof s.catchRate === 'number' ? s.catchRate : form.catchRate;
          form.maleRatio = typeof s.maleRatio === 'number' ? s.maleRatio : form.maleRatio;
          form.experienceGroup = s.experienceGroup || form.experienceGroup;
          form.baseFriendship = typeof s.baseFriendship === 'number' ? s.baseFriendship : form.baseFriendship;
          form.eggGroups = Array.isArray(s.eggGroups) ? s.eggGroups : [];
          form.baseExperienceYield = typeof s.baseExperienceYield === 'number' ? s.baseExperienceYield : form.baseExperienceYield;
          form.eggCycles = typeof s.eggCycles === 'number' ? s.eggCycles : form.eggCycles;
          form.shoulderMountable = typeof s.shoulderMountable === 'boolean' ? s.shoulderMountable : form.shoulderMountable;
          form.preEvolution = typeof s.preEvolution === 'string' ? s.preEvolution : form.preEvolution;
          form.features = Array.isArray(s.features) ? [...s.features] : form.features;
          form.aspects = Array.isArray(s.aspects) ? [...s.aspects] : form.aspects;
          form.forms = Array.isArray(s.forms) ? s.forms.map(f => (typeof f === 'string' ? f : f && f.name)).filter(Boolean) : form.forms;
          // 从 species[0].forms 中的 behaviour 或 formsConfig 回填形态能力覆盖
          if (Array.isArray(s.forms)) {
            for (const f of s.forms) {
              if (f && typeof f === 'object' && f.name && f.behaviour) {
                form.formBehaviors[f.name] = {
                  moving: { walkSpeed: f.behaviour.moving?.walkSpeed },
                  fly: { canFly: f.behaviour.fly?.canFly },
                  swim: {
                    canSwimInWater: f.behaviour.swim?.canSwimInWater,
                    swimSpeed: f.behaviour.swim?.swimSpeed,
                    canBreatheUnderwater: f.behaviour.swim?.canBreatheUnderwater,
                  },
                  sleep: {
                    canSleep: f.behaviour.sleep?.canSleep,
                    sleepOnBed: f.behaviour.sleep?.sleepOnBed,
                    lightLevel: f.behaviour.sleep?.lightLevel,
                  },
                  enableRiding: f.behaviour.enableRiding,
                };
              }
            }
          }
          if (s.formsConfig && typeof s.formsConfig === 'object') {
            form.formBehaviors = { ...form.formBehaviors, ...s.formsConfig };
          }
          form.collisionBox = s.collisionBox ? { width: s.collisionBox.width ?? form.collisionBox.width, height: s.collisionBox.height ?? form.collisionBox.height } : form.collisionBox;
          form.scale = typeof s.scale === 'number' ? s.scale : form.scale;
          form.behaviors = Array.isArray(s.behaviors) ? [...s.behaviors] : form.behaviors;
          form.dropsText = Array.isArray(s.drops) ? JSON.stringify(s.drops, null, 2) : form.dropsText;
          // 行为与掉落细化
          const bp = s.behaviorParams || {};
          form.walkSpeed = typeof bp.walkSpeed === 'number' ? bp.walkSpeed : form.walkSpeed;
          form.enableRiding = typeof bp.enableRiding === 'boolean' ? bp.enableRiding : form.enableRiding;
          const sp = bp.sleep || {};
          form.canSleep = typeof sp.canSleep === 'boolean' ? sp.canSleep : form.canSleep;
          form.sleepOnBed = typeof sp.sleepOnBed === 'boolean' ? sp.sleepOnBed : form.sleepOnBed;
          form.sleepLightLevel = typeof sp.lightLevel === 'string' ? sp.lightLevel : form.sleepLightLevel;
          form.maxDrops = typeof s.maxDrops === 'number' ? s.maxDrops : form.maxDrops;
          form.dropsString = typeof s.dropsString === 'string' ? s.dropsString : form.dropsString;
        }
      } catch (e) {
        console.error(e);
        ElementPlus.ElMessage.error('应用项目到表单时发生错误');
      }
    }

    /**
     * 将形如 "namespace:item[:percent]" 的分号分隔字符串解析为掉落数组
     * @function parseDropsString
     * @param {string} str - 输入字符串，如 "cobblemon:light_ball:5;minecraft:apple:10"
     * @param {number} maxDrops - 最多条目数量（可用于限制）
     * @returns {{itemId:string,countMin:number,countMax:number,chance:number}[]} 掉落数组
     */
    function parseDropsString(str, maxDrops) {
      const result = [];
      const parts = String(str || '').split(';').map(s => s.trim()).filter(Boolean);
      for (const p of parts) {
        const segs = p.split(':').map(s => s.trim()).filter(Boolean);
        if (!segs.length) continue;
        const itemId = segs.slice(0,2).join(':'); // 支持带命名空间
        const percentRaw = segs[2];
        const percent = percentRaw === undefined ? 100 : Number(percentRaw);
        if (!itemId) continue;
        const chance = isNaN(percent) ? 1 : Math.max(0, Math.min(100, percent)) / 100;
        result.push({ itemId, countMin: 1, countMax: 1, chance });
        if (typeof maxDrops === 'number' && result.length >= maxDrops) break;
      }
      return result;
    }

    /**
     * 同步两个掉落输入：字符串 item:percent 与 JSON 文本
     * @function syncDropsBetweenInputs
     * @param {('string'|'json')} source - 触发来源
     * @returns {void}
     */
    function syncDropsBetweenInputs(source) {
      try {
        if (source === 'string') {
          const arr = parseDropsString(form.dropsString, form.maxDrops);
          form.dropsText = JSON.stringify(arr, null, 2);
        } else if (source === 'json') {
          const arr = JSON.parse(form.dropsText || '[]');
          if (Array.isArray(arr)) {
            const s = arr.map(d => {
              const pct = typeof d.chance === 'number' ? Math.round(d.chance * 100) : 100;
              return `${d.itemId}:${pct}`;
            }).join(';');
            form.dropsString = s;
          }
        }
      } catch {}
    }

    /**
     * 初始化并规范化指定形态的能力对象
     * @function initFormBehavior
     * @param {string} name - 形态名称，如 'normal'、'winter'
     * @returns {void}
     * @description
     * - 若该形态不存在于 `form.formBehaviors`，将以默认值创建。
     * - 若存在但字段不完整，补齐缺失的嵌套对象与字段。
     * - 同时对速度类字段执行范围归一化（0~10，保留两位小数）。
     */
    function initFormBehavior(name) {
      if (!name) return;
      const clamp2 = (n) => Number(Math.max(0, Math.min(10, Number(n || 0))).toFixed(2));
      if (!form.formBehaviors[name]) {
        form.formBehaviors[name] = {
          moving: { walkSpeed: 0.42 },
          fly: { canFly: false },
          swim: { canSwimInWater: true, swimSpeed: 0.4, canBreatheUnderwater: false },
          sleep: { canSleep: null, sleepOnBed: null, lightLevel: '0-4' },
          enableRiding: false,
        };
        return;
      }
      const fb = form.formBehaviors[name];
      fb.moving = fb.moving || {};
      fb.fly = fb.fly || {};
      fb.swim = fb.swim || {};
      fb.sleep = fb.sleep || {};
      // 默认填充
      fb.moving.walkSpeed = clamp2(fb.moving.walkSpeed ?? 0.42);
      fb.fly.canFly = typeof fb.fly.canFly === 'boolean' ? fb.fly.canFly : false;
      fb.swim.canSwimInWater = typeof fb.swim.canSwimInWater === 'boolean' ? fb.swim.canSwimInWater : true;
      fb.swim.swimSpeed = clamp2(fb.swim.swimSpeed ?? 0.4);
      fb.swim.canBreatheUnderwater = typeof fb.swim.canBreatheUnderwater === 'boolean' ? fb.swim.canBreatheUnderwater : false;
      fb.sleep.canSleep = typeof fb.sleep.canSleep === 'boolean' ? fb.sleep.canSleep : null;
      fb.sleep.sleepOnBed = typeof fb.sleep.sleepOnBed === 'boolean' ? fb.sleep.sleepOnBed : null;
      fb.sleep.lightLevel = typeof fb.sleep.lightLevel === 'string' ? fb.sleep.lightLevel : '0-4';
      fb.enableRiding = typeof fb.enableRiding === 'boolean' ? fb.enableRiding : false;
    }

    /**
     * 复制一个形态的能力到多个目标形态
     * @function copyFormAbilities
     * @param {string} source - 源形态名称
     * @param {string[]} targets - 目标形态名称数组
     * @param {'overwrite'|'merge'} mode - 复制模式：overwrite 完全覆盖；merge 仅填充空值
     * @returns {number} 实际复制的目标数量
     */
    function copyFormAbilities(source, targets = [], mode = 'overwrite') {
      if (!source || !Array.isArray(targets) || !targets.length) return 0;
      initFormBehavior(source);
      const src = JSON.parse(JSON.stringify(form.formBehaviors[source]));
      let count = 0;
      for (const t of targets) {
        if (!t || t === source) continue;
        initFormBehavior(t);
        if (mode === 'overwrite') {
          form.formBehaviors[t] = JSON.parse(JSON.stringify(src));
          count++;
        } else {
          const dst = form.formBehaviors[t];
          dst.enableRiding = dst.enableRiding ?? src.enableRiding;
          dst.moving.walkSpeed = dst.moving.walkSpeed ?? src.moving.walkSpeed;
          dst.fly.canFly = dst.fly.canFly ?? src.fly.canFly;
          dst.swim.canSwimInWater = dst.swim.canSwimInWater ?? src.swim.canSwimInWater;
          dst.swim.swimSpeed = dst.swim.swimSpeed ?? src.swim.swimSpeed;
          dst.swim.canBreatheUnderwater = dst.swim.canBreatheUnderwater ?? src.swim.canBreatheUnderwater;
          dst.sleep.canSleep = (dst.sleep.canSleep ?? src.sleep.canSleep);
          dst.sleep.sleepOnBed = (dst.sleep.sleepOnBed ?? src.sleep.sleepOnBed);
          dst.sleep.lightLevel = dst.sleep.lightLevel ?? src.sleep.lightLevel;
          count++;
        }
      }
      return count;
    }

    /**
     * 应用速度预设到指定形态
     * @function applySpeedPreset
     * @param {string} name - 形态名称
     * @param {'walk'|'swim'} type - 速度类型
     * @param {'slow'|'normal'|'fast'|'rapid'} preset - 预设档位
     * @returns {number} 返回设置后的速度值
     */
    function applySpeedPreset(name, type, preset) {
      initFormBehavior(name);
      const presets = {
        walk: { slow: 0.2, normal: 0.42, fast: 0.7, rapid: 1.0 },
        swim: { slow: 0.2, normal: 0.4, fast: 0.8, rapid: 1.2 },
      };
      const v = presets[type]?.[preset];
      if (v == null) return NaN;
      if (type === 'walk') {
        form.formBehaviors[name].moving.walkSpeed = Number(v.toFixed(2));
        return form.formBehaviors[name].moving.walkSpeed;
      }
      form.formBehaviors[name].swim.swimSpeed = Number(v.toFixed(2));
      return form.formBehaviors[name].swim.swimSpeed;
    }

    /**
     * 速度变更校验与归一化（0-10，保留两位小数）
     * @function handleSpeedChange
     * @param {string} name - 形态名称
     * @param {'walk'|'swim'} type - 速度类型
     * @returns {number} 归一化后的值
     */
    function handleSpeedChange(name, type) {
      initFormBehavior(name);
      const clamp = (n) => Math.max(0, Math.min(10, Number(n || 0)));
      if (type === 'walk') {
        const n = clamp(form.formBehaviors[name].moving.walkSpeed);
        form.formBehaviors[name].moving.walkSpeed = Number(n.toFixed(2));
        return n;
      }
      const n = clamp(form.formBehaviors[name].swim.swimSpeed);
      form.formBehaviors[name].swim.swimSpeed = Number(n.toFixed(2));
      return n;
    }

    /**
     * 显示变量说明弹窗
     * @function showFieldHelp
     * @param {string} key - 变量键，如 'baseStats.hp'、'eggCycles'
     * @returns {Promise<void>}
     */
    async function showFieldHelp(key) {
      const map = {
        'speciesId': '物种唯一标识，如 "tentaquil"。用于文件名与语言键。',
        'primaryType': '主属性，影响克制关系。如 "poison"。',
        'secondaryType': '副属性（可空），例如 "water"。',
        'baseStats.hp': '基础生命值（1~255）。示例：125',
        'baseStats.attack': '基础攻击（1~255）。示例：105',
        'baseStats.defence': '基础防御（1~255）。示例：95',
        'baseStats.special_attack': '基础特攻（1~255）。示例：120',
        'baseStats.special_defence': '基础特防（1~255）。示例：85',
        'baseStats.speed': '基础速度（1~255）。示例：70',
        'evYield': '击败后给予的努力值，单项 0~3。示例：{"hp":2,"special_attack":1}',
        'baseExperienceYield': '被击败时提供的经验值基数。示例：270',
        'eggCycles': '孵化所需轮次（步数/256）。示例：25',
        'eggGroups': '繁殖兼容分组，可多选。示例：field, fairy',
        'collisionBox': '实体碰撞箱宽高，默认 0.6x1.8。示例：0.8 x 2.0',
        'scale': '渲染缩放（倍率）。示例：1.0',
        'behaviors': '行为标签（自定义），如 "daytime_spawn"、"non_aggressive"',
        'drops': '掉落列表，JSON 数组。示例：[{"itemId":"cobblemon:poison_barb","countMin":1,"countMax":1,"chance":0.25}]',
        'formsBehaviour': '形态能力配置：在 species.forms[].behaviour 中为不同形态定义 moving/fly/swim/sleep/enableRiding 等覆盖值。示例：{"name":"winter","behaviour":{"moving":{"walkSpeed":0.42},"swim":{"canSwimInWater":true,"swimSpeed":0.4}}}',
      };
      const text = map[key] || '暂无说明';
      await ElementPlus.ElMessageBox.alert(text, `说明：${key}`, { confirmButtonText: '好的', center: true });
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

    return { form, typeOptions, eggGroupOptions, expGroupOptions, behaviorOptions, formOptions, featuresOptions, aspectsOptions, activeFormPanels, copySourceForm, copyTargetForms, copyMode, helpKey, helpKeyOptions, useExample, exportPack, importTemplateFromFile, saveProject, loadProject, showFieldHelp, parseDropsString, syncDropsBetweenInputs, initFormBehavior, copyFormAbilities, applySpeedPreset, handleSpeedChange };
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