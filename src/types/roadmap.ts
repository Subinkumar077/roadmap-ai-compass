
export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation' | 'project';
  platform?: string;
  duration?: string;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: Resource[];
  projects?: string[];
  prerequisites?: string[];
}

export interface RoadmapData {
  title: string;
  description: string;
  level: string;
  totalDuration: string;
  phases: Phase[];
  flowchartData?: {
    nodes: Array<{
      id: string;
      type: string;
      data: { label: string };
      position: { x: number; y: number };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
}
