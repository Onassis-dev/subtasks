import { create } from "zustand";

type Color = "blue" | "green" | "purple" | "red" | "primary";

type ColorStore = {
  color: Color;
  setColor: (color: Color) => void;
  syncColor: () => void;
};

export const useColorStore = create<ColorStore>((set, get) => ({
  color: (localStorage.getItem("color") as Color) || "primary",
  setColor: (color) => {
    localStorage.setItem("color", color);
    document.documentElement.classList.remove("blue", "green", "purple", "red");
    document.documentElement.classList.add(color);
    set({ color });
  },
  syncColor: () => {
    document.documentElement.classList.remove("blue", "green", "purple", "red");
    document.documentElement.classList.add(get().color);
  },
}));
