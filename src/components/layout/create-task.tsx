import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useProjectTasks } from "@/lib/store";
import { Task } from "@/lib/storage";

interface props {
  parentId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
  task?: Task;
  setEditing?: (editing: boolean) => void;
}
export function CreateTask({
  parentId,
  open,
  onOpenChange,
  level,
  task,
  setEditing,
}: props) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const { addTask, updateTask } = useProjectTasks();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (parentId && title.trim()) {
      if (task) {
        await updateTask({ id: task.id, title, description });
        onOpenChange(false);
        setEditing?.(false);
      } else {
        await addTask({ title, parentId, description });
        inputRef.current?.focus();
      }
      setTitle("");
      setDescription("");
    }
  }

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onOpenChange(false);
          setEditing?.(false);
        }
      }}
      className="border rounded-lg mb-3"
      style={{ marginLeft: `${(level! + 1) * 2}rem` }}
    >
      <input
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        ref={inputRef}
        placeholder="Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 pb-0 outline-0 text-sm"
      />
      <textarea
        onKeyDown={(e: any) => {
          if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        ref={descriptionRef}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full outline-0 resize-none p-2 pt-0 text-xs text-muted-foreground"
      />
      <div className="flex gap-2 p-2 justify-end border-t">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            setTitle("");
            setDescription("");
            onOpenChange(false);
            setEditing?.(false);
          }}
        >
          Cancel
        </Button>
        <Button size="sm" disabled={!title.trim()} type="submit">
          Create
        </Button>
      </div>
    </form>
  );
}
