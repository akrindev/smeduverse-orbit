import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import ModulGrid from "./ModulGrid";

export default function ModulSection() {
  return (
    <div className='row g-4'>
      <div className='col-12 col-md-3'>
        <div className='subheader mb-2'>Search</div>
        <div className='mb-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Search . . .'
          />
        </div>
        <div className='subheader mb-2'>Guru</div>
        <div className='mb-2'>
          <select className='form-select'>
            <option value='all'>Semua Guru</option>
            <option value='ima'>Bu ima</option>
            <option value='us'>Bu Us</option>
            <option value='widy'>Bu Widy</option>
          </select>
        </div>
        <div className='subheader mb-2'>Tahun Ajaran</div>
        <div className='mb-2'>
          <select className='form-select'>
            <option value='2022'>2022/2023</option>
            <option value='2021'>2021/2022</option>
          </select>
        </div>
        <div className='subheader mb-2'>Tingkat Kelas</div>
        <div className='mb-2'>
          <div className='list-group list-group-transparent mb-3'>
            <a
              className='list-group-item list-group-item-action d-flex align-items-center active'
              href='#'>
              X<small className='text-muted ms-auto'>24</small>
            </a>
            <a
              className='list-group-item list-group-item-action d-flex align-items-center'
              href='#'>
              XI
              <small className='text-muted ms-auto'>149</small>
            </a>
            <a
              className='list-group-item list-group-item-action d-flex align-items-center'
              href='#'>
              XII
              <small className='text-muted ms-auto'>88</small>
            </a>
          </div>
        </div>
      </div>
      <div className='col-12 col-md-9'>
        <div className='row row-cards'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <ModulGrid />
          ))}

          <div className='mt-3'>
            <ul className='pagination '>
              <li className='page-item disabled'>
                <a className='page-link' href='#'>
                  <IconChevronLeft />
                  prev
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link' href='#'>
                  1
                </a>
              </li>
              <li className='page-item active'>
                <a className='page-link' href='#'>
                  2
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link' href='#'>
                  3
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link' href='#'>
                  4
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link' href='#'>
                  5
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link' href='#'>
                  next
                  <IconChevronRight />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
