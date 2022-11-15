import { IconCheck } from "@tabler/icons";
import Layout from "../../components/Layout";

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
        <div className='card'>
          <div className='card-header'>
            <h3 className='card-title'>Informasi Dasar</h3>
          </div>
          <div className='card-body'>
            <div className='datagrid'>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Guru</div>
                <div className='datagrid-content'>Roch Imaniwati</div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Modul / Mata Pelajaran</div>
                <div className='datagrid-content'>Bahasa Inggris</div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Tingkat Kelas</div>
                <div className='datagrid-content'>X (10)</div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Nama Kelas</div>
                <div className='datagrid-content'>X TJKT</div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Jurusan</div>
                <div className='datagrid-content'>
                  Teknik Jaringan Komputer dan Telekomunikasi
                </div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Wali Kelas</div>
                <div className='datagrid-content'>Ninda Agustiarsih</div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Status Modul</div>
                <div className='datagrid-content'>
                  <span className='status status-green'>Active</span>
                </div>
              </div>
              <div className='datagrid-item'>
                <div className='datagrid-title'>Tahun Ajaran</div>
                <div className='datagrid-content'>
                  <IconCheck className='icon text-green' />
                  2022/2023 - Genap
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  );
}
