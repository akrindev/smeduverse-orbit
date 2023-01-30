"use client";

import { useState } from "react";
import { LayoutHeader } from "@/components/Layout";
import { FilePond } from "react-filepond";

import "filepond/dist/filepond.min.css";

export default function MateriBaruPage() {
  const [files, setFiles] = useState([]);

  return (
    <>
      <LayoutHeader>
        <div className='col'>
          <h2 className='page-title'>Buat Materi Baru</h2>
        </div>
      </LayoutHeader>

      <div className='row'>
        <div className='col-md-8'>
          <div className='card'>
            <div className='card-header'>
              <h3 className='card-title'>Buat Materi Baru</h3>
            </div>
            <div className='card-body'>
              {/* judul materi */}
              <div className='mb-3'>
                <label className='form-label required'>Modul</label>
                <div>
                  <input
                    type='text'
                    className='form-control'
                    value='Contoh judul modul'
                    disabled
                  />
                  <small className='form-hint'>
                    Materi ditambahkan ke dalam modul pada form di atas
                  </small>
                </div>
              </div>
              {/* end: judul materi */}
              {/* judul materi */}
              <div className='mb-3'>
                <label className='form-label required'>Judul Materi</label>
                <div>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Judul Materi'
                    required
                  />
                  <small className='form-hint'>
                    Judul dari materi yang akan dibuat
                  </small>
                </div>
              </div>
              {/* end: judul materi */}
              {/* isi materi */}
              <div className='mb-3'>
                <label className='form-label required'>Isi Materi</label>
                <div>
                  <textarea
                    className='form-control'
                    placeholder='Isi dan Deskripsi Materi'
                    rows={5}
                    required></textarea>
                  <small className='form-hint'>Isi dari materi </small>
                </div>
              </div>
              {/* end: isi materi */}
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card'>
            <div className='card-header'>
              <h3 className='card-title'>File terkait materi</h3>
            </div>
            <div className='card-body'>
              <div className='mb-3'>
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={3}
                  server='/api'
                  name='files' /* sets the file input name, it's filepond by default */
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />
              </div>
              <div className='mb-3'>
                <small className='form-hint'>
                  Usahakan untuk mengupload file dalam bentuk .pdf
                </small>
              </div>
            </div>
            <div className='card-footer text-end'>
              <button className='btn btn-primary'>Simpan</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
