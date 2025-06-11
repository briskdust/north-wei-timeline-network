export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "birth" | "achievement" | "work" | "family" | "death" | "other";
}

export interface Person {
  id: string;
  name: string;
  title?: string;
  birth: string;
  death?: string;
  description: string;
  avatar?: string;
  timeline: TimelineEvent[];
  relationships: Relationship[];
}

export interface Relationship {
  id: string;
  targetPersonId: string;
  targetPersonName: string;
  relationship: string;
  description?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  title?: string;
  color?: string;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  color?: string;
}
