"use client";

import { useDroppable } from "@dnd-kit/core";

export function RootDrop() {
  const {
    setNodeRef: setDropRef,
    isOver,
    active,
  } = useDroppable({
    id: "root",
    data: {
      parentId: null,
      id: null,
    },
  });

  return (
    <>
      <div ref={setDropRef} className="h-0 w-full"></div>
      {isOver && (
        <div
          style={{
            height: active?.rect.current?.initial?.height ?? 0,
          }}
          className="w-auto border rounded-lg border-primary mb-3"
        />
      )}
    </>
  );
}
