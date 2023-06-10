"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ModulCard from "../components/ModulCard";

export default function Page() {
  // yourModul dummy data has key owner, cover, class, name mapel, status
  // cover is image url from random unsplash image
  // status must be boolean
  // owner is teacher name in this example there was 3 teacher
  // mapel is matematika, fisika, kimia, biologi, bahasa indonesia, bahasa inggris, pkn, sejarah, geografi, ekonomi, sosiologi
  const yourModul = [
    {
      id: Math.random().toString(36),
      owner: "Muhammad Fauzan",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Matematika",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Ahmad Syahrul",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Fisika",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Rizki Pratama",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Kimia",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Muhammad Fauzan",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Biologi",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Ahmad Syahrul",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Bahasa Indonesia",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Rizki Pratama",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Bahasa Inggris",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Muhammad Fauzan",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "PKN",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Ahmad Syahrul",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Sejarah",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Rizki Pratama",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPS 1",
      mapel: "Geografi",
      status: true,
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="mt-5 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Modul</h2>
          <p className="text-sm text-muted-foreground">
            {/* list of all modul available */}
            Daftar semua modul yang telah dibuat
          </p>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="grid grid-cols-12 gap-5">
              {yourModul.map((modul) => (
                <ModulCard
                  key={modul.mapel}
                  modul={modul}
                  className="cursor-pointer"
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
