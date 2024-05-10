import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  findNodeHandle,
  Dimensions,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';

const Index: React.FC = () => {
  const flatListRef = useRef(null);
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          width: Dimensions.get('screen').width * 0.3,
          backgroundColor: 'pink',
          height: Dimensions.get('screen').height,
        }}>
        {Array.from({length: 100}, (_, index) => (
          <View
            key={index}
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'lightblue',
              marginVertical: 20,
            }}>
            <Text>View {index}</Text>
          </View>
        ))}
      </ScrollView>
      <FlatListDemo ref={flatListRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
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
    height: 200, // 仅示例，根据需要调整
  },
  backgroundImage: {
    height: 200,
  },
});

const FlatListDemo = React.forwardRef((props, flatListRef) => {
  const animatedValue = new Animated.Value(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState(0);
  const [flatListData, setFlatListData] = useState([]);
  const opacityValue = useRef(new Animated.Value(0)).current; // 透明度从0变化到1
  const scaleValue = useRef(new Animated.Value(0)).current; // 缩放从0变化到1

  // 模拟FlatList数据
  useEffect(() => {
    const data = Array.from({length: 100}, (_, index) => ({
      a: index % 2, // 用于切换渲染的视图
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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [opacityValue, scaleValue]);

  // 模拟刷新动作
  const refreshOrder = () => {
    setIsRefresh(true);
    setTimeout(() => {
      setIsRefresh(false);
      setRefreshStatus(status => (status + 1) % 2); // 简单切换刷新状态文本
    }, 2000);
  };

  // 模拟隐藏引导动作
  const hideGuide = () => {
    console.log('animated:', animatedValue);
    console.log('Hide guide');
  };

  // 模拟FlatListBody组件
  const FlatListBody = () => (
    <View
      style={{
        padding: 20,
      }}>
      <Text style={{color: '#fff'}}>FlatList Body Content</Text>
    </View>
  );

  // 模拟刷新状态文本
  const REFRESHSTATUS = ['Pull to refresh', 'Loading...'];

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 3000],
    outputRange: ['rgb(0, 255, 0)', 'rgb(255, 0, 0)'],
  });

  return (
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
              width: Dimensions.get('screen').width * 0.7,
              marginTop: 20,
              height: 300,
              backgroundColor: backgroundColor,
            }}>
            <Button
              title="FlatListStuckAndStopped"
              onPress={() => {
                flatListRef.current.scrollToOffset({
                  offset: 1000,
                  animated: false,
                });
              }}
            />
            <Animated.Image
              style={{
                height: 30,
                width: 30,
                opacity: opacityValue,
                transform: [
                  {
                    rotate: animatedValue.interpolate({
                      inputRange: [0, 3000],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                  {
                    scale: scaleValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 2],
                    }),
                  },
                ],
              }}
              source={{
                uri: 'http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg',
              }}
            />
            <FlatListBody />
            <Animated.View
              style={{
                position: 'relative',
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 3000],
                      outputRange: [0, 30],
                    }),
                  },
                ],
              }}>
              <Text>Animated Text</Text>
            </Animated.View>
          </Animated.View>
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
  );
});

export default Index;
