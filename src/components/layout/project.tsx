"use client";

import { Task } from "@/lib/storage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useSelectedProject } from "@/lib/store";

interface props {
  project: Task;
  setSelected: (task: Task) => void;
  setOpenDelete: (open: boolean) => void;
  setOpenEdit: (open: boolean) => void;
}

export function Project({
  project,
  setSelected,
  setOpenDelete,
  setOpenEdit,
}: props) {
  const { projectId } = useSelectedProject();

  return (
    <>
      <div
        className={
          "px-2 hover:bg-sidebar-accent flex items-center justify-between rounded-md text-sm h-8 group/project " +
          (projectId === project.id ? " !bg-primary/15" : "")
        }
      >
        <Link
          href={`/dashboard/project?id=${project.id}`}
          className="w-full h-full flex items-center gap-2"
        >
          <CircleIcon />
          {project.title}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="size-6 opacity-0 group-hover/project:opacity-100 data-[state=open]:opacity-100"
            >
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem
              onClick={() => {
                setSelected(project);
                setOpenEdit(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelected(project);
                setOpenDelete(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
