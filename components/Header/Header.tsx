"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import NavHeader from "./NavHeader";

export default function Header() {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => setShowNavbar(!showNavbar);

  return (
    <div className='mb-3'>
      <NavHeader onClick={handleShowNavbar} />
      <Navbar showNavbar={showNavbar} />
    </div>
  );
}
