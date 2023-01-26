"use client";

import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "../../../../components/Layout";
import StudentListPresensi from "./StudentListPresensi";

export default function PresensiIndex() {
  const router = useRouter();

  return (
    <>
      <Layout.Header>
        <div className='col'>
          <Link
            href={`/modul/informasi`}
            className='page-pretitle'
            style={{
              cursor: `pointer`,
            }}>
            <IconChevronLeft className='icon inline-icon' /> KEMBALI
          </Link>
          <h2 className='page-title'>Presensi</h2>
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className='row'>
          <div className='col-md-4'>
            <form className='card'>
              <div className='card-header'>
                <h3 className='card-title'>Horizontal form</h3>
              </div>
              <div className='card-body'>
                <div className='mb-3'>
                  <label className='form-label required'>Judul Presensi</label>
                  <div className='col'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Judul Presensi'
                    />
                    <small className='form-hint'>
                      Judul presensi otomatis dibuat berdasarkan jumlah
                      presensi. Kamu dapat mengubah judul presensi.
                    </small>
                  </div>
                </div>
                <div className='mb-3'>
                  <label className='form-label required'>Deskripsi</label>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      placeholder='Deskripsi presensi'></textarea>
                    <small className='form-hint'>Deskripsi presensi</small>
                  </div>
                </div>
              </div>
              <div className='card-footer text-end'>
                <button type='submit' className='btn btn-primary'>
                  Simpan
                </button>
              </div>
            </form>
          </div>
          <div className='col-md-8'>
            <StudentListPresensi key={`list-presensi-siswa`} />
          </div>
        </div>
      </Layout.Body>
    </>
  );
}
