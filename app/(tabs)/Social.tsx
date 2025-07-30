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
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
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

      // Auto play current video, pause others
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

  const router = useRouter();

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
        // On blur: pause all videos
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
          resizeMode={ResizeMode.COVER} // ✅ Correct usage
          shouldPlay={index === currentIndex}
          isLooping
          useNativeControls={false}
          volume={1.0}
          onError={(e) => console.error('Video error:', e)}
        />

        {/* Rewind & Forward Buttons */}
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
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/chats')}>
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Meetings')}>
          <MaterialIcons name="video-call" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openWhatsAppCommunity}>
          <FontAwesome name="whatsapp" size={24} color="#17db5f" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Reels List */}
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

      {/* Right Action Icons */}
      <View style={styles.actions}>
        <Image
          source={{ uri: reelsData[currentIndex].profilePic }}
          style={styles.profilePic}
        />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(currentIndex)}
        >
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

      {/* Comment Modal */}
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

      {/* Share Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(13, 69, 221, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
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
    backgroundColor: 'rgba(83, 103, 122, 0.4)',
    padding: '0.5%',
    borderRadius: '10px'
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
