import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import BottomTabs from './navigation/BottomTabs';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
};

export default App;

