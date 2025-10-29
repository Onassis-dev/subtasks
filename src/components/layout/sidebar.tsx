"use client";

import * as React from "react";
import { PlusIcon } from "@radix-ui/react-icons";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Task } from "@/lib/storage";
import { Button } from "../ui/button";
import { CreateProjectDialog } from "./create-project";
import { useState } from "react";
import { Project } from "./project";
import { DeleteProjectDialog } from "./delete-project";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const projects = useLiveQuery(() =>
    db.tasks.where("parentId").equals("-").sortBy("order")
  );
  const [selected, setSelected] = useState<Task | null>(null);

  return (
    <>
      <Sidebar {...props}>
        <SidebarContent>
          <div className="flex items-center justify-between gap-2 px-2 text-sm font-semibold">
            My Projects
            <Button
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setOpenForm(true);
              }}
              className="size-6"
            >
              <PlusIcon />
            </Button>
          </div>
          <div>
            {projects?.map((project) => (
              <Project
                key={project.id}
                project={project}
                setSelected={setSelected}
                setOpenDelete={setOpenDelete}
                setOpenEdit={setOpenForm}
              />
            ))}
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <CreateProjectDialog
        open={openForm}
        onOpenChange={setOpenForm}
        selectedProject={selected}
      />
      <DeleteProjectDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        project={selected!}
      />
    </>
  );
}
