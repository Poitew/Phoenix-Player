import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../routes/Home";
import Library from "../routes/Library";
import Folder from "../routes/Folder";
import Search from "../routes/Search";
import Settings from "../routes/Settings";

import HomeIcon from "../../assets/icons/home.svg";
import FolderIcon from "../../assets/icons/folder.svg";
import SearchIcon from "../../assets/icons/search.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import { createStackNavigator } from "@react-navigation/stack";

const screen_options = {
	tabBarShowLabel: false,
	headerShown: false,
	tabBarActiveTintColor: "#C7DA54",
	tabBarStyle: {
		backgroundColor: "#161427",
		borderTopWidth: 0,
		height: 60,
	},
	tabBarItemStyle: {
		alignItems: "center",
		flexDirection: "row",
	},
};

const LibraryStack = createStackNavigator({
	screens: {
		LibraryHome: Library,

		Folder: Folder,
	},

	screenOptions: screen_options,
});

const router = createBottomTabNavigator({
	screens: {
		Home: {
			screen: Home,

			options: {
				tabBarIcon: ({ size }) => <HomeIcon width={size} height={size} />,
				animation: "shift",
			},
		},

		Library: {
			screen: LibraryStack,
			options: {
				tabBarIcon: ({ size }) => <FolderIcon width={size} height={size} />,
				animation: "shift",
				unmountOnBlur: true,
			},
		},

		Search: {
			screen: Search,
			options: {
				tabBarIcon: ({ size }) => <SearchIcon width={size} height={size} />,
				animation: "shift",
			},
		},

		Settings: {
			screen: Settings,

			options: {
				tabBarIcon: ({ size }) => <SettingsIcon width={size} height={size} />,
				animation: "shift",
			},
		},
	},

	screenOptions: screen_options,
});

export const Navigation = createStaticNavigation(router);
