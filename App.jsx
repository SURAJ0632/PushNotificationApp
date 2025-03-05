import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';

function App() {
  const [notificationToken, setNotificationToken] = useState('');

  // Requesting user permission for notifications
  const requestUserPermission = async () => {
    try {
      // Request permission for Android
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      // Only proceed if permission was granted
      console.log('granted', granted)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        } else {
          console.log('Notification permission denied');
        }
      } else {
        console.log('Notification permission not granted');
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  // Get the FCM token
  const tokenId = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      setNotificationToken(token);
    } catch (error) {
      console.log('FCM token error:', error);
    }
  };

  // Using useEffect to handle the side effects (permissions and token)
  useEffect(() => {
    //requestUserPermission();
    tokenId();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{`FCM Token: ${notificationToken || 'No token available'}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});

export default App;
