import React, { useState } from "react";
import { AppShell, Text, useMantineTheme } from "@mantine/core";
import Navigation from "./Navigation/Navigation";
import HeadNavbar from "./HeadNavbar";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      fixed
      navbar={
        <Navigation opened={opened}>
          <Text>Application navbar</Text>
        </Navigation>
      }
      header={<HeadNavbar setOpened={setOpened} opened={opened} />}>
      {children}
    </AppShell>
  );
}
