import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import {useState} from 'react/cjs/react.development';
import PhotoCircle from '../../components/photoCircle';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import CustomButton from '../../components/customButton';
import firestore from '@react-native-firebase/firestore';
import {TextInputMask} from 'react-native-masked-text';
import moment from 'moment';
import 'moment/locale/pt-br';
const Edit = ({route, navigation}) => {
  const id = route.params?.id || '';
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoCache, setPhotoCache] = useState(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [cod, setCod] = useState('');
  const [validDate, setValidDate] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  useState(() => {
    if (id) {
      setCod(id);
      setName(route.params.name);
      setPhoto(route.params.image);
      setBirthDate(route.params.birthDate);
      setEdit(true);
    } else {
      setCod(route.params.maxIndex + 1);
    }
  }, [id]);
  const Submit = async () => {
    if (!name && !birthDate) {
      setSubmit(true);
      return;
    }
    let data = moment(birthDate, 'YYYY/MM/DD');
    if (!data.isValid() || data > new Date()) {
      setValidDate('Data inválida');
      setSubmit(true);
    }
    setLoading(true);
    let url = '';
    if (edit) {
      if (photoCache) {
        url = await uploadPhoto(cod);
      }
      const customers = await firestore()
        .collection('customers')
        .doc(route.params.refId)
        .get();
      await customers.ref.set(
        {
          image: url || customers.data().image,
          name: name || customers.data().name,
          birthDate: moment(data).format('YYYY/MM/DD'),
        },
        {
          merge: true,
        },
      );
    } else {
      if (photoCache) {
        url = await uploadPhoto(cod);
      }
      await firestore()
        .collection('customers')
        .add({
          name,
          birthDate: moment(data).format('YYYY/MM/DD'),
          id: cod,
          image: url,
        });
    }
    navigation.navigate('client');
    setLoading(false);
  };
  const Delete = async () => {
    setLoading(true);
    await firestore().collection('customers').doc(route.params.refId).delete();
    navigation.navigate('client');
    setLoading(false);
  };
  const uploadPhoto = async index => {
    try {
      const storageRef = storage().ref();
      const profilesImages = storageRef.child('profilesImages/' + index);
      await profilesImages.putString(photoCache.data, 'base64');
      const photoURL = await profilesImages.getDownloadURL();
      return photoURL;
    } catch (error) {
      setLoading(false);
      return '';
    }
  };
  const getPhoto = async () => {
    const image = await ImagePicker.openPicker({
      width: 800,
      height: 800,
      cropping: true,

      includeBase64: true,
    });
    setPhotoCache(image);
  };
  return (
    <SafeAreaView style={styles.flex}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textStyle}>Essa Operação é irreversível!</Text>
            <Text style={styles.subTextStyle}>Deseja continuar?</Text>
            <View style={styles.buttons}>
              <CustomButton
                onPress={() => setModalVisible(false)}
                style={[styles.buttonModal, {backgroundColor: '#757575'}]}
                buttonTitle={'cancelar'}
                color={'#757575'}
                textColor={'#fff'}
                selected={true}
                textStyle={{fontSize: 12}}
              />
              <CustomButton
                onPress={() => Delete()}
                style={styles.buttonModal}
                buttonTitle={'continuar'}
                color={'#00843d'}
                textColor={'#fff'}
                selected={true}
                textStyle={{fontSize: 12}}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.imageEdit}>
          {loading ? (
            <ActivityIndicator color={'#00843d'} size={'large'} />
          ) : (
            <View>
              <TouchableOpacity onPress={() => getPhoto()} style={styles.row}>
                <PhotoCircle
                  style={styles.image}
                  photoStyle={styles.photoStyle}
                  photoURL={
                    photo
                      ? photo
                      : photoCache
                      ? photoCache.path
                      : require('../../assets/img/profile.png')
                  }
                />
                <Text style={styles.changePhoto}>Adicionar foto de perfil</Text>
              </TouchableOpacity>
              <View style={styles.column}>
                <View
                  style={[
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: !name && submit ? 'red' : '#757575',
                    },
                    styles.view,
                  ]}>
                  <Text style={styles.labelStyle}>Nome</Text>
                  <TextInput
                    style={[styles.textInput]}
                    placeholder={'nome'}
                    value={name}
                    onChangeText={text => {
                      setName(text);
                    }}
                  />
                </View>
                {!name && submit && (
                  <Text style={styles.validate}>Campo obrigatório</Text>
                )}
              </View>
              <View style={styles.column}>
                <View
                  style={[
                    {
                      borderBottomWidth: 1,
                      borderBottomColor:
                        (!birthDate || validDate) && submit ? 'red' : '#757575',
                    },
                    styles.view,
                  ]}>
                  <Text style={styles.labelStyle}>Data de nascimento</Text>
                  <TextInputMask
                    type={'datetime'}
                    placeholder={'DD/MM/AAAA'}
                    style={[styles.textInput]}
                    value={birthDate}
                    options={{
                      format: 'DD/MM/YYYY',
                    }}
                    onChangeText={text => {
                      setBirthDate(text);
                      setValidDate(null);
                    }}
                  />
                </View>
                {(!birthDate || validDate) && submit && (
                  <Text style={styles.validate}>
                    {validDate || 'Campo obrigatório'}
                  </Text>
                )}
              </View>
              <View style={styles.column}>
                <View
                  style={[
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: '#757575',
                    },
                    styles.view,
                  ]}>
                  <Text style={styles.labelStyle}>Código</Text>
                  <TextInput
                    editable={false}
                    style={[styles.textInput, {color: '#7A7A7A'}]}
                    value={`${cod}`}
                  />
                </View>
              </View>
              <View style={styles.buttons}>
                {edit && (
                  <CustomButton
                    onPress={() => setModalVisible(true)}
                    style={[styles.button, {backgroundColor: 'red'}]}
                    buttonTitle={'deletar'}
                    color={'red'}
                    textColor={'#fff'}
                    selected={true}
                    textStyle={{fontSize: 18}}
                  />
                )}
                <CustomButton
                  onPress={() => Submit()}
                  style={styles.button}
                  buttonTitle={edit ? 'Editar' : 'Cadastrar'}
                  color={'#00843d'}
                  textColor={'#fff'}
                  selected={true}
                  textStyle={{fontSize: 18}}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  flex: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 40,
    flex: 1,
  },
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
  labelContainer: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
    left: 2,
    top: 2,
  },
  imageEdit: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  photoStyle: {
    height: 70,
    width: 70,
  },
  changePhoto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0256AD',
    marginLeft: 22,
  },
  textInput: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#303030',
    marginBottom: -10,
    marginTop: -10,
  },
  label: {
    marginTop: 5,
  },
  labelStyle: {
    color: '#757575',
    fontSize: 15,
    lineHeight: 24,
  },
  validate: {
    color: 'red',
    fontSize: 12,
  },
  view: {
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    textAlign: 'left',
    padding: 0,
    marginVertical: 10,
  },
  button: {
    width: 150,
    height: 55,
    marginTop: 25,
    marginBottom: 10,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
  },
  textStyle: {
    color: '#303030',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
  subTextStyle: {
    color: '#303030',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  buttonModal: {
    width: 100,
    height: 40,
    marginTop: 25,
    marginBottom: 10,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Edit;
