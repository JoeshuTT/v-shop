/**
 * app
 */
export const app = {
  name: 'v-shop',
};

/**
 * theme
 */
export const theme = {
  assetsUrl: '',
  brandColor: '#1ba784',
  viceColor: '#d9f6ef',
  viceTextColor: '#1ba784',
  colors: {
    brandColor: '#1ba784',
    viceColor: '#d9f6ef',
    viceTextColor: '#1ba784',
    black: '#000',
    white: '#fff',
  },
};

/**
 * tabBar
 */
export const tabBar = {
  color: '#c0c0c0',
  selectedColor: '#1ba784',
  list: [
    {
      text: '首页',
      pagePath: '/home',
      icon: 'home-o',
    },
    {
      text: '分类',
      pagePath: '/category',
      icon: 'apps-o',
    },
    {
      text: '购物车',
      pagePath: '/cart',
      icon: 'shopping-cart-o',
    },
    {
      text: '个人中心',
      pagePath: '/mine',
      icon: 'contact',
    },
  ],
};

/**
 * 登录
 */
export const loginProviderType = {
  register: { value: 'register', label: '注册', h2: '免费注册', apiName: 'userMRegister' },
  system: { value: 'system', label: '密码', h2: '帐号密码登录', apiName: 'userMLogin' },
  sms: { value: 'sms', label: '验证码', h2: '验证码登录', apiName: 'userMLoginMobile' },
};

/**
 * 短信验证码相关
 */
export const sms = {
  count: 60 * 1,
};

/**
 * 资源地址
 */
export const assets = {
  avatar: require('@/assets/images/avatar_default.png'),
};

/**
 * 调色板
 */
export const palettes = [
  {
    value: '#ff5179',
    label: '粉色系列',
    colors: {
      brandColor: '#ff5179',
      viceColor: '#ffe6e8',
      viceTextColor: '#ff5179',
    },
  },
  {
    value: '#ffaa00',
    label: '黄色系列',
    colors: {
      brandColor: '#ffaa00',
      viceColor: '#1d262e',
      viceTextColor: '#fff',
    },
  },
  {
    value: '#c3a769',
    label: '棕色系列',
    colors: {
      brandColor: '#c3a769',
      viceColor: '#ebecf2',
      viceTextColor: '#c3a769',
    },
  },
  {
    value: '#2f2f34',
    label: '黑色系列',
    colors: {
      brandColor: '#2f2f34',
      viceColor: '#ebecf2',
      viceTextColor: '#2f2f34',
    },
  },
  {
    value: '#0080ff',
    label: '蓝色系列',
    colors: {
      brandColor: '#0080ff',
      viceColor: '#d6e9fc',
      viceTextColor: '#0080ff',
    },
  },
  {
    value: '#884cff',
    label: '紫色系列',
    colors: {
      brandColor: '#884cff',
      viceColor: '#efe6ff',
      viceTextColor: '#884cff',
    },
  },
  {
    value: '#ee0a24',
    label: '红色系列（Vant 默认主色）',
    colors: {
      brandColor: '#ee0a24',
      viceColor: '#ffd01e',
      viceTextColor: '#fff',
    },
  },
  {
    value: '#1ba784',
    label: '绿色系列（v-shop 默认色系列）',
    link: 'http://zhongguose.com/', // 取自中国色 竹绿
    colors: {
      brandColor: '#1ba784',
      viceColor: '#d9f6ef',
      viceTextColor: '#1ba784',
    },
  },
];

/**
 * 随机昵称
 */
export const nickList = [
  '影哨',
  '灵罗娃娃',
  '愁云使者',
  '破败之王',
  '镕铁少女',
  '星籁歌姬',
  '沙漠玫瑰',
  '封魔剑魂',
  '含羞蓓蕾',
  '腕豪',
  '残月之肃',
  '涤魂圣枪',
  '元素女皇',
  '魔法猫咪',
  '炼金术士',
  '亡灵战神',
  '德邦总管',
  '众星之子',
  '荆棘之兴',
  '虚空之女',
  '暗夜猎手',
  '发条魔灵',
  '复仇焰魂',
  '虚空行者',
  '影流之主',
  '翠神',
  '恶魔小丑',
  '放逐之刃',
  '复仇之矛',
  '深渊巨口',
  '万花通灵',
  '生化魔人',
  '瓦洛兰之盾',
  '诡术妖姬',
  '战争之影',
  '青钢影',
  '无双剑姬',
  '刀锋意志',
  '黑暗之女',
  '冰晶凤凰',
  '殇之木乃伊',
  '牛头酋长',
  '唤潮鲛姬',
  '星界游神',
  '狂野女猎手',
  '法外狂徒',
  '扭曲树精',
  '圣锤之毅',
  '皮城女警',
  '赏金猎人',
  '海兽祭司',
  '暗裔剑魔',
  '沙漠皇帝',
  '诺克萨斯之手',
  '解脱者',
  '时间刺客',
  '暮光星灵',
  '河流之王',
  '蛮族之王',
  '暗黑元首',
  '德玛西亚之翼',
  '披甲龙龟',
  '雪人骑士',
  '永恒梦魇',
  '堕落天使',
  '圣枪游侠',
  '齐天大圣',
  '离群之刺',
  '荣耀行刑官',
  '蒸汽机器人',
  '正义巨像',
  '无极剑圣',
  '虚空掠夺者',
  '凛冬之怒',
  '深海泰坦',
  '惩戒之箭',
  '戏命师',
  '荒漠屠夫',
  '巨魔之王',
  '战争之王',
  '审判天使',
  '冰霜女巫',
  '九尾妖狐',
  '虚空之眼',
  '爆破鬼才',
  '祖安怒兽',
  '血港鬼影',
  '战争女神',
  '麦林炮手',
  '光辉女郎',
  '不祥之刃',
  '熔岩巨兽',
  '机械公敌',
  '魂锁典狱长',
  '武器大师',
  '虚空恐惧',
  '弗雷尔卓德之心',
  '琴瑟仙女',
  '潮汐海灵',
  '皎月女神',
  '祖安狂人',
  '英勇投弹手',
  '探险家',
  '龙血武姬',
  '盲僧',
  '兽灵行者',
  '魔蛇之拥',
  '死亡颂唱者',
  '虚空先知',
  '仙灵女巫',
  '幻翎',
  '寡妇制造者',
  '暮光之眼',
  '不灭狂雷',
  '逆羽',
  '瘟疫之源',
  '牧魂人',
  '山隐之焰',
  '迷失之牙',
  '猩红收割者',
  '狂暴之心',
  '曙光女神',
  '影流之镰',
  '远古恐惧',
  '沙漠死神',
  '暴走萝莉',
  '暴怒骑士',
  '未来守护者',
  '岩雀',
  '海洋之灾',
  '皮城执法官',
  '时光守护者',
  '策士统领',
  '刀锋之影',
  '酒桶',
  '无畏战车',
  '机械先驱',
  '远古巫灵',
  '傲之追猎者',
  '虚空遁地兽',
  '风暴之怒',
  '天启者',
  '卡牌大师',
  '蜘蛛女皇',
  '邪恶小法师',
  '铁铠冥魂',
  '水晶先锋',
  '德玛西亚皇子',
  '铸星龙王',
  '大发明家',
  '永猎双子',
  '狂战士',
  '寒冰射手',
  '疾风剑豪',
  '德玛西亚之力',
  '符文法师',
  '迅捷斥候',
];
