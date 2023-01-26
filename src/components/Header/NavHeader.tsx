export default function NavHeader({ onClick }: {onClick: React.MouseEventHandler}) {
  return (
    <header className='navbar navbar-expand-md navbar-light d-print-none'>
      <div className='container-xl'>
        <button className='navbar-toggler' type='button' onClick={onClick}>
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
          <div className='nav-item dropdown'>
            <a href='#' className='nav-link d-flex lh-1 text-reset p-0'>
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
