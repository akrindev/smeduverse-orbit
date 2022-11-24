"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons";
import Layout from "../../../components/Layout";
import ModulInformation from "../../../components/Pages/Modul/ModulInformation";
import Tugas from "../../../components/Pages/Modul/Tab/Tugas";
import Materi from "../../../components/Pages/Modul/Tab/Materi";
import Presensi from "../../../components/Pages/Modul/Tab/Presensi";
import Siswa from "../../../components/Pages/Modul/Tab/Siswa";

export default function Informasi() {
  const [tab, setTab] = useState<string>("tugas");

  const tabs = {
    tugas: <Tugas />,
    materi: <Materi />,
    presensi: <Presensi />,
    siswa: <Siswa />,
  };

  return (
    <>
      <Layout.Header>
        <div className='col'>
          {/* <div className='page-pretitle'>Overview</div> */}
          <h2 className='page-title'>Informasi Modul</h2>
        </div>
      </Layout.Header>
      <Layout.Body>
        <ModulInformation />

        <div className='mt-2 row g-4'>
          <div className='col-12 col-md-3'>
            <div className='subheader'>aksi</div>
            <div className='mb-2'>
              <div className='list-group list-group-transparent mb-3'>
                <a
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    tab == "tugas" && "active"
                  }`}
                  href='#'
                  onClick={() => setTab("tugas")}>
                  Tugas<small className='text-muted ms-auto'>4</small>
                </a>
                <a
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    tab == "materi" && "active"
                  }`}
                  href='#'
                  onClick={() => setTab("materi")}>
                  Materi
                  <small className='text-muted ms-auto'>9</small>
                </a>
                <a
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    tab == "presensi" && "active"
                  }`}
                  href='#'
                  onClick={() => setTab("presensi")}>
                  Presensi
                  <small className='text-muted ms-auto'>5</small>
                </a>
                <a
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    tab == "siswa" && "active"
                  }`}
                  href='#'
                  onClick={() => setTab("siswa")}>
                  Siswa
                  <small className='text-muted ms-auto'>32</small>
                </a>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-9'>{tabs[tab]}</div>
        </div>
      </Layout.Body>
    </>
  );
}
