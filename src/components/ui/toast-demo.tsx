"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function ToastDemo() {
  return (
    <div className="gap-2 grid">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Default Toast",
            description: "This is a toast message",
          });
        }}
      >
        Show Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Error Toast",
            description: "This is an error toast message",
          });
        }}
      >
        Show Error Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "With Action",
            description: "This toast has an action button",
            action: (
              <Button variant="outline" size="sm">
                Undo
              </Button>
            ),
          });
        }}
      >
        Toast with Action
      </Button>
    </div>
  );
}
