import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import ModulGrid from "./ModulGrid";
import ModulSectionSide from "./ModulSectionSide";

export default function ModulSection() {
  return (
    <div className='row g-4'>
      <div className='col-12 col-md-3'>
        <ModulSectionSide />
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
