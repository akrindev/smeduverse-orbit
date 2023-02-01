import { LayoutHeader } from "@/components/Layout";
import { IMateriParams } from "@/types/page/materi";

export default function DetailMateri({ params, searchParams }: IMateriParams) {
  return (
    <>
      <LayoutHeader>
        <div className='col'>
          <h2 className='page-title'>Judul Materi</h2>
        </div>
      </LayoutHeader>

      <div className='row g-4'>
        <div className='col-md-8'>
          <div className='card'>
            <div className='card-body'>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                nam nemo, quisquam sapiente eos in, consequatur veniam rem totam
                quidem delectus facere voluptas? Officia dolorum perferendis
                quam accusamus sapiente error?
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Consequatur, natus porro laborum hic doloremque nobis asperiores
                reprehenderit cumque soluta itaque iste cum maxime neque
                molestias sequi minima a? Eligendi, nam.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                molestiae facilis totam ipsum, consequuntur possimus ratione
                debitis voluptatibus excepturi quis consectetur eius! Iusto vero
                distinctio in, eligendi repellendus quisquam similique?
              </p>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='mb-3'>
            <div className='card'>
              <div className='card-header'>
                <h3 className='card-title'>Rincian Materi</h3>
              </div>
              <div className='card-body'>
                <dl className='row'>
                  <dt className='col-4'>Oleh</dt>
                  <dd className='col-8'>Bu Ima</dd>
                  <dt className='col-4'>Pada</dt>
                  <dd className='col-8'>Sabtu, 30 Januari 2023</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='card-header'>
              <h3 className='card-title'>File terkait materi</h3>
            </div>
            <div className='card-body'>
              <div className='mb-3'>file 1</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
