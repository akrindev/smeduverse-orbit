"use client";

import React, { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { LayoutHeader } from "@/components/Layout";
import ModulInformation from "@/components/Pages/Modul/ModulInformation";
import Tugas from "@/components/Pages/Modul/Tab/Tugas";
import Materi from "@/components/Pages/Modul/Tab/Materi";
import Presensi from "@/components/Pages/Modul/Tab/Presensi";
import Siswa from "@/components/Pages/Modul/Tab/Siswa";
import { IModulParams } from "@/types/modul-page";

type Tab = {
  title: string;
  component: React.ReactNode;
  count?: number | string | null;
};

export default function InformasiModulPage({ params }: IModulParams) {
  const [tab, setTab] = useState<number>(0);

  const tabs: Array<Tab> = [
    {
      title: "Presensi",
      component: <Presensi modulId={params.modulId} />,
      count: 21,
    },
    {
      title: "Materi",
      component: <Materi modulId={params.modulId} />,
      count: 21,
    },
    {
      title: "Tugas",
      component: <Tugas />,
      count: 21,
    },
    {
      title: "Anggota (Siswa)",
      component: <Siswa />,
      count: 21,
    },
  ];

  return (
    <>
      <LayoutHeader>
        <div className='col'>
          {/* <div className='page-pretitle'>Overview</div> */}
          <h2 className='page-title'>Informasi Modul</h2>
        </div>
      </LayoutHeader>

      <ModulInformation />

      <div className='mt-2 row g-4'>
        <div className='col-12 col-md-3'>
          <div className='subheader'>MENU</div>
          <div className='mb-2'>
            <div className='list-group list-group-transparent mb-3'>
              {tabs.map((item, index) => (
                <span
                  className={`list-group-item list-group-item-action d-flex align-items-center cursor-pointer ${
                    index == tab && "active"
                  }`}
                  onClick={() => setTab(index)}>
                  {item.title}
                  <small className='text-muted ms-auto'>{item.count}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className='col-12 col-md-9'>{tabs[tab].component}</div>
      </div>
    </>
  );
}
