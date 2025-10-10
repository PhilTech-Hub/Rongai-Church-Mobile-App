// SocialScreen.tsx or SocialScreen.jsx
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  Text,
  Alert,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

const reelsData = [
  {
    id: '1',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
];

export default function SocialScreen() {
  const router = useRouter();

  // ✅ Add this block to fix badge counts
  const counts = {
    chats: 3,
    meetings: 1,
    whatsapp: 5,
    alerts: 2,
    calls: 0,
  };

  const videoRefs = useRef<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<boolean[]>(reelsData.map(() => false));
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean[]>(reelsData.map(() => true));

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);

      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === newIndex) {
            video.playAsync();
          } else {
            video.pauseAsync();
          }
        }
      });
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

  const toggleLike = (index: number) => {
    const updated = [...liked];
    updated[index] = !updated[index];
    setLiked(updated);
  };

  const openWhatsAppCommunity = () => {
    const url = 'https://chat.whatsapp.com/I3OdG6kXzsLIH1HIEA04wg?mode=ac_t';
    Linking.openURL(url).catch(err =>
      console.error("Couldn't load WhatsApp link", err)
    );
  };

  const openShareOptions = () => setShareModalVisible(true);
  const openComments = () => setCommentModalVisible(true);
  const saveVideo = () => {
    Alert.alert('Save Reel', 'Saving is not supported in Expo Go.');
  };

  const handleTogglePlay = async (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const status = await video.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await video.pauseAsync();
    } else {
      await video.playAsync();
    }

    const updatedPlayStates = [...isPlaying];
    updatedPlayStates[index] = !status.isPlaying;
    setIsPlaying(updatedPlayStates);
  };

  const handleSeek = async (index: number, direction: 'forward' | 'backward') => {
    const video = videoRefs.current[index];
    if (!video) return;

    const status = await video.getStatusAsync();
    if (!status.isLoaded) return;

    const newPosition =
      direction === 'forward'
        ? status.positionMillis + 10000
        : Math.max(0, status.positionMillis - 10000);

    await video.setPositionAsync(newPosition);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        videoRefs.current.forEach(video => {
          if (video) video.pauseAsync();
        });
      };
    }, [])
  );

  const renderItem = ({ item, index }: any) => (
    <TouchableWithoutFeedback onPress={() => handleTogglePlay(index)}>
      <View style={styles.videoContainer}>
        <Video
          ref={(ref: Video) => {
            videoRefs.current[index] = ref;
          }}
          source={{ uri: item.uri }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={index === currentIndex}
          isLooping
          useNativeControls={false}
          volume={1.0}
          onError={(e) => console.error('Video error:', e)}
        />

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => handleSeek(index, 'backward')}
            style={styles.seekButton}
          >
            <Ionicons name="play-back" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSeek(index, 'forward')}
            style={styles.seekButton}
          >
            <Ionicons name="play-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Top Navbar */}
      <View style={styles.navbar}>
        {/* Repeated blocks for each nav item */}
        {[
          { label: 'Chats', icon: <Ionicons name="chatbubbles-outline" size={24} color="#fff" />, count: counts.chats, onPress: () => router.push('/chats') },
          { label: 'Meetings', icon: <MaterialIcons name="video-call" size={24} color="#fff" />, count: counts.meetings, onPress: () => console.log('Meetings') },
          { label: 'WhatsApp', icon: <FontAwesome5 name="whatsapp" size={24} color="#17db5f" />, count: counts.whatsapp, onPress: openWhatsAppCommunity },
          { label: 'Notifications', icon: <Ionicons name="notifications-outline" size={24} color="#fff" />, count: counts.alerts, onPress: () => console.log('Notifications') },
          { label: 'Calls', icon: <Feather name="phone-call" size={24} color="#0cee5f" />, count: counts.calls, onPress: () => console.log('Calls') },
        ].map((item, idx) => (
          <TouchableOpacity key={idx} onPress={item.onPress}>
            <View style={styles.navItem}>
              <View style={styles.iconContainer}>
                {item.icon}
                {item.count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.count}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.navLabel}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reels */}
      <FlatList
        data={reelsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Right-side action icons */}
      <View style={styles.actions}>
        <Image
          source={{ uri: reelsData[currentIndex].profilePic }}
          style={styles.profilePic}
        />
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(currentIndex)}>
          <Ionicons
            name={liked[currentIndex] ? 'heart' : 'heart-outline'}
            size={30}
            color={liked[currentIndex] ? 'red' : 'red'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={openComments}>
          <Ionicons name="chatbubble-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={openShareOptions}>
          <Ionicons name="share-social-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={saveVideo}>
          <Ionicons name="bookmark-outline" size={30} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal visible={commentModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Comments</Text>
            <Text>🔥 Great video! - John</Text>
            <Text>👏 Love it! - Sarah</Text>
            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={shareModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Share To</Text>
            <Text>📱 WhatsApp</Text>
            <Text>📘 Facebook</Text>
            <Text>📸 Instagram</Text>
            <TouchableOpacity onPress={() => setShareModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ✅ styles remain unchanged from your last version
// You can keep the styles object from your existing code exactly as it is


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(23, 121, 23, 0.93)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(158, 172, 158, 0.42)',
  },
  navItem: {
    alignItems: 'center',
  },

  navLabel: {
    marginTop: 2,
    fontSize: 10,
    color: '#fff',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'rgba(172, 52, 22, 0.76)',
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  videoContainer: {
    height,
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  actions: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(101, 130, 160, 0.54)',
    padding: '0.6%',
    borderRadius: '15px'
  },
  actionButton: {
    marginVertical: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seekButton: {
    padding: 10,
    backgroundColor: '#00000070',
    borderRadius: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalClose: {
    marginTop: 20,
    color: 'blue',
  },
});
