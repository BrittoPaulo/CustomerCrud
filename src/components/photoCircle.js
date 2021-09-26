import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';

const PhotoCircle = ({photoURL, photoStyle, style}) => {
  const [loadImage, setLoadImage] = useState(false);
  return (
    <View style={[styles.container, style]}>
      <FastImage
        onLoadStart={e => {
          setLoadImage(true);
        }}
        onLoadEnd={e => {
          setLoadImage(false);
        }}
        style={[styles.container, photoStyle]}
        source={
          typeof photoURL !== 'number'
            ? {uri: photoURL, priority: FastImage.priority.high}
            : photoURL
        }>
        {loadImage ? (
          <View style={styles.load}>
            <ActivityIndicator size="large" color={'#51A6FF'} />
          </View>
        ) : null}
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 40,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: '#F6F6F5',
  },
  load: {
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    margin: 40,
  },
});

export default PhotoCircle;
