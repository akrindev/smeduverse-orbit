export default function Footer() {
  return (
    <footer className='footer footer-transparent d-print-none'>
      <div className='container-xl'>
        <div className='row text-center align-items-center flex-row-reverse'>
          <div className='col-lg-auto ms-lg-auto'>
            <ul className='list-inline list-inline-dots mb-0'>
              <li className='list-inline-item'>
                <a
                  href='/'
                  target='_blank'
                  className='link-secondary'
                  rel='noopener'>
                  Smeducative
                </a>
              </li>
            </ul>
          </div>
          <div className='col-12 col-lg-auto mt-3 mt-lg-0'>
            <ul className='list-inline list-inline-dots mb-0'>
              <li className='list-inline-item'>Copyright © 2022</li>
              <li className='list-inline-item'>
                <a href='/' className='link-secondary'>
                  Smeduverse Orbit
                </a>
                . All rights reserved.
              </li>
              <li className='list-inline-item'>
                <a
                  href='./changelog.html'
                  className='link-secondary'
                  rel='noopener'>
                  v4.0
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
