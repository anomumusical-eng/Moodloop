import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from './src/lib/supabase';
import { Colors } from './src/lib/theme';

import SplashScreen    from './src/screens/SplashScreen';
import LoginScreen     from './src/screens/LoginScreen';
import SignupScreen    from './src/screens/SignupScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen      from './src/screens/HomeScreen';
import CheckinScreen   from './src/screens/CheckinScreen';
import LoopScreen      from './src/screens/LoopScreen';
import HistoryScreen   from './src/screens/HistoryScreen';
import ProfileScreen   from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.bg } }}>
        {!session ? (
          <>
            <Stack.Screen name="Splash"      component={SplashScreen} />
            <Stack.Screen name="Login"       component={LoginScreen} />
            <Stack.Screen name="Signup"      component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding"  component={OnboardingScreen} />
            <Stack.Screen name="Home"        component={HomeScreen} />
            <Stack.Screen name="Checkin"     component={CheckinScreen} />
            <Stack.Screen name="Loop"        component={LoopScreen} />
            <Stack.Screen name="History"     component={HistoryScreen} />
            <Stack.Screen name="Profile"     component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
