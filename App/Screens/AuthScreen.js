import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';

const AuthScreen = ({ params }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <View>
          <ImageBackground
            source={require('../Assets/Images/finance.png')}
            style={{ width: 300, height: 200, alignSelf: 'center' }}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
};
export default AuthScreen;
