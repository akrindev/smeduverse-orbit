import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function NavHeader({
  onClick,
}: {
  onClick: React.MouseEventHandler;
}) {
  const [show, setShow] = useState(false);
  // get data and status from useSession
  // overwrite typescript useSession to match the data from ISession

  const { data, status } = useSession();

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = null;
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        !show ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        setShow(false);
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!show || keyCode !== 27) return;
      setShow(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    // console.log(sidebarExpanded);
  }, [sidebarExpanded]);

  return (
    <header className='navbar navbar-expand-md navbar-light d-print-none'>
      <div className='container-xl'>
        <button className='navbar-toggler' type='button' onClick={onClick}>
          <span className='navbar-toggler-icon'></span>
        </button>
        <h1 className='navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3'>
          <a href='.'>
            <Image
              src={`/orbit.png`}
              width='32'
              height='32'
              alt='Smeduverse Orbit'
              className='navbar-brand-image me-3'
            />
            Smeduverse Orbit
          </a>
        </h1>
        <div className='navbar-nav flex-row order-md-last'>
          {status == "loading" ? (
            "loading"
          ) : (
            <div className='nav-item dropdown'>
              <a
                ref={trigger}
                onClick={(e) => setShow(!show)}
                href='#'
                data-bs-toggle='dropdown'
                className={`nav-link d-flex lh-1 text-reset p-0 ${
                  show && "show"
                }`}>
                <span
                  className='avatar avatar-sm'
                  style={{
                    backgroundImage: `url(${
                      data?.user?.data.teacher.photo || "/avatar.png"
                    })`,
                  }}></span>
                <div className='d-none d-xl-block ps-2'>
                  <div>{data?.user?.data.name || "name"}</div>
                  <div className='mt-1 small text-muted'>Teacher</div>
                </div>
              </a>
              <div
                ref={dropdown}
                className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${
                  show && "show"
                }`}>
                {/* <div className='dropdown-divider'></div> */}
                <Link href='/dashboard/pengaturan' className='dropdown-item'>
                  Settings
                </Link>
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                  className='dropdown-item'>
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
