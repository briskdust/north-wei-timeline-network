import type { Person, TimelineEvent, Relationship } from "../types/index";

// 北魏末年历史人物时间线事件
const timelineEvents: TimelineEvent[] = [
  // 元恪（北魏宣武帝）
  {
    id: "1",
    personId: "yuanke",
    year: 483,
    title: "元恪出生",
    description: "拓跋恪（元恪）出生，北魏孝文帝第二子",
    type: "birth",
    location: "平城（今山西大同）",
  },
  {
    id: "2",
    personId: "yuanke",
    year: 499,
    title: "即位为帝",
    description: "孝文帝驾崩，元恪即位，是为宣武帝",
    type: "political",
    location: "洛阳",
  },
  {
    id: "3",
    personId: "yuanke",
    year: 504,
    title: "册封胡充华",
    description: "册封胡充华为贵嫔，深得宠爱",
    type: "personal",
    location: "洛阳宫",
  },
  {
    id: "4",
    personId: "yuanke",
    year: 515,
    title: "宣武帝驾崩",
    description: "元恪驾崩，享年33岁，在位16年",
    type: "death",
    location: "洛阳",
  },

  // 胡充华（胡太后）
  {
    id: "5",
    personId: "huchonghua",
    year: 488,
    title: "胡充华出生",
    description: "胡充华出生于安定临泾，司徒胡国珍之女",
    type: "birth",
    location: "安定临泾（今甘肃镇原）",
  },
  {
    id: "6",
    personId: "huchonghua",
    year: 504,
    title: "入宫受宠",
    description: "被宣武帝册封为贵嫔，深受宠爱",
    type: "personal",
    location: "洛阳宫",
  },
  {
    id: "7",
    personId: "huchonghua",
    year: 510,
    title: "生子元诩",
    description: "为宣武帝生下皇子元诩（后来的孝明帝）",
    type: "personal",
    location: "洛阳宫",
  },
  {
    id: "8",
    personId: "huchonghua",
    year: 515,
    title: "儿子即位",
    description: "宣武帝驾崩，6岁的元诩即位，胡充华成为皇太后",
    type: "political",
    location: "洛阳",
  },
  {
    id: "9",
    personId: "huchonghua",
    year: 515,
    title: "临朝听政",
    description: "以皇太后身份临朝听政，掌握朝政大权",
    type: "political",
    location: "洛阳",
  },
  {
    id: "10",
    personId: "huchonghua",
    year: 528,
    title: "毒杀孝明帝",
    description: "因政见不合，毒杀亲生儿子孝明帝元诩",
    type: "political",
    location: "洛阳宫",
  },
  {
    id: "11",
    personId: "huchonghua",
    year: 528,
    title: "被尔朱荣沉河",
    description: "尔朱荣攻入洛阳，将胡太后沉入黄河",
    type: "death",
    location: "黄河",
  },

  // 元诩（北魏孝明帝）
  {
    id: "12",
    personId: "yuanxu",
    year: 510,
    title: "元诩出生",
    description: "宣武帝元恪与胡充华之子，生于洛阳宫",
    type: "birth",
    location: "洛阳宫",
  },
  {
    id: "13",
    personId: "yuanxu",
    year: 515,
    title: "6岁即位",
    description: "父亲宣武帝驾崩，6岁的元诩即位为孝明帝",
    type: "political",
    location: "洛阳",
  },
  {
    id: "14",
    personId: "yuanxu",
    year: 520,
    title: "开始亲政",
    description: "年幼时由母亲胡太后摄政，渐长后与母后政见分歧",
    type: "political",
    location: "洛阳",
  },
  {
    id: "15",
    personId: "yuanxu",
    year: 528,
    title: "密诏尔朱荣",
    description: "因与母后政争激化，密诏尔朱荣前来洛阳",
    type: "political",
    location: "洛阳",
  },
  {
    id: "16",
    personId: "yuanxu",
    year: 528,
    title: "被母后毒杀",
    description: "胡太后发现密诏，毒杀孝明帝，享年19岁",
    type: "death",
    location: "洛阳宫",
  },

  // 尔朱荣
  {
    id: "17",
    personId: "erzhurong",
    year: 493,
    title: "尔朱荣出生",
    description: "尔朱荣出生于秀容（今山西忻州），尔朱新兴之子",
    type: "birth",
    location: "秀容（今山西忻州）",
  },
  {
    id: "18",
    personId: "erzhurong",
    year: 515,
    title: "继承家业",
    description: "父亲去世，继承家业，成为并州军阀",
    type: "political",
    location: "并州",
  },
  {
    id: "19",
    personId: "erzhurong",
    year: 525,
    title: "平定叛乱",
    description: "率军平定六镇起义，声威大震",
    type: "military",
    location: "六镇地区",
  },
  {
    id: "20",
    personId: "erzhurong",
    year: 528,
    title: "河阴之变",
    description:
      "奉孝明帝密诏进军洛阳，发动河阴之变，诛杀胡太后及王公大臣两千余人",
    type: "political",
    location: "洛阳河阴",
  },
  {
    id: "21",
    personId: "erzhurong",
    year: 528,
    title: "拥立孝庄帝",
    description: "拥立元子攸为孝庄帝，自己掌握实权",
    type: "political",
    location: "洛阳",
  },
  {
    id: "22",
    personId: "erzhurong",
    year: 530,
    title: "被孝庄帝诛杀",
    description: "入宫朝见时被孝庄帝设伏诛杀，享年38岁",
    type: "death",
    location: "洛阳宫",
  },

  // 元子攸（北魏孝庄帝）
  {
    id: "23",
    personId: "yuanziyou",
    year: 507,
    title: "元子攸出生",
    description: "彭城王元勰之子，北魏宗室",
    type: "birth",
    location: "洛阳",
  },
  {
    id: "24",
    personId: "yuanziyou",
    year: 528,
    title: "被拥立为帝",
    description: "河阴之变后，被尔朱荣拥立为孝庄帝",
    type: "political",
    location: "洛阳",
  },
  {
    id: "25",
    personId: "yuanziyou",
    year: 530,
    title: "诛杀尔朱荣",
    description: "设伏诛杀权臣尔朱荣，夺回皇权",
    type: "political",
    location: "洛阳宫",
  },
  {
    id: "26",
    personId: "yuanziyou",
    year: 531,
    title: "被尔朱兆攻杀",
    description: "尔朱荣之侄尔朱兆攻入洛阳，孝庄帝被杀，享年25岁",
    type: "death",
    location: "洛阳",
  },

  // 高欢
  {
    id: "27",
    personId: "gaohuan",
    year: 496,
    title: "高欢出生",
    description: "高欢出生于怀朔镇（今内蒙古固阳），汉族",
    type: "birth",
    location: "怀朔镇（今内蒙古固阳）",
  },
  {
    id: "28",
    personId: "gaohuan",
    year: 524,
    title: "参与六镇起义",
    description: "六镇起义爆发，高欢参与其中",
    type: "military",
    location: "六镇地区",
  },
  {
    id: "29",
    personId: "gaohuan",
    year: 532,
    title: "击败尔朱兆",
    description: "在韩陵山之战中击败尔朱兆，控制河北",
    type: "military",
    location: "韩陵山",
  },
  {
    id: "30",
    personId: "gaohuan",
    year: 534,
    title: "拥立孝静帝",
    description: "拥立元善见为孝静帝，迁都邺城，建立东魏",
    type: "political",
    location: "邺城",
  },
  {
    id: "31",
    personId: "gaohuan",
    year: 537,
    title: "沙苑之战",
    description: "与宇文泰在沙苑决战，败北",
    type: "military",
    location: "沙苑（今陕西大荔）",
  },
  {
    id: "32",
    personId: "gaohuan",
    year: 547,
    title: "高欢去世",
    description: "高欢病逝于晋阳，享年52岁",
    type: "death",
    location: "晋阳（今山西太原）",
  },

  // 宇文泰
  {
    id: "33",
    personId: "yuwentai",
    year: 507,
    title: "宇文泰出生",
    description: "宇文泰出生于武川镇（今内蒙古武川），鲜卑族",
    type: "birth",
    location: "武川镇（今内蒙古武川）",
  },
  {
    id: "34",
    personId: "yuwentai",
    year: 524,
    title: "随军征战",
    description: "六镇起义后，投靠贺拔岳，开始军旅生涯",
    type: "military",
    location: "关陇地区",
  },
  {
    id: "35",
    personId: "yuwentai",
    year: 535,
    title: "拥立文帝",
    description: "拥立元宝炬为文帝，建立西魏政权",
    type: "political",
    location: "长安",
  },
  {
    id: "36",
    personId: "yuwentai",
    year: 537,
    title: "沙苑大胜",
    description: "在沙苑之战中以少胜多，击败高欢大军",
    type: "military",
    location: "沙苑（今陕西大荔）",
  },
  {
    id: "37",
    personId: "yuwentai",
    year: 556,
    title: "宇文泰去世",
    description: "宇文泰病逝于长安，享年50岁",
    type: "death",
    location: "长安",
  },

  // 元修（北魏孝武帝）
  {
    id: "38",
    personId: "yuanxiu",
    year: 510,
    title: "元修出生",
    description: "广平王元怀之子，北魏宗室",
    type: "birth",
    location: "洛阳",
  },
  {
    id: "39",
    personId: "yuanxiu",
    year: 532,
    title: "被拥立为帝",
    description: "高欢拥立元修为孝武帝",
    type: "political",
    location: "洛阳",
  },
  {
    id: "40",
    personId: "yuanxiu",
    year: 534,
    title: "西逃长安",
    description: "因与高欢政见不合，西逃长安投靠宇文泰",
    type: "political",
    location: "长安",
  },
  {
    id: "41",
    personId: "yuanxiu",
    year: 535,
    title: "被宇文泰毒杀",
    description: "因与宇文泰产生矛盾，被宇文泰毒杀，享年25岁",
    type: "death",
    location: "长安",
  },
];

// 北魏末年历史人物数据
const people: Person[] = [
  {
    id: "yuanke",
    name: "元恪",
    alias: ["宣武帝", "拓跋恪"],
    birthYear: 483,
    deathYear: 515,
    dynasty: "北魏",
    occupation: "皇帝",
    location: "洛阳",
    description:
      "北魏第八位皇帝，孝文帝次子。在位期间继续推行汉化政策，但也开始出现政治腐败的苗头。",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
  },
  {
    id: "huchonghua",
    name: "胡充华",
    alias: ["胡太后", "灵太后"],
    birthYear: 488,
    deathYear: 528,
    dynasty: "北魏",
    occupation: "皇太后",
    location: "洛阳",
    description:
      "北魏宣武帝贵嫔，孝明帝生母。宣武帝死后临朝听政，专权跋扈，最终酿成河阴之变。",
    image: "https://images.unsplash.com/photo-1594736797933-d0d30d2c3b88?w=400",
  },
  {
    id: "yuanxu",
    name: "元诩",
    alias: ["孝明帝"],
    birthYear: 510,
    deathYear: 528,
    dynasty: "北魏",
    occupation: "皇帝",
    location: "洛阳",
    description:
      "北魏第九位皇帝，宣武帝之子。6岁即位，长期受母后胡太后摄政，最终因政见不合被母后毒杀。",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    id: "erzhurong",
    name: "尔朱荣",
    alias: ["天柱大将军"],
    birthYear: 493,
    deathYear: 530,
    dynasty: "北魏",
    occupation: "军阀",
    location: "秀容",
    description:
      "北魏末年权臣，并州军阀。发动河阴之变，屠杀王公大臣，拥立孝庄帝，掌握朝政大权。",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400",
  },
  {
    id: "yuanziyou",
    name: "元子攸",
    alias: ["孝庄帝"],
    birthYear: 507,
    deathYear: 531,
    dynasty: "北魏",
    occupation: "皇帝",
    location: "洛阳",
    description:
      "北魏第十一位皇帝，彭城王元勰之子。被尔朱荣拥立，后设计诛杀尔朱荣，最终被尔朱兆攻杀。",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    id: "gaohuan",
    name: "高欢",
    alias: ["东魏丞相", "神武帝"],
    birthYear: 496,
    deathYear: 547,
    dynasty: "东魏",
    occupation: "权臣",
    location: "晋阳",
    description:
      "东魏权臣，北齐王朝奠基者。出身六镇，通过军功崛起，建立东魏政权，与宇文泰分庭抗礼。",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: "yuwentai",
    name: "宇文泰",
    alias: ["西魏丞相", "文帝"],
    birthYear: 507,
    deathYear: 556,
    dynasty: "西魏",
    occupation: "权臣",
    location: "长安",
    description:
      "西魏权臣，北周王朝奠基者。出身武川镇，建立西魏政权，创建府兵制，奠定隋唐制度基础。",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400",
  },
  {
    id: "yuanxiu",
    name: "元修",
    alias: ["孝武帝", "出帝"],
    birthYear: 510,
    deathYear: 535,
    dynasty: "北魏",
    occupation: "皇帝",
    location: "洛阳",
    description:
      "北魏最后一位皇帝，广平王元怀之子。因与高欢不合西逃长安，后被宇文泰毒杀，北魏灭亡。",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  },
];

// 人物关系数据
const relationships: Relationship[] = [
  // 元恪的关系
  {
    id: "1",
    person1Id: "yuanke",
    person2Id: "huchonghua",
    type: "spouse",
    description: "宣武帝元恪与贵嫔胡充华",
    startYear: 504,
    endYear: 515,
  },
  {
    id: "2",
    person1Id: "yuanke",
    person2Id: "yuanxu",
    type: "parent",
    description: "宣武帝元恪是孝明帝元诩的父亲",
    startYear: 510,
    endYear: 515,
  },

  // 胡充华的关系
  {
    id: "3",
    person1Id: "huchonghua",
    person2Id: "yuanxu",
    type: "parent",
    description: "胡充华是孝明帝元诩的母亲",
    startYear: 510,
    endYear: 528,
  },
  {
    id: "4",
    person1Id: "huchonghua",
    person2Id: "erzhurong",
    type: "enemy",
    description: "胡太后与尔朱荣政治对立",
    startYear: 515,
    endYear: 528,
  },

  // 元诩的关系
  {
    id: "5",
    person1Id: "yuanxu",
    person2Id: "erzhurong",
    type: "ally",
    description: "孝明帝密诏尔朱荣对抗母后",
    startYear: 528,
    endYear: 528,
  },

  // 尔朱荣的关系
  {
    id: "6",
    person1Id: "erzhurong",
    person2Id: "yuanziyou",
    type: "political",
    description: "尔朱荣拥立孝庄帝元子攸",
    startYear: 528,
    endYear: 530,
  },
  {
    id: "7",
    person1Id: "erzhurong",
    person2Id: "gaohuan",
    type: "ally",
    description: "尔朱荣曾与高欢同为六镇将领",
    startYear: 525,
    endYear: 528,
  },

  // 元子攸的关系
  {
    id: "8",
    person1Id: "yuanziyou",
    person2Id: "gaohuan",
    type: "political",
    description: "孝庄帝死后，高欢崛起",
    startYear: 531,
    endYear: 531,
  },

  // 高欢的关系
  {
    id: "9",
    person1Id: "gaohuan",
    person2Id: "yuanxiu",
    type: "political",
    description: "高欢拥立孝武帝元修",
    startYear: 532,
    endYear: 534,
  },
  {
    id: "10",
    person1Id: "gaohuan",
    person2Id: "yuwentai",
    type: "enemy",
    description: "高欢与宇文泰东西对峙",
    startYear: 534,
    endYear: 547,
  },

  // 宇文泰的关系
  {
    id: "11",
    person1Id: "yuwentai",
    person2Id: "yuanxiu",
    type: "political",
    description: "宇文泰接纳西逃的孝武帝",
    startYear: 534,
    endYear: 535,
  },

  // 其他重要关系
  {
    id: "12",
    person1Id: "yuanke",
    person2Id: "yuanziyou",
    type: "family",
    description: "宗室关系，都是北魏皇室成员",
    startYear: 507,
    endYear: 515,
  },
  {
    id: "13",
    person1Id: "yuanxu",
    person2Id: "yuanxiu",
    type: "family",
    description: "宗室关系，都是北魏皇室成员",
    startYear: 510,
    endYear: 528,
  },
];

export { people, timelineEvents, relationships };

// 搜索函数
export const searchPersons = (query: string): Person[] => {
  if (!query.trim()) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  return people.filter(
    person =>
      person.name.toLowerCase().includes(searchTerm) ||
      person.alias?.some(alias => alias.toLowerCase().includes(searchTerm)) ||
      person.dynasty.toLowerCase().includes(searchTerm) ||
      person.occupation.toLowerCase().includes(searchTerm) ||
      person.description.toLowerCase().includes(searchTerm)
  );
};

// 根据ID获取人物
export const getPersonById = (id: string): Person | undefined => {
  return people.find(person => person.id === id);
};

// 获取人物的时间线事件
export const getPersonTimeline = (personId: string): TimelineEvent[] => {
  return timelineEvents.filter(event => event.personId === personId);
};

// 获取人物的关系
export const getPersonRelationships = (personId: string): Relationship[] => {
  return relationships.filter(
    rel => rel.person1Id === personId || rel.person2Id === personId
  );
};
