import { AppShell } from "@mantine/core";
import { NavbarNested } from "./Navbar";

export default function Layout({ children }) {
  return (
    <AppShell padding='md' navbar={<NavbarNested />}>
      {children}
    </AppShell>
  );
}
