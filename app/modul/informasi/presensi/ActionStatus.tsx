"use client";

import { useState } from "react";

export default function ActionStatus({ name }: { name: string }) {
  const [status, setStatus] = useState<string>("hadir");

  const id = name.replace(" ", "").toLowerCase();

  function handleChange(status: string): void {
    setStatus((prev) => status);
    console.log(status);
  }

  return (
    <div className='mb-3'>
      {/* <label className='form-label'>Buttons group</label> */}
      <div className='btn-group w-100' role='group'>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
          value={`hadir`}
          checked={status === "hadir"}
          onChange={() => handleChange}
        />
        <label
          htmlFor={`action-status-${id}`}
          className='btn'
          onClick={() => handleChange("hadir")}>
          Hadir
        </label>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
          value={`izin`}
          checked={status === "izin"}
          onChange={() => handleChange}
        />
        <label
          htmlFor={`action-status-${id}`}
          className='btn'
          onClick={() => handleChange("izin")}>
          Izin
        </label>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
          value={`sakit`}
          checked={status === "sakit"}
          onChange={() => handleChange}
        />
        <label
          htmlFor={`action-status-${id}`}
          className='btn'
          onClick={() => handleChange("sakit")}>
          Sakit
        </label>
        <input
          type='radio'
          className='btn-check'
          name={`action-status-${id}`}
          id={`action-status-${id}`}
          value={`alpa`}
          checked={status === "alpa"}
          onChange={() => handleChange}
        />
        <label
          htmlFor={`action-status-${id}`}
          className='btn'
          onClick={() => handleChange("alpa")}>
          Alpa
        </label>
      </div>
    </div>
  );
}
