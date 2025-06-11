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
