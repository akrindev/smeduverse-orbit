import { MantineProvider, Text } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Text color='teal'>Welcome to Mantine!</Text>
    </MantineProvider>
  );
}
