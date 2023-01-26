import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function Pagination() {
  return (
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
  );
}
