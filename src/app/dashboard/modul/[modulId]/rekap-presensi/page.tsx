"use client";

import { LayoutHeader } from "@/components/Layout";
import { IModulParams } from "@/types/modul-page";
import { IconChevronLeft } from "@tabler/icons-react";
import { format, getDaysInMonth } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export default function RekapPresensiPage({
  params,
  searchParams,
}: IModulParams) {
  const meets: number = 16;

  const loopDays = Array.from({ length: meets }, (_, i) => i + 1);

  const examples = [
    "rio",
    "syakirin amin",
    "leni pratiwi",
    "muhimmatul iffadah",
    "nanang hermanto",
  ];

  return (
    <>
      <LayoutHeader>
        <div className='row'>
          <div className='col'>
            <h2 className='page-title'>Rekap Presensi</h2>
          </div>
          <div className='col-auto ms-auto d-print-none'>
            <div className='btn-list'>
              <button className='btn'>.xlsx</button>
              <button className='btn'>.pdf</button>
              <Link
                href={`/dashboard/modul/${params.modulId}`}
                className='btn btn-outline-primary'>
                <IconChevronLeft className='icon' width={16} height={16} />
                kembali
              </Link>
            </div>
          </div>
        </div>
      </LayoutHeader>

      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='table-responsive'>
              <table className='table card-table table-hover table-striped text-nowrap'>
                <thead>
                  <tr>
                    <th rowSpan={2}>Nama Lengkap</th>
                    <th colSpan={meets + 1}>Pertemuan ke -</th>
                  </tr>
                  <tr>
                    {loopDays &&
                      loopDays.map((day) => (
                        <th key={day} rowSpan={1}>
                          {day}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {examples.map((e) => (
                    <tr key={e}>
                      <td>{e}</td>
                      {loopDays.map((f) => (
                        <td key={f}>
                          {f % 7 !== 0 && (
                            <span className='badge bg-success me-1'></span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
