"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { LayoutHeader } from "@/components/Layout";
import ModulSection from "@/components/Pages/Modul/ModulSection";

export default function Modul() {
  const [showAssignModul, setShowAssignModul] = useState(false);

  const handleModalShow = () => setShowAssignModul(true);
  const handleModalClose = () => setShowAssignModul(false);

  return (
    <>
      <LayoutHeader>
        <div className='row g-2 align-items-center'>
          <div className='col'>
            <div className='page-pretitle'>Overview</div>
            <h2 className='page-title'>Modul / Mata Pelajaran</h2>
          </div>

          {/* actions right */}
          <div className='col-auto ms-auto d-print-none'>
            <div className='btn-list'>
              <span className='d-none d-sm-inline'>
                <a href='#' className='btn'>
                  Lihat Mata Pelajaran
                </a>
              </span>
              {/* show only on desktop */}
              <a
                href='#'
                className='btn btn-primary d-none d-sm-inline-block'
                onClick={handleModalShow}>
                <IconPlus />
                Assign Modul
              </a>
              {/* show only on mobile */}
              <a
                href='#'
                className='btn btn-primary d-sm-none btn-icon'
                data-bs-toggle='modal'
                data-bs-target='#modal-report'
                aria-label='Create new report'
                onClick={handleModalShow}>
                <IconPlus />
              </a>
            </div>
          </div>
        </div>
      </LayoutHeader>

      <ModulSection />
    </>
  );
}
