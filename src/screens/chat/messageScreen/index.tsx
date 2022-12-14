import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {normalize} from '../../../utils/dimensions';
import {useSelector} from 'react-redux';
import {COLOR} from '../../../utils/color';
import {} from 'react-native-vector-icons';
import {images} from '../../../utils/images';

export default function MessageScreen() {
  const [Name, setUserName] = useState<any>([]);
  const navigation = useNavigation<any>();
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let UserId = Auth_Data?.user?.user?.uid;
  console.log('Auth data', Auth_Data);

  useEffect(() => {
    firestore()
      .collection('Users')
      .where('uid', '!=', UserId)
      .get()
      .then(res => {
        //@ts-ignore

        console.log('result', res._docs);
        //@ts-ignore
        let users = res?._docs?.map((item: any) => {
          return item._data;
        });

        console.log('resss', users);
        setUserName(users);
      });
  }, []);
  // useEffect(() => {
  //   const abc = firestore()
  //     .collection('Users')
  //     .doc(UserId)
  //     .collection('Inbox')
  //     .onSnapshot(doc => {
  //       const dataArray = doc?._docs.map(element => element._data);
  //       setUserName(dataArray);
  //       console.log('dataArray', dataArray);
  //     });
  //   console.log('abc', abc);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.3,
          width: '100%',
          backgroundColor: COLOR.WHITE,
        }}
      />
    );
  };
  const _renderItem = ({item}: any) => {
    console.log(' img in renderItem', item?.display);
    const NO_DP_IMAGE = require('../../../assets/images/account.png');
    return (
      <TouchableOpacity
        style={styles.flatlistview}
        onPress={() =>
          navigation.navigate('Chating', {
            Name: item?.Name,
            UID: item?.uid,
            status: item?.isActive,
            dp: item?.display,
          })
        }>
        <View>
          <Image
            source={item?.display ? {uri: item?.display} : NO_DP_IMAGE}
            // source={{uri: item?.display}}
            style={styles.imgStyle}
          />
        </View>
        <Text style={styles.name}>{item?.Name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={Name}
        renderItem={_renderItem}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
      <TouchableOpacity onPress={() => navigation.navigate('AllUser')}>
        <Image style={styles.fab} source={images.message} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistview: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalize(70),
  },
  imgStyle: {
    height: normalize(45),
    width: normalize(45),
    borderRadius: normalize(50),
    resizeMode: 'cover',
  },
  name: {
    color: 'white',
    margin: normalize(10),
    fontWeight: '500',
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    height: normalize(40),
    width: normalize(40),
    resizeMode: 'contain',
  },
});
