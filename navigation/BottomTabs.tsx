// // navigation/BottomTabs.tsx

// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { RouteProp } from '@react-navigation/native';
// import React from 'react';

// import EventsScreen from '../app/(tabs)/event'; // 👈 Ensure correct file name & casing
// import HomeScreen from '../app/(tabs)/index';
// import SocialScreen from '../app/(tabs)/social';

// export type BottomTabParamList = {
//   Home: undefined;
//   Events: undefined;
//   Social: undefined;
// };

// const Tab = createBottomTabNavigator<BottomTabParamList>();

// export default function BottomTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({
//         route,
//       }: {
//         route: RouteProp<BottomTabParamList, keyof BottomTabParamList>;
//       }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#6200EE',
//         tabBarInactiveTintColor: 'gray',
//         tabBarIcon: ({ color, size }) => {
//           try {
//             let iconName: keyof typeof Ionicons.glyphMap;

//             switch (route.name) {
//               case 'Home':
//                 iconName = 'home';
//                 break;
//               case 'Events':
//                 iconName = 'calendar-outline';
//                 break;
//               case 'Social':
//                 iconName = 'people-outline';
//                 break;
//               default:
//                 iconName = 'help-circle-outline';
//             }

//             return <Ionicons name={iconName} size={size} color={color} />;
//           } catch (error) {
//             console.error(`Icon render failed for route: ${route.name}`, error);
//             return null;
//           }
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Events" component={EventsScreen} />
//       <Tab.Screen name="Social" component={SocialScreen} />
//     </Tab.Navigator>
//   );
// }
