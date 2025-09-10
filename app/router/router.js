import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MusicPlayer from "../routes/Player"
import Library from "../routes/Library.tsx";

const router = createBottomTabNavigator({
    screens: {
        Library: {
            screen: Library,
        },

        Player: {
            screen: MusicPlayer,
        },
    },

    screenOptions: {
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#C7DA54',
        tabBarStyle: {
            backgroundColor: '#4f2c50ff',
            borderTopWidth: 0,
        },
    },
});

const Navigation = createStaticNavigation(router);

export default Navigation;