// bottom navbar component
// the bottom navbar is only visible on mobile devices
// it is used to navigate between the different pages
// menu items are the same as in the sidebar
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  IconGridPattern,
  IconMicrophone,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

export function BottomNavbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed lg:hidden bottom-0 w-full bg-background z-30",
        className
      )}
    >
      <Separator />
      <div className="flex justify-around py-4">
        <Button variant="ghost" size="sm" className="w-full justify-center">
          <IconPlayerPlay className="mr-2 h-4 w-4" />
          Listen Now
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-center">
          <IconGridPattern className="mr-2 h-4 w-4" />
          Browse
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-center">
          <IconMicrophone className="mr-2 h-4 w-4" />
          Radio
        </Button>
      </div>
    </div>
  );
}
