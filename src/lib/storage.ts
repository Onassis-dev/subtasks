import Dexie, { type EntityTable } from "dexie";

export interface Task {
  id: string;
  parentId?: string;
  title: string;
  done: 0 | 1;
  order: number;
  description?: string;
  pending: 0 | 1;
}

export interface Project {
  id: string;
  name: string;
}

export const db = new Dexie("subtasks-db") as Dexie & {
  tasks: EntityTable<Task>;
};

db.version(1).stores({
  projects: "id,name",
  tasks: "id,parentId,projectId,title,done,order,description,pending",
});
