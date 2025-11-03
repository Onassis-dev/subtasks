"use client";

import { type Task } from "@/lib/storage";
import { useProjectTasks } from "@/lib/store";
import { CreateTask } from "./create-task";
import {
  CheckIcon,
  HeartFilledIcon,
  HeartIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { randomCelebration } from "@/lib/celebrations";

interface props {
  task: Task & { childrens?: Task[]; level?: number };
  setSelectedTask: (task: Task) => void;
  setOpenDelete: (open: boolean) => void;
  isOnLeft: boolean;
}

export function TaskCard({
  task,
  setSelectedTask,
  setOpenDelete,
  isOnLeft,
}: props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [done, setDone] = useState(Boolean(task.done));

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const { togglePending } = useProjectTasks();

  const {
    setNodeRef: setDropRef,
    isOver,
    active,
  } = useDroppable({
    id: task.id,
    data: {
      parent: !!task.childrens?.length,
      id: task.id,
      parentId: task.parentId,
    },
  });

  return (
    <>
      {!editing && (
        <motion.div
          ref={setDropRef}
          style={{
            marginLeft: `${task.level! * 2}rem`,
            opacity: isDragging ? "0.5" : undefined,
            height: isDragging ? 0 : undefined,
            marginBottom: isDragging ? 0 : "0.75rem",
          }}
          animate={{
            height: done ? 0 : undefined,
            marginBottom: done ? 0 : undefined,
            opacity: done ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
        >
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
              transform: transform
                ? `translate(${transform.x}px, ${transform.y}px)`
                : undefined,
            }}
            className={
              "overflow-hidden grid mb-3 w-full grid-cols-[auto_1fr_auto] gap-2 items-centers border px-2 py-1.5 rounded-lg group/task bg-background" +
              (task.pending ? " bg-primary/10" : "")
            }
          >
            <TaskCheckbox
              task={task}
              level={task.level!}
              done={done}
              setDone={setDone}
            />
            <div className="flex flex-col">
              <span className="text-sm">{task.title}</span>
              {task?.description && (
                <span className="text-xs text-muted-foreground">
                  {task.description}
                </span>
              )}
            </div>
            <div className="group-hover/task:opacity-100 opacity-0 my-auto flex items-center gap-1">
              <Button
                variant="ghost"
                className="size-5 p-0 rounded-sm"
                onClick={() => {
                  togglePending(task.id);
                }}
              >
                {task.pending ? <HeartFilledIcon /> : <HeartIcon />}
              </Button>
              <Button
                variant="ghost"
                className="size-5 p-0 rounded-sm"
                onClick={() => {
                  setSelectedTask(task);
                  setOpenDelete(true);
                }}
              >
                <TrashIcon />
              </Button>
              <Button
                variant="ghost"
                className="size-5 p-0 rounded-sm"
                onClick={() => {
                  setOpen(true);
                  setEditing(true);
                }}
              >
                <Pencil1Icon />
              </Button>
              <Button
                variant="ghost"
                className="size-5 p-0 rounded-sm"
                onClick={() => setOpen(true)}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {isOver && (
        <div
          style={{
            height: active?.rect.current?.initial?.height ?? 0,
            marginLeft: `${(task.level! + (isOnLeft ? 0 : 1)) * 2}rem`,
          }}
          className={cn(
            "w-auto border rounded-lg border-primary mb-3",
            isOnLeft ? "ml-0" : "ml-8"
          )}
        />
      )}

      {!isDragging && (
        <>
          <CreateTask
            parentId={task.id}
            open={open}
            onOpenChange={setOpen}
            level={editing ? task.level! - 1 : task.level!}
            task={editing ? task : undefined}
            key={editing ? "0" : "1"}
            setEditing={setEditing}
          />

          {task.childrens?.map((child) =>
            child.done ? null : (
              <TaskCard
                isOnLeft={isOnLeft}
                key={child.id}
                task={child}
                setSelectedTask={setSelectedTask}
                setOpenDelete={setOpenDelete}
              />
            )
          )}
        </>
      )}
    </>
  );
}

function TaskCheckbox({
  task,
  level,
  setDone,
  done,
}: {
  task: Task;
  level: number;
  setDone: (done: boolean) => void;
  done: boolean;
}) {
  const { completeTask, checkIfChildrensCompleted } = useProjectTasks();

  const [error, setError] = useState(false);

  function handleComplete() {
    if (checkIfChildrensCompleted(task.id)) {
      setDone(true);
      const pop = new Audio("/sounds/pop1.mp3");
      pop.currentTime = 0;
      pop.play();
      if (level === 0) randomCelebration();
      setTimeout(() => {
        completeTask(task.id);
      }, 500);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 500);
    }
  }

  return (
    <motion.div
      onClick={handleComplete}
      initial={false}
      animate={{
        backgroundColor: done
          ? "var(--primary)"
          : error
            ? "var(--destructive)"
            : undefined,
        borderColor: done
          ? "var(--primary)"
          : error
            ? "var(--destructive)"
            : undefined,
      }}
      whileTap={{
        scale: 0.8,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="size-4 rounded-full border cursor-pointer flex items-center justify-center mt-0.5"
      tabIndex={0}
    >
      {done && <CheckIcon className="text-background" />}
    </motion.div>
  );
}
