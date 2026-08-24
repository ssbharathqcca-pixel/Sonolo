/**
 * Bottom tab navigation: Home, Learn, Progress, Settings — on a
 * floating glassmorphic tab bar that lets content scroll beneath it.
 */
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import {
  GraduationCap,
  House,
  Settings,
  TrendingUp,
} from "lucide-react-native";
import { colors } from "../../src/theme/colors";

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

function tabIcon(
  Icon: typeof House,
): (props: TabIconProps) => JSX.Element {
  return function TabIcon({ color, size }: TabIconProps) {
    return <Icon color={color} size={size} />;
  };
}

export default function TabLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.auroraTeal,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: colors.glass,
          borderTopColor: colors.glassBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 6,
        },
        sceneStyle: { backgroundColor: colors.nightSky },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon(House) }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: "Learn", tabBarIcon: tabIcon(GraduationCap) }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: "Progress", tabBarIcon: tabIcon(TrendingUp) }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", tabBarIcon: tabIcon(Settings) }}
      />
    </Tabs>
  );
}
