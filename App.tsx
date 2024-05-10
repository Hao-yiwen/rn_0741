import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  targetView: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    marginVertical: 20,
  },
  backgroundImageBody: {
    height: 200,
  },
  backgroundImage: {
    height: 200,
  },
});

const FlatListDemo = () => {
  const animatedValue = new Animated.Value(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState(0);
  const [flatListData, setFlatListData] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const data = Array.from({length: 100}, (_, index) => ({
      a: index % 2,
      id: index,
    })).map((item, index) =>
      item.a === 1
        ? {
            ...item,
            title: `Title ${index}`,
            content: `Content ${index}`,
          }
        : item,
    );
    setFlatListData(data);
  }, []);

  const refreshOrder = () => {
    setIsRefresh(true);
    setTimeout(() => {
      setIsRefresh(false);
      setRefreshStatus(status => (status + 1) % 2); // 简单切换刷新状态文本
    }, 2000);
  };

  const hideGuide = () => {
    console.log('animated:', animatedValue);
    console.log('Hide guide');
  };

  const REFRESHSTATUS = ['Pull to refresh', 'Loading...'];

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 3000],
    outputRange: ['rgb(0, 255, 0)', 'rgb(255, 0, 0)'],
  });

  return (
    <View>
      <Animated.View
        style={{
          position: 'relative',
          backgroundColor: 'pink',
          width: 100,
          height: 100,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 15000],
                outputRange: [0, 100],
              }),
            },
          ],
        }}>
        <Text>Translate y</Text>
      </Animated.View>
      <Animated.FlatList
        style={{
          height: Dimensions.get('screen').height,
        }}
        nestedScrollEnabled={true}
        ref={flatListRef}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={20}
        data={flatListData}
        renderItem={({item}) => {
          return (
            <Animated.View
              style={{
                width: Dimensions.get('screen').width,
                marginTop: 20,
                height: 300,
                backgroundColor: backgroundColor,
              }}></Animated.View>
          );
        }}
        keyExtractor={item => String(item.id)}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: animatedValue}}}],
          {
            useNativeDriver: true,
            listener: event => {
              hideGuide();
            },
          },
        )}
        refreshControl={
          <RefreshControl
            style={{backgroundColor: 'transparent'}}
            refreshing={isRefresh}
            onRefresh={refreshOrder}
            title={REFRESHSTATUS[refreshStatus]}
            tintColor="#FFF"
            titleColor="#FFF"
          />
        }
      />
    </View>
  );
};

export default FlatListDemo;
