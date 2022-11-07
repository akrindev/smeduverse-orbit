import React from "react";
import {
  Header,
  MediaQuery,
  Burger,
  Title,
  Group,
  ActionIcon,
  useMantineTheme,
  Tooltip,
} from "@mantine/core";

export default function HeadNavbar({ opened, setOpened }) {
  const theme = useMantineTheme();
  return (
    <Header height={60} p='sm'>
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan='sm' styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size='sm'
            color={theme.colors.gray[6]}
            mr='xl'
          />
        </MediaQuery>

        <Title order={3}>Smeduverse Orbit</Title>
        <Group ml='auto' m='md'>
          <Tooltip label='Search' withArrow>
            <ActionIcon
              onClick={() => console.log("clicked")}
              variant='default'>
              <i className='bi bi-search'></i>
            </ActionIcon>
          </Tooltip>
        </Group>
      </div>
    </Header>
  );
}
