
export interface Todo {
  id: string;
  text: string;
  date: string;
  time: string;
  completed: boolean;
  createdAt: number;
  subtasks?: string[];
}

export type FilterType = 'all' | 'active' | 'completed';
