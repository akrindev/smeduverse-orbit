"use client";

import { useState } from "react";
import ActionStatus from "./ActionStatus";

export default function StudentListPresensi() {
  const names: Array<{ name: string }> = [
    {
      name: "Nanang Hermanto",
    },
    {
      name: "Syakirin Amin",
    },
    {
      name: "Rio Aprianto",
    },
    {
      name: "Muhimmatul Iffadah",
    },
    {
      name: "Leni Pratiwi",
    },
  ];

  return (
    <div className='card'>
      <div className='table-responsive'>
        <table className='table table-vcenter card-table'>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status Kehadiran</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {names.map(({ name }) => (
              <tr key={name}>
                <td>
                  <div className='d-flex py-1 align-items-center'>
                    <span className='avatar me-2'>SA</span>
                    <div className='flex-fill'>
                      <div className='font-weight-medium'>{name}</div>
                      <div className='text-muted'>
                        <span className='text-reset'>
                          {name.replace(" ", ".").toLowerCase()}@smeducative.com
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <ActionStatus name={name} key={name} />
                </td>
                <td>
                  <div className='text-muted small'>22 November 2022 07:15</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
