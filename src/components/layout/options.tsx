import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { useColorStore } from "@/lib/themes";

interface props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Options = ({ open, onOpenChange }: props) => {
  const { theme, setTheme } = useTheme();
  const { color, setColor } = useColorStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="theme">Theme</Label>
            <Select
              name="theme"
              value={theme}
              onValueChange={(value) => setTheme(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="color">Color</Label>
            <Select
              name="color"
              value={color}
              onValueChange={(value) => setColor(value as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">
                  {" "}
                  <div className="w-4 h-4 bg-red-500 rounded-full" /> Red
                </SelectItem>
                <SelectItem value="blue">
                  {" "}
                  <div className="w-4 h-4 bg-blue-500 rounded-full" /> Blue
                </SelectItem>
                <SelectItem value="green">
                  {" "}
                  <div className="w-4 h-4 bg-green-500 rounded-full" /> Green
                </SelectItem>
                <SelectItem value="purple">
                  {" "}
                  <div className="w-4 h-4 bg-purple-500 rounded-full" /> Purple
                </SelectItem>
                <SelectItem value="primary">
                  {" "}
                  <div className="w-4 h-4 bg-primary-root rounded-full" />{" "}
                  Primary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
