export default function NavHeader({ onClick }) {
  return (
    <header className='navbar navbar-expand-md navbar-light d-print-none'>
      <div className='container-xl'>
        <button
          className='navbar-toggler'
          type='button'
          onClick={onClick}
          ariaLabel='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <h1 className='navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3'>
          <a href='.'>
            {/* <img
                src='./static/logo-small.svg'
                width='32'
                height='32'
                alt='Tabler'
                className='navbar-brand-image me-3'
              /> */}
            Orbit
          </a>
        </h1>
        <div className='navbar-nav flex-row order-md-last'>
          <div className='d-none d-md-flex'>
            <a
              href='?theme=dark'
              className='nav-link px-0 hide-theme-dark'
              data-bs-toggle='tooltip'
              data-bs-placement='bottom'
              aria-label='Enable dark mode'
              data-bs-original-title='Enable dark mode'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                stroke-width='2'
                stroke='currentColor'
                fill='none'
                stroke-linecap='round'
                stroke-linejoin='round'>
                <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                <path d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z'></path>
              </svg>
            </a>
            <a
              href='?theme=light'
              className='nav-link px-0 hide-theme-light'
              data-bs-toggle='tooltip'
              data-bs-placement='bottom'
              aria-label='Enable light mode'
              data-bs-original-title='Enable light mode'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                stroke-width='2'
                stroke='currentColor'
                fill='none'
                stroke-linecap='round'
                stroke-linejoin='round'>
                <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                <circle cx='12' cy='12' r='4'></circle>
                <path d='M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7'></path>
              </svg>
            </a>
          </div>
          <div className='nav-item dropdown'>
            <a
              href='#'
              className='nav-link d-flex lh-1 text-reset p-0'
              data-bs-toggle='dropdown'
              aria-label='Open user menu'>
              <span className='avatar avatar-sm'></span>
              <div className='d-none d-xl-block ps-2'>
                <div>Kellie Skingley</div>
                <div className='mt-1 small text-muted'>Teacher</div>
              </div>
            </a>
            <div className='dropdown-menu dropdown-menu-end dropdown-menu-arrow'>
              <a href='#' className='dropdown-item'>
                Status
              </a>
              <a href='#' className='dropdown-item'>
                Profile
              </a>
              <a href='#' className='dropdown-item'>
                Feedback
              </a>
              <div className='dropdown-divider'></div>
              <a href='./settings.html' className='dropdown-item'>
                Settings
              </a>
              <a href='./sign-in.html' className='dropdown-item'>
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
