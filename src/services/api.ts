import type { 
  Person, 
  TimelineEvent, 
  Relationship,
  DbPerson,
  DbTimelineEvent,
  DbRelationship,
  DbNetworkNode,
  DbStatistics,
  ApiHealthResponse
} from "../types/index";

const API_BASE_URL = "http://localhost:3000/api";

// API请求辅助函数
const apiRequest = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API请求错误:", error);
    throw error;
  }
};

// 数据库字段到前端类型的转换函数
const convertDbPersonToFrontend = (dbPerson: DbPerson): Person => ({
  id: dbPerson.id,
  name: dbPerson.name,
  alias: dbPerson.alias || [],
  birthYear: dbPerson.birth_year,
  deathYear: dbPerson.death_year,
  dynasty: dbPerson.dynasty,
  occupation: dbPerson.occupation,
  location: dbPerson.location,
  description: dbPerson.description,
  image: dbPerson.image,
});

const convertDbTimelineToFrontend = (dbEvent: DbTimelineEvent): TimelineEvent => ({
  id: dbEvent.id,
  personId: dbEvent.person_id,
  year: dbEvent.year,
  title: dbEvent.title,
  description: dbEvent.description,
  type: dbEvent.type,
  location: dbEvent.location,
});

const convertDbRelationshipToFrontend = (dbRel: DbRelationship): Relationship => ({
  id: dbRel.id,
  person1Id: dbRel.person1_id,
  person2Id: dbRel.person2_id,
  type: dbRel.type,
  description: dbRel.description,
  startYear: dbRel.start_year,
  endYear: dbRel.end_year,
});

// API服务函数

// 搜索人物
export const searchPersons = async (query: string): Promise<Person[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const data = await apiRequest<DbPerson[]>(
      `/people/search?q=${encodeURIComponent(query)}`
    );
    return data.map(convertDbPersonToFrontend);
  } catch (error) {
    console.error("搜索人物失败:", error);
    return [];
  }
};

// 获取所有人物
export const getAllPersons = async (): Promise<Person[]> => {
  try {
    const data = await apiRequest<DbPerson[]>("/people");
    return data.map(convertDbPersonToFrontend);
  } catch (error) {
    console.error("获取人物列表失败:", error);
    return [];
  }
};

// 根据ID获取人物
export const getPersonById = async (
  id: string
): Promise<Person | undefined> => {
  try {
    const data = await apiRequest<DbPerson>(`/people/${id}`);
    return convertDbPersonToFrontend(data);
  } catch (error) {
    console.error("获取人物信息失败:", error);
    return undefined;
  }
};

// 获取人物的时间线事件
export const getPersonTimeline = async (
  personId: string
): Promise<TimelineEvent[]> => {
  try {
    const data = await apiRequest<DbTimelineEvent[]>(`/people/${personId}/timeline`);
    return data.map(convertDbTimelineToFrontend);
  } catch (error) {
    console.error("获取时间线失败:", error);
    return [];
  }
};

// 获取人物的关系
export const getPersonRelationships = async (
  personId: string
): Promise<Relationship[]> => {
  try {
    const data = await apiRequest<DbRelationship[]>(`/people/${personId}/relationships`);
    return data.map(convertDbRelationshipToFrontend);
  } catch (error) {
    console.error("获取关系失败:", error);
    return [];
  }
};

// 获取人物关系网络（用于关系图）
export const getPersonNetwork = async (
  personId: string,
  depth: number = 2
): Promise<DbNetworkNode[]> => {
  try {
    const data = await apiRequest<DbNetworkNode[]>(
      `/people/${personId}/network?depth=${depth}`
    );
    return data;
  } catch (error) {
    console.error("获取关系网络失败:", error);
    return [];
  }
};

// 按朝代获取人物
export const getPeopleByDynasty = async (
  dynasty: string
): Promise<Person[]> => {
  try {
    const data = await apiRequest<DbPerson[]>(`/dynasties/${dynasty}/people`);
    return data.map(convertDbPersonToFrontend);
  } catch (error) {
    console.error("按朝代获取人物失败:", error);
    return [];
  }
};

// 获取统计信息
export const getStatistics = async (): Promise<DbStatistics> => {
  try {
    const data = await apiRequest<DbStatistics>("/stats");
    return data;
  } catch (error) {
    console.error("获取统计信息失败:", error);
    return {
      people: 0,
      events: 0,
      relationships: 0,
      dynasties: [],
    };
  }
};

// 健康检查
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const data = await apiRequest<ApiHealthResponse>("/health");
    return data.status === "ok";
  } catch (error) {
    console.error("API健康检查失败:", error);
    return false;
  }
};

// 兼容性导出
export const searchPeople = searchPersons;
