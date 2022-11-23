"use client";

import { useMemo } from "react";
import { IconFileAnalytics } from "@tabler/icons";
import { IconBook2 } from "@tabler/icons";
import { IconHome } from "@tabler/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarItem = ({ title, icon, link }) => {
  const pathname = usePathname();

  const isActive = useMemo(
    () => pathname.split("/")[1] == link.replace("/", ""),
    [pathname, link]
  );

  return (
    <li className={`nav-item ${isActive && "active"}`}>
      <Link className='nav-link' href={link}>
        <>
          <span className='nav-link-icon d-md-none d-lg-inline-block'>
            {icon}
          </span>
          <span className='nav-link-title'>{title}</span>
        </>
      </Link>
    </li>
  );
};
export default function Navbar({ showNavbar }) {
  const routes = [
    { title: "Home", icon: <IconHome />, link: "/" },
    { title: "Modul", icon: <IconBook2 />, link: "/modul" },
    {
      title: "Rekap Penilaian",
      icon: <IconFileAnalytics />,
      link: "/rekap-penilaian",
    },
  ];

  return (
    <div className='navbar-expand-md'>
      <div
        className={`collapse navbar-collapse ${showNavbar && "show"}`}
        id='navbar-menu'>
        <div className='navbar navbar-light'>
          <div className='container-xl'>
            <ul className='navbar-nav'>
              {routes &&
                routes.map((route) => (
                  <NavbarItem
                    key={route.link}
                    title={route.title}
                    icon={route.icon}
                    link={route.link}
                  />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
