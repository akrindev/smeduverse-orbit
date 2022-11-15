import { useState } from "react";
import { IconPlus } from "@tabler/icons";
import { Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout";
import ModulSection from "../../components/Pages/Modul/ModulSection";

export default function Modul() {
  const [showAssignModul, setShowAssignModul] = useState(false);

  const handleModalShow = () => setShowAssignModul(true);
  const handleModalClose = () => setShowAssignModul(false);

  return (
    <Layout>
      <Layout.Header>
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
                aria-label='Create new report'>
                <IconPlus />
              </a>
            </div>
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        <ModulSection />
      </Layout.Body>

      {/* modal */}
      <Modal
        show={showAssignModul}
        onHide={handleModalClose}
        className='modal-blur'
        dialogClassName='modal-lg'
        role='document'>
        <Modal.Header>
          <Modal.Title as={`h5`}>Assign Modul / Mata Pelajaran</Modal.Title>
          <Button className='btn-close' onClick={handleModalClose}></Button>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-3'>
            <label htmlFor='modul' className='form-label'>
              Modul
            </label>
            <select name='modul' id='modul' className='form-select'>
              <option value='inggris'>inggris</option>
              <option value='matematika'>matematika</option>
            </select>
          </div>
          <div className='mb-3'>
            <label htmlFor='guru' className='form-label'>
              Guru
            </label>
            <select name='guru' id='guru' className='form-select'>
              <option value='ike'>ike</option>
              <option value='uswatun'>uswatun</option>
              <option value='syakirin'>syakirin</option>
            </select>
          </div>
          <div className='mb-3'>
            <label htmlFor='kelas' className='form-label'>
              Kelas
            </label>
            <select name='kelas' id='kelas' className='form-select'>
              <option value='X'>X</option>
              <option value='XI'>XI</option>
              <option value='XII'>XII</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button>Tambah</Button>
          <Button onClick={handleModalClose} variant=''>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
