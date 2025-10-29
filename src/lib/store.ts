import { create } from "zustand";
import { db, Task } from "./storage";
import { toast } from "sonner";
const uuid = () => crypto.randomUUID();

type ProjectTasks = {
  tasks: Task[];
  changeProject: (projectId: string) => Promise<void>;
  addTask: (
    task: Pick<Task, "title" | "parentId" | "description">
  ) => Promise<string>;
  updateTask: (
    task: Pick<Task, "id" | "title" | "description">
  ) => Promise<string>;
  completeTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  reorderTasks: (params: ReorderTasksParams) => Promise<void>;
  checkIfChildrensCompleted: (taskId: string) => boolean;
};

type ReorderTasksParams = {
  taskId: string;
  parentId: string;
  selectedId: string;
};

export const useProjectTasks = create<ProjectTasks>((set, get) => ({
  tasks: [],

  changeProject: async (projectId: string) => {
    const allTasks = await db.tasks.where("done").equals(0).sortBy("order");

    const taskMap = new Map(allTasks.map((t) => [t.id, t]));

    const belongsToProject = (task: Task): boolean => {
      let current = task;
      while (current.parentId && current.parentId !== "-") {
        const parent = taskMap.get(current.parentId);
        if (!parent) return false;
        if (parent.id === projectId) return true;
        current = parent;
      }
      return false;
    };

    const projectTasks = allTasks.filter(
      (t) => t.id === projectId || belongsToProject(t)
    );

    set({ tasks: projectTasks });
  },

  addTask: async (task: Pick<Task, "title" | "parentId" | "description">) => {
    const id = uuid();
    const siblings = get().tasks.filter((t) => t.parentId === task.parentId);
    const maxOrder = Math.max(...siblings.map((sibling) => sibling.order), 0);

    const newTask = { ...task, id, done: 0 as const, order: maxOrder + 1 };

    set(({ tasks }) => ({ tasks: [...tasks, newTask] }));
    setTimeout(() => db.tasks.add(newTask), 0);
    return id;
  },

  updateTask: async (task: Pick<Task, "id" | "title" | "description">) => {
    set(({ tasks }) => ({
      tasks: tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
    }));
    setTimeout(() => db.tasks.where("id").equals(task.id).modify(task), 0);
    return task.id;
  },

  checkIfChildrensCompleted: (taskId: string) => {
    const { tasks } = get();
    const childs = tasks.filter((t) => t.parentId === taskId);

    for (const child of childs) {
      if (!child.done) return false;
    }
    return true;
  },

  completeTask: async (taskId: string) => {
    const { tasks } = get();
    const childs = tasks.filter((t) => t.parentId === taskId);
    const task = tasks.find((t) => t.id === taskId);

    if (task?.done) {
      toast.error("Task is already completed");
      return;
    }

    for (const child of childs) {
      if (!child.done) {
        toast.error("Cannot complete task because it has incomplete subtasks");
        return;
      }
    }

    set(({ tasks }) => ({
      tasks: tasks.map((t) => (t.id === taskId ? { ...t, done: 1 } : t)),
    }));
    setTimeout(
      () => db.tasks.where("id").equals(taskId).modify({ done: 1 }),
      0
    );
  },

  deleteTask: async (taskId: string) => {
    const { tasks } = get();
    const childrenIds: string[] = [taskId];

    function getChildren(taskId: string) {
      const childrens = tasks.filter((t) => t.parentId === taskId);
      for (const child of childrens) {
        childrenIds.push(child.id);
        getChildren(child.id);
      }
    }

    getChildren(taskId);

    set(({ tasks }) => ({
      tasks: tasks.filter((t) => !childrenIds.includes(t.id)),
    }));

    setTimeout(() => db.tasks.where("id").anyOf(childrenIds).delete(), 0);
  },

  reorderTasks: async ({
    taskId,
    parentId,
    selectedId,
  }: ReorderTasksParams) => {
    const { tasks } = get();
    if (parentId === taskId) return;

    const siblings = tasks
      .filter((t) => t.parentId === parentId)
      .sort((a, b) => a.order - b.order);

    if (selectedId === parentId) {
      const minOrder = Math.min(...siblings.map((sibling) => sibling.order), 0);

      set(({ tasks }) => ({
        tasks: tasks
          .map((t) =>
            t.id === taskId ? { ...t, parentId, order: minOrder - 1 } : t
          )
          .sort((a, b) => a.order - b.order),
      }));

      setTimeout(
        () =>
          db.tasks
            .where("id")
            .equals(taskId)
            .modify({ parentId, order: minOrder - 1 }),
        0
      );
    } else {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const currentIndex = siblings.findIndex(
        (sibling) => sibling.id === taskId
      );
      if (currentIndex !== -1) {
        siblings.splice(currentIndex, 1);
      }

      const selectedIndex = siblings.findIndex(
        (sibling) => sibling.id === selectedId
      );
      if (selectedIndex !== -1) {
        siblings.splice(selectedIndex + 1, 0, { ...task, parentId });
      } else {
        siblings.push({ ...task, parentId });
      }

      set(() => {
        const newTasks = [...tasks];

        siblings.forEach((sibling, index) => {
          const taskIndex = newTasks.findIndex((t) => t.id === sibling.id);
          if (taskIndex !== -1) {
            newTasks[taskIndex] = {
              ...newTasks[taskIndex],
              parentId,
              order: index,
            };
          }
        });

        newTasks.sort((a, b) => a.order - b.order);

        return { tasks: newTasks };
      });

      setTimeout(async () => {
        await db.transaction("rw", "tasks", async () => {
          await Promise.all(
            siblings.map((sibling, index) =>
              db.tasks
                .where("id")
                .equals(sibling.id)
                .modify({ parentId, order: index })
            )
          );
        });
      }, 0);
    }
  },
}));
