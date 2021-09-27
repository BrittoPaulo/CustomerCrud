import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
const {height} = Dimensions.get('window');
import Card from '../../components/cardCustomer';
import CustomButton from '../../components/customButton';
const Customer = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [maxIndex, setMaxIndex] = useState(0);
  const [dataSearch, setDataSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    setLoading(true);
    const unsubscribeCustomerListener = firestore()
      .collection('customers')
      .onSnapshot(
        async querySnapshot => {
          if (!querySnapshot && !querySnapshot.size) {
            setDataSearch([]);
            setLoading(false);
            return;
          }
          let _data = [];
          querySnapshot.docs.forEach(elem => {
            _data = [..._data, {...elem.data(), refId: elem.id}];
          });
          if (_data.length) {
            _data.sort((a, b) => {
              return b.id - a.id;
            });
            setMaxIndex(_data[0].id);
          }
          setData(_data);
          setDataSearch(_data);
          setLoading(false);
        },
        e => {
          setDataSearch([]);
          setLoading(false);
        },
      );
    return () => {
      unsubscribeCustomerListener();
    };
  }, []);
  const Search = value => {
    setSearchTerm(value);
    if (!value.trim()) {
      setDataSearch(data);
      return;
    }
    const _value = value.trim().toLowerCase();
    const filter = data.filter(
      elem => elem.name.toLowerCase().indexOf(_value) > -1,
    );
    setDataSearch(filter);
  };

  const Empty = () => {
    return (
      <View style={styles.containerSearch}>
        <Text
          style={
            styles.titleEmpty
          }>{`${`Nenhum cliente encontrado com nome ${searchTerm}`}`}</Text>
        <CustomButton
          onPress={() => Search('')}
          style={styles.button}
          buttonTitle={'Limpar busca'}
          color={'#00843d'}
          textColor={'#fff'}
          selected={true}
          textStyle={{fontSize: 18}}
        />
      </View>
    );
  };
  return (
    <SafeAreaView styles={styles.container}>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size={60} color={'#00843d'} />
        </View>
      )}
      {!loading && !dataSearch.length && !searchTerm ? (
        <View style={styles.containerEmpty}>
          <Text style={styles.titleEmpty}>Nenhum cliente cadastrado.</Text>
          <CustomButton
            onPress={() =>
              navigation.navigate('register', {maxIndex: maxIndex})
            }
            style={styles.button}
            buttonTitle={'Cadastrar Cliente'}
            color={'#00843d'}
            textColor={'#fff'}
            selected={true}
            textStyle={{fontSize: 18}}
          />
        </View>
      ) : (
        <>
          <View style={styles.shadow}>
            <TextInput
              placeholderTextColor={'#bdbdbd'}
              placeholder="Buscar Cliente"
              style={styles.TextInputStyleClass}
              value={searchTerm}
              onChangeText={text => Search(text)}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('register', {maxIndex: maxIndex});
              }}>
              <FastImage
                style={[styles.photo]}
                source={require('../../assets/img/add.png')}
                resizeMode={FastImage.resizeMode.contain}
                tintColor={'#00843d'}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={{height: height - 150}}>
            {searchTerm && !dataSearch.length ? (
              <Empty />
            ) : (
              <FlatList
                data={dataSearch}
                renderItem={event => (
                  <Card navigation={navigation} item={event.item} />
                )}
                keyExtractor={item => item.refId}
              />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
  },
  center: {
    top: height / 2 - 50,
  },
  containerEmpty: {
    top: height / 2 - 100,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  containerSearch: {
    top: height / 2 - 200,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  titleEmpty: {
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    color: '#303030',
    fontWeight: 'bold',
  },
  TextInputStyleClass: {
    textAlign: 'left',
    height: 57,
    marginHorizontal: 20,
    paddingLeft: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    bottom: 25,
    fontSize: 15,
    marginTop: 40,
    width: '75%',
  },
  shadow: {
    shadowColor: '#7A7A7A',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSearch: {
    position: 'absolute',
    left: 40,
  },
  photo: {
    width: 30,
    height: 40,
    marginBottom: 10,
  },
  button: {
    width: 240,
    height: 55,
    marginTop: 25,
    marginBottom: 10,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Customer;
