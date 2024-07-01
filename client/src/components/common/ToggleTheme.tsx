import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Flex, Icon, Switch, useColorMode } from "@chakra-ui/react";

const ToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems={"center"} justifyContent={"center"} gap={1} position={"absolute"} right={12}>
      <Icon as={MoonIcon} color={"on-primary-container"} />
      <Switch
        isChecked={colorMode === "light"}
        sx={{
          "[data-checked]": {
            "--switch-bg": "var(--chakra-colors-primary)",
          },
        }}
        onChange={toggleColorMode}
      ></Switch>
      <Icon as={SunIcon} color={"on-primary-container"} />
    </Flex>
  );
};

export default ToggleTheme;
