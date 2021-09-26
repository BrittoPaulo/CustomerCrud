import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PhotoCircle from './photoCircle';
import moment from 'moment';
import 'moment/locale/pt-br';
const Card = ({item, navigation}) => {
  const birthDate = moment(item?.birthDate, 'DD/MM/YYYY').format('LL');
  return (
    <View style={[styles.container]}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('register', {id: item.id});
        }}>
        <View style={styles.column}>
          <View style={styles.row}>
            <View>
              <PhotoCircle
                style={styles.image}
                photoStyle={styles.photoStyle}
                photoURL={item.image || require('../assets/img/profile.png')}
              />
            </View>
            <View style={styles.date}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.info}>{`codigo: ${item.id}`}</Text>
              <Text style={styles.info}>{`aniversário: ${birthDate}`}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    shadowColor: '#7A7A7A',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 2,
    marginVertical: 10,
  },
  column: {
    flexDirection: 'column',
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    left: 2,
    top: 2,
  },
  name: {
    fontSize: 16,
    color: '#303030',
  },
  info: {
    fontSize: 14,
  },
  photoStyle: {
    height: 60,
    width: 60,
  },
  date: {
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
});
export default Card;
