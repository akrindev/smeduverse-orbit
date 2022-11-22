import { IconPlus, IconUserCheck } from "@tabler/icons";

export default function Presensi() {
  return (
    <>
      <div className='col g-2 mb-2'>
        <div className='col-auto ms-auto d-print-none'>
          <div className='btn-list'>
            <a href='#' className='btn btn-outline-primary'>
              <IconPlus className='icon icon-inline' />
              Buat Presensi
            </a>
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
                <tr>
                  <td>
                    <div className='d-flex py-1 align-items-center'>
                      <div className='flex-fill'>
                        <a href='#' className='font-weight-medium'>
                          #{id} presensi 22 November 2022
                        </a>
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
