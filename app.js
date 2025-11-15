// CobbleCreator v0.1.0 前端原型
// 作者：江下犹泷（JX-YL）

const { createApp, ref, reactive, computed } = Vue;

// 创建并配置应用：注册 Element Plus，确保组件正常渲染
const app = createApp({
  setup() {
    const typeOptions = [
      'normal','fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'
    ];

    // 成长速率与蛋组选项（带中文标签），用于下拉选择
    const experienceGroupOptions = [
      { label: '慢速 slow', value: 'slow' },
      { label: '中慢 medium_slow', value: 'medium_slow' },
      { label: '中快 medium_fast', value: 'medium_fast' },
      { label: '快速 fast', value: 'fast' },
      { label: '波动 fluctuating', value: 'fluctuating' },
      { label: '变化 erratic', value: 'erratic' }
    ];
    const eggGroupOptions = [
      { label: '怪兽 monster', value: 'monster' },
      { label: '陆上 field', value: 'field' },
      { label: '妖精 fairy', value: 'fairy' },
      { label: '龙 dragon', value: 'dragon' },
      { label: '虫 bug', value: 'bug' },
      { label: '飞行 flying', value: 'flying' },
      { label: '矿物 mineral', value: 'mineral' },
      { label: '不定形 amorphous', value: 'amorphous' },
      { label: '植物 grass', value: 'grass' },
      { label: '人型 human_like', value: 'human_like' },
      { label: '水中一 water_1', value: 'water_1' },
      { label: '水中二 water_2', value: 'water_2' },
      { label: '水中三 water_3', value: 'water_3' },
      { label: '百变怪 ditto', value: 'ditto' },
      { label: '不可孵化 no_eggs', value: 'no_eggs' }
    ];

    // 表单数据模型（v0.3.0 扩展）
    const form = reactive({
      namespace: 'cobblemon',
      packName: 'cobble-pack',
      speciesId: '',
      packDescription: 'CobbleCreator datapack by JX-YL',
      packFormat: 48,
      // 项目版本（用于 .ccproj 保存/加载）
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
      // v0.3.0：EV 产出
      evYield: {
        hp: 0, attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0
      },
      height: 10,
      weight: 100,
      catchRate: 45,
      maleRatio: 0.5,
      experienceGroup: 'medium_fast',
      // v0.3.0：基础经验与蛋周期
      baseExperienceYield: 50,
      eggCycles: 20,
      baseFriendship: 50,
      eggGroups: [],
      // v0.3.0：能力（逗号分隔输入），示例："cutecharm, h:unaware"
      abilitiesText: '',
      // v0.3.0：模型与碰撞、缩放、肩载
      baseScale: 1.0,
      shoulderMountable: false,
      hitbox: { width: 0.8, height: 1.0, fixed: false },
      // v0.3.1：行为与掉落
      behaviour: {
        walkSpeed: '',
        canLook: false,
        canSwim: false,
        swimSpeed: '',
        canSwimInWater: false,
        canBreatheUnderwater: false,
        canFly: false,
        flySpeed: '',
        canSleep: false,
        willSleepOnBed: false,
        sleepLight: ''
      },
      dropsText: '',
      dropsMaxAmount: 0,
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
      // 行为与掉落示例
      form.behaviour.walkSpeed = 0.42;
      form.behaviour.canSwim = true;
      form.behaviour.swimSpeed = 0.35;
      form.behaviour.canFly = true;
      form.behaviour.flySpeed = 0.6;
      form.behaviour.canSleep = true;
      form.behaviour.willSleepOnBed = true;
      form.behaviour.sleepLight = '0-4';
      form.dropsText = 'cobblemon:light_ball:5;minecraft:apple:10';
      form.dropsMaxAmount = 3;
    }

    /**
     * 生成 pack.mcmeta 的 JSON 内容
     * @function buildPackMcmeta
     * @param {string} description - 包描述
     * @returns {object} pack.mcmeta 对应的对象
     */
    function buildPackMcmeta(description, format) {
      return {
        pack: {
          pack_format: (typeof format === 'number' && format > 0) ? format : 48,
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
      // 支持单段描述或双段描述（desc1/desc2），优先按换行切分
      const lines = typeof desc === 'string' ? desc.split('\n').filter(s => s.trim().length) : [];
      if (lines.length >= 2) {
        return {
          [`${keyBase}.name`]: name || speciesId,
          [`${keyBase}.desc1`]: lines[0],
          [`${keyBase}.desc2`]: lines[1],
        };
      }
      return {
        [`${keyBase}.name`]: name || speciesId,
        [`${keyBase}.desc`]: desc || '',
      };
    }

    /**
     * 根据描述文本生成 species.pokedex 引用键
     * - 若文本含换行且有两段，返回 desc1 与 desc2 键
     * - 否则返回单一 desc 键
     * @function buildPokedexKeys
     * @param {string} speciesId - 物种ID
     * @param {string} descText - 描述文本（英文优先，其次中文）
     * @returns {string[]} pokedex 键数组
     */
    function buildPokedexKeys(speciesId, descText) {
      const base = `cobblemon.species.${speciesId}`;
      const lines = typeof descText === 'string' ? descText.split('\n').filter(s => s.trim().length) : [];
      if (lines.length >= 2) return [ `${base}.desc1`, `${base}.desc2` ];
      return [ `${base}.desc` ];
    }

    /**
     * 生成物种基础 JSON
     * @function buildSpeciesJson
     * @param {object} form - 表单数据
     * @returns {object} species 基础配置 JSON
     */
    function buildSpeciesJson(form) {
      const json = {
        // 物种唯一标识，供游戏注册与召唤使用
        id: form.speciesId,
        implemented: true,
        // 物种显示名优先使用英文名，其次中文名，再次回退 speciesId
        name: form.enName || form.zhName || form.displayName || form.speciesId,
        labels: [ 'custom' ],
        // pokedex 文本引用：优先使用英文描述，否则中文；按换行自动切分为 desc1/desc2
        pokedex: buildPokedexKeys(form.speciesId, form.enDesc || form.zhDesc),
        height: form.height,
        weight: form.weight,
        features: [],
        aspects: [],
        forms: [ { name: 'normal' } ],
        primaryType: form.primaryType,
        baseStats: { ...form.baseStats },
        evYield: { ...form.evYield },
        catchRate: form.catchRate,
        maleRatio: form.maleRatio,
        experienceGroup: form.experienceGroup,
        baseExperienceYield: form.baseExperienceYield,
        baseFriendship: form.baseFriendship,
        baseScale: form.baseScale,
        shoulderMountable: !!form.shoulderMountable,
        hitbox: { width: form.hitbox?.width ?? 0.8, height: form.hitbox?.height ?? 1.0, fixed: !!(form.hitbox?.fixed) },
      };
      if (form.secondaryType) json.secondaryType = form.secondaryType;
      // 规范化蛋组，限制最多两个；若包含特殊值（ditto/no_eggs）则仅保留单一值
      const sanitizedEggs = sanitizeEggGroups(form.eggGroups);
      if (sanitizedEggs.length) json.eggGroups = sanitizedEggs;
      // 解析能力（逗号分隔）
      const abilities = parseAbilities(form.abilitiesText);
      if (abilities.length) json.abilities = abilities;
      // 蛋周期（可选）
      if (typeof form.eggCycles === 'number') json.eggCycles = form.eggCycles;
      // 行为（可选）
      const behaviour = buildBehaviour(form);
      if (behaviour) json.behaviour = behaviour;
      // 掉落（可选）
      const drops = buildDrops(form);
      if (drops) json.drops = drops;
      return json;
    }

    /**
     * 规范化蛋组数组，确保输出合法组合
     * 规则：
     * - 只允许已知值；去重并保持原顺序
     * - 最多保留 2 个蛋组
     * - 若包含 'ditto' 或 'no_eggs'，强制仅保留该单一蛋组
     * @function sanitizeEggGroups
     * @param {string[]} groups - 选中的蛋组数组
     * @returns {string[]} 规范化后的蛋组数组
     */
    function sanitizeEggGroups(groups) {
      if (!Array.isArray(groups)) return [];
      const allowed = new Set(eggGroupOptions.map(o => o.value));
      const special = new Set(['ditto', 'no_eggs']);
      const uniq = [];
      for (const g of groups) {
        if (!allowed.has(g)) continue;
        if (!uniq.includes(g)) uniq.push(g);
      }
      // 特殊蛋组只允许单一
      const hasSpecial = uniq.find(g => special.has(g));
      if (hasSpecial) return [hasSpecial];
      // 最多两个
      return uniq.slice(0, 2);
    }

    /**
     * 解析能力输入文本为数组
     * @function parseAbilities
     * @param {string} text - 逗号分隔的能力列表，如 "cutecharm, h:unaware"
     * @returns {string[]} 能力标识数组（保留 h: 前缀作为隐藏特性）
     */
    function parseAbilities(text) {
      if (!text || typeof text !== 'string') return [];
      return text
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length);
    }

    /**
     * 构建 Behaviour 字段对象
     * @function buildBehaviour
     * @param {object} form - 当前表单数据
     * @returns {object|undefined} Cobblemon behaviour 对象（若无有效输入则返回 undefined）
     */
    /**
     * 构建行为配置对象。
     * - 支持移动配置：walk / swim / fly 及其速度与能力开关。
     * - 支持休息配置：是否可睡、是否在床上睡、休息光照范围。
     * 返回 undefined 表示未提供任何相关配置，避免多余字段写入。
     * @param {Object} form 当前表单数据
     * @returns {Object|undefined} Cobblemon 行为配置对象
     */
    function buildBehaviour(form) {
      const b = form.behaviour || {};
      const hasWalk = typeof b.walkSpeed === 'string' ? b.walkSpeed.trim().length > 0 : typeof b.walkSpeed === 'number';
      const hasSwim = !!b.canSwim || (typeof b.swimSpeed === 'string' ? b.swimSpeed.trim().length > 0 : typeof b.swimSpeed === 'number') || !!b.canSwimInWater || !!b.canBreatheUnderwater;
      const hasFly = !!b.canFly || (typeof b.flySpeed === 'string' ? b.flySpeed.trim().length > 0 : typeof b.flySpeed === 'number');
      const hasSleep = !!b.canSleep || !!b.willSleepOnBed || (typeof b.sleepLight === 'string' && b.sleepLight.trim().length > 0);
      if (!hasWalk && !hasSwim && !hasFly && !hasSleep) return undefined;
      const out = {};
      // moving.walk
      if (hasWalk) {
        const ws = typeof b.walkSpeed === 'number' ? b.walkSpeed : parseFloat(b.walkSpeed);
        if (!isNaN(ws)) {
          out.moving = out.moving || {};
          out.moving.walk = { walkSpeed: ws };
        }
      }
      // moving.canLook
      if (typeof b.canLook === 'boolean') {
        out.moving = out.moving || {};
        out.moving.canLook = b.canLook;
      }
      // moving.swim
      if (hasSwim) {
        const ss = typeof b.swimSpeed === 'number' ? b.swimSpeed : parseFloat(b.swimSpeed);
        out.moving = out.moving || {};
        out.moving.swim = {
          ...(typeof b.canSwim === 'boolean' ? { canSwim: b.canSwim } : {}),
          ...(isNaN(ss) ? {} : { swimSpeed: ss }),
          ...(typeof b.canSwimInWater === 'boolean' ? { canSwimInWater: b.canSwimInWater } : {}),
          ...(typeof b.canBreatheUnderwater === 'boolean' ? { canBreatheUnderwater: b.canBreatheUnderwater } : {})
        };
      }
      // moving.fly
      if (hasFly) {
        const fs = typeof b.flySpeed === 'number' ? b.flySpeed : parseFloat(b.flySpeed);
        out.moving = out.moving || {};
        out.moving.fly = {
          ...(typeof b.canFly === 'boolean' ? { canFly: b.canFly } : {}),
          ...(isNaN(fs) ? {} : { flySpeed: fs })
        };
      }
      if (hasSleep) {
        out.resting = {
          canSleep: !!b.canSleep,
          willSleepOnBed: !!b.willSleepOnBed
        };
        if (typeof b.sleepLight === 'string' && b.sleepLight.trim().length) {
          out.resting.light = b.sleepLight.trim();
        }
      }
      return out;
    }

    /**
     * 将 drops 文本解析为 entries 数组
     * @function parseDrops
     * @param {string} text - 格式：item:percent；分号分隔
     * @returns {Array<{item:string, percentage:number}>} 解析后的条目
     */
    function parseDrops(text) {
      if (!text || typeof text !== 'string') return [];
      return text
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(seg => {
          // 语法：item:percent[@qtyRange] 或 item,percent[@qtyRange]
          const main = seg.split('@');
          const head = main[0];
          const qtyRange = (main[1] || '').trim();
          const parts = head.includes(':') ? head.split(':') : head.split(',');
          const item = (parts[0] || '').trim();
          const pct = parseFloat((parts[1] || '').trim());
          if (!item || isNaN(pct)) return null;
          const out = { item, percentage: pct };
          if (qtyRange && /^\d+(?:-\d+)?$/.test(qtyRange)) out.quantityRange = qtyRange;
          return out;
        })
        .filter(Boolean);
    }

    /**
     * 构建 drops 字段对象
     * @function buildDrops
     * @param {object} form - 当前表单数据
     * @returns {object|undefined} Cobblemon drops 对象（若无有效输入则返回 undefined）
     */
    function buildDrops(form) {
      const entries = parseDrops(form.dropsText);
      const amount = typeof form.dropsMaxAmount === 'number' ? form.dropsMaxAmount : parseInt(form.dropsMaxAmount, 10);
      if ((!entries || entries.length === 0) && (!amount || isNaN(amount))) return undefined;
      const out = {};
      if (!isNaN(amount)) out.amount = amount;
      if (entries.length) out.entries = entries;
      return Object.keys(out).length ? out : undefined;
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
      form.evYield = data.evYield ? { ...form.evYield, ...data.evYield } : form.evYield;
      form.height = typeof data.height === 'number' ? data.height : form.height;
      form.weight = typeof data.weight === 'number' ? data.weight : form.weight;
      form.catchRate = typeof data.catchRate === 'number' ? data.catchRate : form.catchRate;
      form.maleRatio = typeof data.maleRatio === 'number' ? data.maleRatio : form.maleRatio;
      form.experienceGroup = data.experienceGroup || form.experienceGroup;
      form.baseExperienceYield = typeof data.baseExperienceYield === 'number' ? data.baseExperienceYield : form.baseExperienceYield;
      form.baseFriendship = typeof data.baseFriendship === 'number' ? data.baseFriendship : form.baseFriendship;
      form.eggGroups = Array.isArray(data.eggGroups) ? data.eggGroups : [];
      form.eggCycles = typeof data.eggCycles === 'number' ? data.eggCycles : form.eggCycles;
      // 解析 abilities 列表回填输入框
      form.abilitiesText = Array.isArray(data.abilities) ? data.abilities.join(', ') : '';
      // 模型与碰撞、缩放与肩载
      form.baseScale = typeof data.baseScale === 'number' ? data.baseScale : form.baseScale;
      form.shoulderMountable = !!data.shoulderMountable;
      form.hitbox = data.hitbox ? { width: data.hitbox.width ?? form.hitbox.width, height: data.hitbox.height ?? form.hitbox.height, fixed: !!data.hitbox.fixed } : form.hitbox;
      // 行为与掉落（模板导入）
      const beh = data.behaviour || {};
      if (beh?.moving?.walk?.walkSpeed !== undefined) {
        form.behaviour.walkSpeed = beh.moving.walk.walkSpeed;
      } else {
        form.behaviour.walkSpeed = '';
      }
      // canLook
      form.behaviour.canLook = !!(beh?.moving?.canLook);
      // swim
      form.behaviour.canSwim = !!(beh?.moving?.swim?.canSwim);
      form.behaviour.swimSpeed = beh?.moving?.swim?.swimSpeed !== undefined ? beh.moving.swim.swimSpeed : '';
      form.behaviour.canSwimInWater = !!(beh?.moving?.swim?.canSwimInWater);
      form.behaviour.canBreatheUnderwater = !!(beh?.moving?.swim?.canBreatheUnderwater);
      // fly
      form.behaviour.canFly = !!(beh?.moving?.fly?.canFly);
      form.behaviour.flySpeed = beh?.moving?.fly?.flySpeed !== undefined ? beh.moving.fly.flySpeed : '';
      form.behaviour.canSleep = !!(beh?.resting?.canSleep);
      form.behaviour.willSleepOnBed = !!(beh?.resting?.willSleepOnBed);
      form.behaviour.sleepLight = typeof beh?.resting?.light === 'string' ? beh.resting.light : '';
      const drops = data.drops || {};
      form.dropsMaxAmount = typeof drops.amount === 'number' ? drops.amount : 0;
      form.dropsText = Array.isArray(drops.entries)
        ? drops.entries
            .map(e => {
              const pct = typeof e.percentage === 'number' ? e.percentage : '';
              const qty = e.quantityRange ? `@${e.quantityRange}` : '';
              return `${e.item}:${pct}${qty}`;
            })
            .join(';')
        : '';
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
        version: form.projectVersion || '0.3.0',
        namespace: form.namespace || 'cobblemon',
        meta: {
          packName: form.packName || (form.speciesId ? `${form.speciesId}-pack` : 'cobble-pack'),
          description: form.packDescription || 'CobbleCreator datapack by JX-YL',
          packFormat: form.packFormat || 48,
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
            baseExperienceYield: form.baseExperienceYield,
            baseFriendship: form.baseFriendship,
            eggGroups: Array.isArray(form.eggGroups) ? [...form.eggGroups] : [],
            eggCycles: typeof form.eggCycles === 'number' ? form.eggCycles : undefined,
            abilities: parseAbilities(form.abilitiesText),
            baseScale: form.baseScale,
            shoulderMountable: !!form.shoulderMountable,
            hitbox: { width: form.hitbox?.width ?? 0.8, height: form.hitbox?.height ?? 1.0, fixed: !!(form.hitbox?.fixed) },
            // 行为与掉落写入项目文件，便于后续编辑
            behaviour: buildBehaviour(form),
            drops: buildDrops(form),
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
        // EV 产出校验
        const ev = s.evYield || {};
        for (const k of needed) {
          if (typeof ev[k] !== 'number') warnings.push(`evYield.${k} 缺失或非数字，建议填写 0~3 之间的值`);
        }
        if (typeof s.maleRatio !== 'number' || s.maleRatio < 0 || s.maleRatio > 1) warnings.push('maleRatio 建议为 0~1 的数字');
        if (typeof s.catchRate !== 'number') warnings.push('catchRate 建议为数字');
        if (typeof s.baseFriendship !== 'number') warnings.push('baseFriendship 建议为数字');
        if (typeof s.baseExperienceYield !== 'number') warnings.push('baseExperienceYield 建议为数字');
        if (typeof s.eggCycles !== 'number') warnings.push('eggCycles 建议为数字');
        if (typeof s.baseScale !== 'number') warnings.push('baseScale 建议为数字');
        const hb = s.hitbox || {};
        if (typeof hb.width !== 'number' || typeof hb.height !== 'number') warnings.push('hitbox.width/height 建议为数字');
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
          evYield: migrated.evYield || undefined,
          height: migrated.height,
          weight: migrated.weight,
          catchRate: migrated.catchRate,
          maleRatio: migrated.maleRatio,
          experienceGroup: migrated.experienceGroup,
          baseExperienceYield: migrated.baseExperienceYield,
          baseFriendship: migrated.baseFriendship,
          eggGroups: migrated.eggGroups || [],
          eggCycles: migrated.eggCycles,
          abilities: migrated.abilities || [],
          baseScale: migrated.baseScale,
          shoulderMountable: migrated.shoulderMountable,
          hitbox: migrated.hitbox,
          behaviour: migrated.behaviour,
          drops: migrated.drops,
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
        form.projectVersion = project.version || '0.3.0';
        form.namespace = project.namespace || form.namespace;
        form.packName = (project.meta && project.meta.packName) || form.packName;
        form.packDescription = (project.meta && project.meta.description) || form.packDescription;
        form.packFormat = (project.meta && typeof project.meta.packFormat === 'number') ? project.meta.packFormat : form.packFormat;

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
          form.baseExperienceYield = typeof s.baseExperienceYield === 'number' ? s.baseExperienceYield : form.baseExperienceYield;
          form.baseFriendship = typeof s.baseFriendship === 'number' ? s.baseFriendship : form.baseFriendship;
          form.eggGroups = Array.isArray(s.eggGroups) ? s.eggGroups : [];
          form.eggCycles = typeof s.eggCycles === 'number' ? s.eggCycles : form.eggCycles;
          form.abilitiesText = Array.isArray(s.abilities) ? s.abilities.join(', ') : form.abilitiesText;
          form.baseScale = typeof s.baseScale === 'number' ? s.baseScale : form.baseScale;
          form.shoulderMountable = !!s.shoulderMountable;
          form.hitbox = s.hitbox ? { width: s.hitbox.width ?? form.hitbox.width, height: s.hitbox.height ?? form.hitbox.height, fixed: !!s.hitbox.fixed } : form.hitbox;
          // 读取行为与掉落
          const beh = s.behaviour || {};
          form.behaviour.walkSpeed = beh?.moving?.walk?.walkSpeed ?? '';
          form.behaviour.canLook = !!(beh?.moving?.canLook);
          form.behaviour.canSwim = !!(beh?.moving?.swim?.canSwim);
          form.behaviour.swimSpeed = beh?.moving?.swim?.swimSpeed ?? '';
          form.behaviour.canSwimInWater = !!(beh?.moving?.swim?.canSwimInWater);
          form.behaviour.canBreatheUnderwater = !!(beh?.moving?.swim?.canBreatheUnderwater);
          form.behaviour.canFly = !!(beh?.moving?.fly?.canFly);
          form.behaviour.flySpeed = beh?.moving?.fly?.flySpeed ?? '';
          form.behaviour.canSleep = !!(beh?.resting?.canSleep);
          form.behaviour.willSleepOnBed = !!(beh?.resting?.willSleepOnBed);
          form.behaviour.sleepLight = typeof beh?.resting?.light === 'string' ? beh.resting.light : '';
          const drops = s.drops || {};
          form.dropsMaxAmount = typeof drops.amount === 'number' ? drops.amount : 0;
          form.dropsText = Array.isArray(drops.entries)
            ? drops.entries
                .map(e => {
                  const pct = typeof e.percentage === 'number' ? e.percentage : '';
                  const qty = e.quantityRange ? `@${e.quantityRange}` : '';
                  return `${e.item}:${pct}${qty}`;
                })
                .join(';')
            : form.dropsText;
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

      // 写入 pack.mcmeta（支持 v0.3.1 自定义 pack_format）
      await writeJsonFile(packRoot, 'pack.mcmeta', buildPackMcmeta(form.packDescription, form.packFormat));

      // assets/cobblemon/lang：根据中英四项分别生成文件
      const langDir = await getDir(packRoot, ['assets','cobblemon','lang']);
      if (form.zhName || form.zhDesc) {
        await writeJsonFile(langDir, 'zh_cn.json', buildLangJsonForLocale('zh_cn', form.speciesId, form.zhName, form.zhDesc));
      }
      if (form.enName || form.enDesc) {
        await writeJsonFile(langDir, 'en_us.json', buildLangJsonForLocale('en_us', form.speciesId, form.enName, form.enDesc));
      }

      // data/cobblemon/species（将自定义物种直接放在 species 根目录，确保注册）
      const speciesDir = await getDir(packRoot, ['data','cobblemon','species']);
      await writeJsonFile(speciesDir, `${form.speciesId}.json`, buildSpeciesJson(form));

      // data/cobblemon/spawn_pool_world（可选，帮助快速生成出现）
      const spawnDir = await getDir(packRoot, ['data','cobblemon','spawn_pool_world']);
      await writeJsonFile(spawnDir, `${form.speciesId}.json`, buildSpawnJson(form.speciesId));

      ElementPlus.ElMessage.success(`导出成功！已生成子文件夹 "${packFolderName}"，请按说明放入 resourcepacks 与 datapacks 测试`);
    }

    // 预览 JSON 文本（只读字符串）
    const previewSpeciesJson = computed(() => JSON.stringify(buildSpeciesJson(form), null, 2));
    const previewPackMetaJson = computed(() => JSON.stringify(buildPackMcmeta(form.packDescription, form.packFormat), null, 2));

    /**
     * 复制文本到剪贴板
     * @function copyToClipboard
     * @param {string} text - 需要复制的文本
     * @returns {Promise<void>}
     */
    async function copyToClipboard(text) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        ElementPlus.ElMessage.success('已复制到剪贴板');
      } catch (e) {
        console.error(e);
        ElementPlus.ElMessage.error('复制失败');
      }
    }

    return { form, typeOptions, experienceGroupOptions, eggGroupOptions, useExample, exportPack, importTemplateFromFile, saveProject, loadProject, previewSpeciesJson, previewPackMetaJson, copyToClipboard };
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