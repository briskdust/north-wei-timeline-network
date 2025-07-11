// 时间线事件类型
export interface TimelineEvent {
  id: string;
  personId: string;
  year: number;
  title: string;
  description: string;
  type: "birth" | "death" | "political" | "personal" | "military" | "other";
  location?: string;
}

// 人物信息类型
export interface Person {
  id: string;
  name: string;
  alias?: string[];
  birthYear: number;
  deathYear?: number;
  dynasty: string;
  occupation: string;
  location: string;
  description: string;
  image?: string;
}

// 人物关系类型
export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  type:
    | "family"
    | "spouse"
    | "political"
    | "ally"
    | "enemy"
    | "teacher"
    | "friend"
    | "parent"
    | "other";
  description: string;
  startYear?: number;
  endYear?: number;
}

// 网络图节点类型
export interface NetworkNode {
  id: string;
  label: string;
  title?: string;
  color?: string;
  group?: string;
}

// 网络图边类型
export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  color?: string;
  arrows?: string;
}

// 数据库响应类型定义
export interface DbPerson {
  id: string;
  name: string;
  alias: string[];
  birth_year: number;
  death_year?: number;
  dynasty: string;
  occupation: string;
  location: string;
  description: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface DbTimelineEvent {
  id: string;
  person_id: string;
  year: number;
  title: string;
  description: string;
  type: "birth" | "death" | "political" | "personal" | "military" | "other";
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface DbRelationship {
  id: string;
  person1_id: string;
  person2_id: string;
  type: "family" | "spouse" | "political" | "ally" | "enemy" | "teacher" | "friend" | "parent" | "other";
  description: string;
  start_year?: number;
  end_year?: number;
  created_at: string;
  updated_at: string;
}

export interface DbNetworkNode {
  id: string;
  name: string;
  alias?: string[];
  relationship_type?: string;
  relationship_description?: string;
}

export interface DbStatistics {
  people: number;
  events: number;
  relationships: number;
  dynasties: DbDynastyStat[];
}

export interface DbDynastyStat {
  dynasty: string;
  person_count: number;
  avg_birth_year: number;
  earliest_birth: number;
  latest_death: number;
}

export interface ApiHealthResponse {
  status: "ok" | "error";
  database?: "connected" | "disconnected";
}
