import { LayoutHeader } from "@/components/Layout";
import { PropsWithChildren } from "react";

export default function LayoutPage({ children }: PropsWithChildren) {
  return (
    <>
      <LayoutHeader>
        <div className='col'>
          <div className='page-pretitle'>Pengaturan</div>
          <h2 className='page-title'>Pengaturan Umum</h2>
        </div>
      </LayoutHeader>

      <div className='card'>
        <div className='row g-0'>
          <div className='col-3 d-none d-md-block border-end'>
            <div className='card-body'>
              <h4 className='subheader'>Akun</h4>
              <div className='list-group list-group-transparent'>
                <a
                  href='./settings.html'
                  className='list-group-item list-group-item-action d-flex align-items-center active'>
                  Informasi Pribadi
                </a>
              </div>
              {/* pengaturan khusus waka kurikulum */}
              <h4 className='subheader mt-4'>Pengaturan Kurikulum</h4>
              <div className='list-group list-group-transparent'>
                <a href='#' className='list-group-item list-group-item-action'>
                  KKM
                </a>
                <a href='#' className='list-group-item list-group-item-action'>
                  Tahun Pelajaran
                </a>
                <a href='#' className='list-group-item list-group-item-action'>
                  Lainnya
                </a>
              </div>
              {/* pengaturan khusus waka kurikulum */}
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
