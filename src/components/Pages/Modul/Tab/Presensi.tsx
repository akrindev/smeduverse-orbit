import Link from "next/link";
import { IconCalendarTime, IconPlus, IconUserCheck } from "@tabler/icons-react";

export default function Presensi({ modulId }: { modulId: string | number }) {
  return (
    <>
      <div className='col g-2 mb-2'>
        <div className='col-auto ms-auto d-print-none'>
          <div className='btn-list'>
            <Link
              href={`/dashboard/modul/${modulId}/presensi`}
              className='btn btn-outline-primary'>
              <>
                <IconPlus className='icon icon-inline' />
                Buat Presensi
              </>
            </Link>
            <Link
              href={`/dashboard/modul/${modulId}/rekap-presensi`}
              className='btn btn-outline-primary'>
              <>
                <IconCalendarTime className='icon icon-inline' />
                Rekap Presensi
              </>
            </Link>
          </div>
        </div>
      </div>
      <div className='card'>
        <div className='table-responsive'>
          <table className='table table-vcenter card-table'>
            <thead>
              <tr>
                <th>Presensi</th>
                <th>Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((id) => (
                <tr key={id}>
                  <td>
                    <div className='d-flex py-1 align-items-center'>
                      <div className='flex-fill'>
                        <Link
                          href={`/dashboard/modul/${modulId}/presensi?presensiId=${id}`}
                          className='font-weight-medium'>
                          #{id} presensi 22 November 2022
                        </Link>
                        <div className='text-muted'>
                          <span className='text-reset'>22 November 2022</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className='text-muted'>
                      <IconUserCheck className='icon icon-inline' />
                      <span className='ml-2'>23/30</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
