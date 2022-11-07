import React from "react";
import { ThemeIcon, Divider, Stack } from "@mantine/core";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home } from "react-feather";
import { FileText } from "react-feather";
import { Folder } from "react-feather";

export function MainLink({ icon, color, label, link }) {
  const location = useRouter();

  return (
    <NavLink
      to={link}
      label={label}
      icon={
        <ThemeIcon color={color} variant='light'>
          {icon}
        </ThemeIcon>
      }
      active={location.pathname == link}>
      {/* <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group> */}
    </NavLink>
  );
}

const data = [
  {
    icon: <Home />,
    color: "blue",
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: <Folder />,
    color: "blue",
    label: "Modul",
    link: "/modul",
  },
  {
    icon: <FileText />,
    color: "blue",
    label: "Rekap Nilai",
    link: "/rekap-nilai",
  },
];

export function NavLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <Stack spacing={2}>{links}</Stack>;
}
