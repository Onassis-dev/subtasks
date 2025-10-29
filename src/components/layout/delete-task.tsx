import { Task } from "@/lib/storage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useProjectTasks } from "@/lib/store";

interface props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export function DeleteTaskDialog({ open, onOpenChange, task }: props) {
  const { deleteTask } = useProjectTasks();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>
            This task will be deleted permanently.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteTask(task.id);
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
