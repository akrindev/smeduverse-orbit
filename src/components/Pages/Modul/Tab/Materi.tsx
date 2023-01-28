import Link from "next/link";
import { IconPlus, IconUserCheck } from "@tabler/icons-react";

export default function MateriTab({ modulId }: { modulId: string | number }) {
  return (
    <>
      <div className='col g-2 mb-2'>
        <div className='col-auto ms-auto d-print-none'>
          <div className='btn-list'>
            <Link
              href={`/modul/${modulId}/tambah-materi`}
              className='btn btn-outline-primary'>
              <>
                <IconPlus className='icon icon-inline' />
                Buat Materi
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
                <th>Materi</th>
                {/* <th>Kehadiran</th> */}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((id) => (
                <tr key={id}>
                  <td>
                    <div className='d-flex py-1 align-items-center'>
                      <div className='flex-fill'>
                        <Link
                          href={`/modul/${modulId}/materi?materiId=${id}`}
                          className='font-weight-medium'>
                          #{id} Procedure Text
                        </Link>
                        <div className='text-muted'>
                          <span className='text-reset'>Rabu, 22 Juli 2023</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* <td>
                    <div className='text-muted'>
                      <IconUserCheck className='icon icon-inline' />
                      <span className='ml-2'>23/30</span>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
