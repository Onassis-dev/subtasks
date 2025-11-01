"use client";

import { CreateTask } from "@/components/layout/create-task";
import { DeleteTaskDialog } from "@/components/layout/delete-task";
import { TaskCard } from "@/components/layout/task";
import { Button } from "@/components/ui/button";
import { db, Task } from "@/lib/storage";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { DndContext, useSensors } from "@dnd-kit/core";
import { MouseSensor, TouchSensor, useSensor } from "@dnd-kit/core";
import { useProjectTasks } from "@/lib/store";

function organizeTasksRecursively(
  tasks: Task[],
  parentId: string,
  level: number
): (Task & { childrens?: Task[]; level?: number })[] {
  const children = tasks.filter((t) => t.parentId === parentId);

  return children.map((task) => ({
    ...task,
    level,
    childrens: organizeTasksRecursively(tasks, task.id, level + 1),
  }));
}

function ProjectPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const project = useLiveQuery(async () => {
    if (!id) return null;

    const project = await db.tasks.where("id").equals(id).first();

    if (!project) {
      router.push("/dashboard");
      return null;
    }

    return project;
  }, [id]);

  const { tasks, changeProject, reorderTasks } = useProjectTasks();
  const taskTree = useMemo(() => {
    return organizeTasksRecursively(tasks, project?.id as string, 0);
  }, [tasks, project]);

  useEffect(() => {
    changeProject(project?.id as string);
  }, [project, changeProject]);

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isOnLeft, setIsOnLeft] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
      tolerance: 30,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 0,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  if (!project) return null;

  return (
    <div className="p-4 max-w-3xl w-full mx-auto pb-24">
      <h1 className="text-2xl font-bold mt-12 mb-8">{project.title}</h1>

      <DndContext
        onDragMove={(event) => {
          setIsOnLeft(
            !!event.over?.data.current?.parent
              ? false
              : (event.active.rect.current?.translated?.left ?? 0) -
                  (event.over?.rect?.left ?? 0) <
                  0
          );
        }}
        onDragEnd={(e) => {
          const { parentId, id: selectedId } = e.over?.data.current as Task;
          const taskId = e.active.id as string;

          reorderTasks({
            taskId,
            parentId: isOnLeft ? parentId! : selectedId!,
            selectedId,
          });
        }}
        sensors={sensors}
      >
        {taskTree?.map((task) =>
          task.done ? null : (
            <TaskCard
              isOnLeft={isOnLeft}
              key={task.id}
              task={task}
              setSelectedTask={setSelectedTask}
              setOpenDelete={setOpenDelete}
            />
          )
        )}
      </DndContext>

      <CreateTask
        parentId={id as string}
        level={-1}
        open={openForm}
        onOpenChange={setOpenForm}
      />

      {!openForm && (
        <Button variant="ghost" onClick={() => setOpenForm(true)}>
          <PlusIcon className="size-4" /> Add task
        </Button>
      )}

      <DeleteTaskDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        task={selectedTask!}
      />
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 max-w-3xl w-full mx-auto pb-24">Loading...</div>
      }
    >
      <ProjectPageContent />
    </Suspense>
  );
}
