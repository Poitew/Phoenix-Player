import { createStaticNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../routes/Home";
import MusicPlayer from "../routes/Player";
import Library from "../routes/Library";

const router = createStackNavigator({
    screens: {
        Home: Home,
        Player: MusicPlayer,
        Library: Library,
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