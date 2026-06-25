import {
  Group,
  Image,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  ActionIcon,
  Indicator,
} from "@mantine/core";
import {
  Notifications,
  ChevronRight,
  Logout,
} from "@nine-thirty-five/material-symbols-react/rounded/filled";
import { Person } from "@nine-thirty-five/material-symbols-react/rounded";
import { Settings } from "@nine-thirty-five/material-symbols-react/outlined";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { toUser } from "@/lib/mappers/user.mapper";
import { authService } from "@/services/auth.service";
import jltLogo from "@/assets/logos/jlt-white.png";
import jltWord from "@/assets/logos/jlt-black-word.png";
import { useState } from "react";

// Logo / Brand

function BrandLogo() {
  return (
    <Group gap={12} align="center">
      <Image src={jltWord} alt="Jill L. Tolentino Customs Brokerage" w={167} />
    </Group>
  );
}

// User Menu

function UserMenu() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const userResource = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!userResource) return null;

  const user = toUser(userResource);

  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const avatarSrc = user.imageUrl ?? undefined;

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {
      // Keep local logout flow even if backend logout fails.
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  }

  function handleAccountSettings() {
    navigate("/account-settings");
  }

  return (
    <Menu
      position="bottom-start"
      offset={4}
      withArrow
      arrowPosition="side"
      shadow="md"
      width={200}
      opened={opened}
      onChange={setOpened}
      styles={{
        dropdown: {
          padding: 0,
          "--menu-item-hover": "var(--mantine-color-jltOrange-5)",
          "--popover-border-color": "#bebebe",
        } as React.CSSProperties,
      }}
    >
      <Menu.Target>
        <UnstyledButton
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 8px",
            borderRadius: 8,
            transition: "background 120ms ease",
          }}
          styles={{
            root: {
              "&:hover": {
                background: "rgba(255,255,255,0.08)",
              },
            },
          }}
        >
          <Indicator
            label={
              <Settings
                width={14}
                height={14}
                color="var(--mantine-color-jltBlue-8)"
              />
            }
            size={16}
            offset={4}
            position="bottom-end"
            color="jltOrange.5"
            radius={"xl"}
            styles={{
              indicator: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingInline: 0,
              },
            }}
          >
            <Avatar
              src={avatarSrc}
              alt={user.fullName}
              size={36}
              radius="xl"
              color="jltOrange"
              style={{ border: "2px solid rgba(255,255,255,0.3)" }}
            >
              {initials}
            </Avatar>
          </Indicator>

          <Text size="sm" fw={600} c="black" style={{ whiteSpace: "nowrap" }}>
            {user.firstName?.toUpperCase()} {user.lastName?.toUpperCase()}
          </Text>

          <ChevronRight
            width={25}
            height={25}
            color="#4E6174"
            style={{
              transition: "transform 200ms ease",
              transform: opened ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Person width={20} height={20} color="#4E6174" />}
          onClick={handleAccountSettings}
          c="jltBlue.8"
          styles={{
            item: {
              borderTopLeftRadius:
                "var(--popover-radius, var(--mantine-radius-default))",
              borderTopRightRadius:
                "var(--popover-radius, var(--mantine-radius-default))",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          Account Settings
        </Menu.Item>

        <Menu.Divider
          styles={{
            divider: {
              borderWidth: 1.5,
              scale: "100.5%",
              margin: 0,
              borderColor: "#bebebe",
            },
          }}
        />

        <Menu.Item
          leftSection={<Logout width={20} height={20} color="#4E6174" />}
          c="jltBlue.8"
          onClick={handleLogout}
          styles={{
            item: {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius:
                "var(--popover-radius, var(--mantine-radius-default))",
              borderBottomRightRadius:
                "var(--popover-radius, var(--mantine-radius-default))",
            },
          }}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

// Notifications Bell

function NotificationsBell() {
  return (
    <Indicator color="jltOrange" size={8} offset={4} disabled>
      <ActionIcon variant="transparent" size="lg" aria-label="Notifications">
        <Notifications width={30} height={30} color="#4E6174" />
      </ActionIcon>
    </Indicator>
  );
}

// AppHeader

export function AppHeader() {
  return (
    <Group h="100%" px={20} justify="space-between" bg="#fdfdfd">
      {/* Left: Brand */}
      <BrandLogo />

      {/* Right: Bell + User */}
      <Group gap={0}>
        <NotificationsBell />
        <UserMenu />
      </Group>
    </Group>
  );
}
