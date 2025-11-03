import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/lib/storage";
import { addProject, updateProject } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CreateProjectDialog({
  open,
  onOpenChange,
  selectedProject,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Task | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setName(selectedProject?.title || "");
  }, [selectedProject]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedProject) {
      await updateProject(selectedProject.id, { title: name });
    } else {
      const projectId = await addProject({ title: name });
      router.push(`/dashboard/project?id=${projectId}`);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? "Edit project" : "Create project"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{selectedProject ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
