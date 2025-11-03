import { db, Task } from "./storage";
const uuid = () => crypto.randomUUID();

export async function addProject(project: Pick<Task, "title">) {
  const id = uuid();
  const sibligs = await db.tasks.where("parentId").equals("-").toArray();
  const maxOrder = Math.max(...sibligs.map((sibling) => sibling.order), 0);
  await db.tasks.add({
    ...project,
    id,
    done: 0,
    parentId: "-",
    order: maxOrder + 1,
    pending: 0,
  });
  return id;
}

export async function updateProject(
  projectId: string,
  project: Pick<Task, "title">
) {
  await db.tasks
    .where("id")
    .equals(projectId)
    .modify({ ...project, id: projectId });
}

export async function deleteProject(projectId: string) {
  const childrenIds: string[] = [];
  async function getChildren(taskId: string) {
    const childrens = await db.tasks.where("parentId").equals(taskId).toArray();
    for (const child of childrens) {
      childrenIds.push(child.id);
      await getChildren(child.id);
    }
  }

  await getChildren(projectId);

  await db.tasks
    .where("id")
    .anyOf([...childrenIds, projectId])
    .delete();
}
