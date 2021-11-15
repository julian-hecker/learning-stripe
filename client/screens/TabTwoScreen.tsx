import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { Button } from 'react-native';

const APP_URL = 'http://192.168.1.76:4242';

export default function TabTwoScreen() {
  const [uri, setUri] = useState('');

  useEffect(() => {
    fetch(`${APP_URL}/create-account`)
      .then((res) => res.json())
      .then((res) => {
        setUri(res.url);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Button
      title={uri ? 'Create Accont' : 'Loading...'}
      disabled={!uri}
      onPress={() => WebBrowser.openBrowserAsync(uri)}
    />
  );
  // <WebView bounces={false} source={{ uri }}></WebView>
}
