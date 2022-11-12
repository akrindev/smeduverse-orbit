export default function Navbar({ showNavbar }) {
  return (
    <div className='navbar-expand-md'>
      <div
        className={`collapse navbar-collapse ${showNavbar && "show"}`}
        id='navbar-menu'>
        <div className='navbar navbar-light'>
          <div className='container-xl'>
            <ul className='navbar-nav'>
              <li className='nav-item dropdown active'>
                <a
                  className='nav-link dropdown-toggle'
                  href='#navbar-third'
                  role='button'>
                  <span className='nav-link-icon d-md-none d-lg-inline-block'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                      <path d='M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z'></path>
                    </svg>
                  </span>
                  <span className='nav-link-title'>Third</span>
                </a>
                <div className='dropdown-menu'>
                  <a className='dropdown-item' href='./#'>
                    First
                  </a>
                  <a className='dropdown-item' href='./#'>
                    Second
                  </a>
                  <a className='dropdown-item' href='./#'>
                    Third
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
