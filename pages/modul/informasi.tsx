import { IconCalendar, IconMessage } from "@tabler/icons";
import Layout from "../../components/Layout";
import ModulInformation from "../../components/Pages/Modul/ModulInformation";

export default function Informasi() {
  return (
    <Layout>
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
            <div className='mb-2'>
              <div className='mb-2'>
                <div className='list-group list-group-transparent mb-3'>
                  <a
                    className='list-group-item list-group-item-action d-flex align-items-center active'
                    href='#'>
                    Tugas<small className='text-muted ms-auto'>4</small>
                  </a>
                  <a
                    className='list-group-item list-group-item-action d-flex align-items-center'
                    href='#'>
                    Materi
                    <small className='text-muted ms-auto'>9</small>
                  </a>
                  <a
                    className='list-group-item list-group-item-action d-flex align-items-center'
                    href='#'>
                    Siswa
                    <small className='text-muted ms-auto'>32</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-9'>
            <div className='card'>
              <div className='card-header'>
                <h3 className='card-title'>Tugas </h3>
              </div>
              <div className='table-responsive'>
                <table className='table card-table table-vcenter'>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <tr>
                        <td className='w-100'>
                          <a href='#' className='text-reset'>
                            Simple Present Tense
                          </a>
                        </td>
                        <td className='text-nowrap text-muted'>
                          <IconCalendar className='icon mr-2' />
                          August 05, 2022
                        </td>
                        <td className='text-nowrap'>
                          <a href='#' className='text-muted'>
                            <IconMessage className='icon mr-2' /> 3
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  );
}
