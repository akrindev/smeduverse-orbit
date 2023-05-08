"use client";

import LatestAssignment from "@/components/Pages/Dashboard/Table/LatestAssignments";
import LatestAttendandes from "@/components/Pages/Dashboard/Table/LatestAttendaces";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data, status } = useSession();

  if (status == "loading") {
    return "mendapatkan data";
  }

  return (
    <>
      {/* row row card */}
      <div className="row row-deck row-cards">
        {/* mapel count */}
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Mata Pelajaran</div>
              </div>
              <div className="h1">20</div>
            </div>
          </div>
        </div>
        {/* end: mapel count */}
        {/* Modul count */}
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Modul</div>
              </div>
              <div className="h1">42</div>
            </div>
          </div>
        </div>
        {/* end: Modul count */}
        {/* Modul count */}
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Materi</div>
              </div>
              <div className="h1">534</div>
            </div>
          </div>
        </div>
        {/* end: Modul count */}
        {/* Modul count */}
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Presensi</div>
              </div>
              <div className="h1">7834</div>
            </div>
          </div>
        </div>
        {/* end: Modul count */}

        {/* latest attendaces */}
        <LatestAttendandes />
        {/* end: latest attendaces */}

        {/* latest assignment */}
        <LatestAssignment />
        {/* end: latest assignment */}
      </div>
      {/* end: row row card */}
    </>
  );
}
