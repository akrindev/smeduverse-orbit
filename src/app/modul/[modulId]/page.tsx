"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { LayoutHeader } from "@/components/Layout";
import ModulInformation from "@/components/Pages/Modul/ModulInformation";
import Tugas from "@/components/Pages/Modul/Tab/Tugas";
import Materi from "@/components/Pages/Modul/Tab/Materi";
import Presensi from "@/components/Pages/Modul/Tab/Presensi";
import Siswa from "@/components/Pages/Modul/Tab/Siswa";
import { IModulParams } from "@/types/modul-page";

export default function InformasiModulPage({
  params,
  searchParams,
}: IModulParams) {
  const [tab, setTab] = useState<string>("presensi");

  const tabs = {
    tugas: <Tugas />,
    materi: <Materi />,
    presensi: (
      <Presensi modulId={params.modulId} presensiId={searchParams.presensiId} />
    ),
    siswa: <Siswa />,
  };

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
              <span
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  tab == "presensi" && "active"
                }`}
                onClick={() => setTab("presensi")}>
                Presensi
                <small className='text-muted ms-auto'>5</small>
              </span>
              <span
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  tab == "tugas" && "active"
                }`}
                onClick={() => setTab("tugas")}>
                Tugas<small className='text-muted ms-auto'>4</small>
              </span>
              <span
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  tab == "materi" && "active"
                }`}
                onClick={() => setTab("materi")}>
                Materi
                <small className='text-muted ms-auto'>9</small>
              </span>
              <span
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  tab == "siswa" && "active"
                }`}
                onClick={() => setTab("siswa")}>
                Siswa
                <small className='text-muted ms-auto'>32</small>
              </span>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-9'>{tabs[tab]}</div>
      </div>
    </>
  );
}
