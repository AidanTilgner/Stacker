import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getAssetPath } from "../server/assets";
import { Link, Outlet } from "react-router";
import { HouseSimple, Note } from "@phosphor-icons/react";
import { useState } from "react";
import classes from "./Layout.module.scss";

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group h={36}>
            <img
              src={getAssetPath("images/substack-logo.png")}
              height={"100%"}
            />
            <Title order={3}>Stacker</Title>
          </Group>
        </Group>
      </AppShell.Header>
      <Navbar />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
const data = [
  { link: "/", label: "Home", icon: HouseSimple },
  {
    link: "/notes",
    label: "Notes",
    icon: Note,
  },
];

function Navbar() {
  const [active, setActive] = useState("Home");

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <AppShell.Navbar p="md">
      <div className={classes.navbarMain}>{links}</div>
    </AppShell.Navbar>
  );
}
