import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

const HomeScreen = ({ params }) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Title" subtitle="Subtitle" />
        <Appbar.Action icon="magnify" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {},
});

export default HomeScreen;
