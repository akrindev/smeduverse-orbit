"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  IconGridPattern,
  IconListDetails,
  IconMicrophone,
  IconMusic,
  IconPlayerPlay,
} from "@tabler/icons-react";

export function Sidebar({ className }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start"
            >
              <IconPlayerPlay className="mr-2 h-4 w-4" />
              Listen Now
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconGridPattern className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconMicrophone className="mr-2 h-4 w-4" />
              Radio
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconListDetails className="mr-2 h-4 w-4" />
              Playlists
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconMusic className="mr-2 h-4 w-4" />
              Songs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
