import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get('window');

const dummyVideos = [
  {
    id: '1',
    url: 'https://ik.imagekit.io/o0jxqanoq/celeb.mp4?tr=orig&updatedAt=1740050072430',
    title: 'Behind the Scenes: Celebrity Interview',
    likes: 15234,
    comments: [
      { id: '1', user: 'Sarah', text: 'This is amazing! 🌟', likes: 45 },
      { id: '2', user: 'Mike', text: 'Great interview!', likes: 23 }
    ],
    description: 'Exclusive interview with the stars of the upcoming summer blockbuster.',
    products: [
      { id: '1', name: 'Camera Setup', price: '$2,499' }
    ]
  },
  {
    id: '2',
    url: 'https://ik.imagekit.io/o0jxqanoq/gordonramsey.mp4?tr=orig&updatedAt=1740050564823',
    title: 'Cooking with Stars',
    likes: 8567,
    comments: [
      { id: '1', user: 'FoodLover', text: 'Gordon is the best! 👨‍🍳', likes: 67 },
      { id: '2', user: 'ChefJenny', text: 'Need that recipe!', likes: 34 }
    ],
    description: 'Join celebrity chef Gordon Ramsey as he shares her secret pasta recipe.',
    products: [
      { id: '3', name: 'Chef\'s Knife Set', price: '$299' }
    ]
  },
  // ... other videos remain the same
];

const dummyArticles = [
  {
    id: '1',
    title: 'The Future of Entertainment',
    author: 'Emily Johnson',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
    readTime: '5 min read',
    category: 'Entertainment',
    content: 'Exploring how streaming platforms are revolutionizing content consumption...'
  },
  {
    id: '2',
    title: 'Rising Stars of 2024',
    author: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1518929458122-f8f71460f313?w=800',
    readTime: '7 min read',
    category: 'Celebrity',
    content: 'Meet the new faces taking Hollywood by storm...'
  },
  // Add more articles...
];

const dummyPodcasts = [
  {
    id: '1',
    title: 'Celebrity Insider',
    host: 'Amanda Brooks',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    duration: '45 min',
    latestEpisode: 'Episode 156: Hollywood Secrets Revealed'
  },
  {
    id: '2',
    title: 'The Entertainment Hour',
    host: 'David Martinez',
    coverImage: 'https://images.unsplash.com/photo-1516223725307-6f76b9182f7c?w=800',
    duration: '60 min',
    latestEpisode: 'Episode 89: Behind the Scenes of Award Season'
  },
  // Add more podcasts...
];

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('videos');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const bottomSheetModalRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRefs = useRef({});

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        itemVisiblePercentThreshold: 50
      },
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems?.[0]) {
          const newIndex = viewableItems[0].index;
          setActiveVideoIndex(newIndex);
          
          // Pause all videos except the active one
          Object.entries(videoRefs.current).forEach(([id, ref]) => {
            if (id !== viewableItems[0].item.id) {
              ref?.pauseAsync();
            } else {
              ref?.playAsync();
            }
          });
        }
      }
    }
  ]);

  const handleLike = useCallback((videoId) => {
    // Update likes count (in a real app, this would be connected to a backend)
    const updatedVideos = dummyVideos.map(video => {
      if (video.id === videoId) {
        return { ...video, likes: video.likes + 1 };
      }
      return video;
    });
    // Update state
  }, []);

  const handleComment = useCallback((videoId) => {
    setSelectedVideo(dummyVideos.find(v => v.id === videoId));
    bottomSheetModalRef.current?.present();
  }, []);

  const submitComment = useCallback(() => {
    if (newComment.trim() && selectedVideo) {
      // Add comment (in a real app, this would be connected to a backend)
      const comment = {
        id: Date.now().toString(),
        user: 'User',
        text: newComment,
        likes: 0
      };
      selectedVideo.comments.push(comment);
      setNewComment('');
      // Optional: close comment sheet
      // bottomSheetModalRef.current?.dismiss();
    }
  }, [newComment, selectedVideo]);

  const renderVideo = useCallback(({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        ref={ref => videoRefs.current[item.id] = ref}
        source={{ uri: item.url }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay={index === activeVideoIndex}
        isMuted={false}
      />
      <View style={styles.videoOverlay}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.description}</Text>
        </View>
        <View style={styles.interactionButtons}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons name="heart" size={28} color="#FF3B30" />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.interactionButton} 
            onPress={() => handleComment(item.id)}
          >
            <Ionicons name="chatbubble" size={26} color="#FFFFFF" />
            <Text style={styles.interactionText}>{item.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="share-social" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [activeVideoIndex, handleLike, handleComment]);

  const renderArticle = useCallback(({ item }) => (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.articleCard, isDark && styles.articleCardDark]}
    >
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={[styles.articleTitle, isDark && styles.textDark]}>{item.title}</Text>
        <Text style={styles.articleAuthor}>By {item.author}</Text>
        <View style={styles.articleMeta}>
          <Text style={styles.articleCategory}>{item.category}</Text>
          <Text style={styles.articleReadTime}>{item.readTime}</Text>
        </View>
      </View>
    </Animated.View>
  ), [isDark]);

  const renderPodcast = useCallback(({ item }) => (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.podcastCard, isDark && styles.podcastCardDark]}
    >
      <Image source={{ uri: item.coverImage }} style={styles.podcastCover} />
      <View style={styles.podcastContent}>
        <Text style={[styles.podcastTitle, isDark && styles.textDark]}>{item.title}</Text>
        <Text style={styles.podcastHost}>Hosted by {item.host}</Text>
        <View style={styles.podcastMeta}>
          <Text style={styles.podcastDuration}>{item.duration}</Text>
          <Text style={styles.podcastEpisode}>{item.latestEpisode}</Text>
        </View>
      </View>
    </Animated.View>
  ), [isDark]);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>DISCOVER</Text>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('videos')}
              style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
                VIDEOS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('articles')}
              style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>
                ARTICLES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('podcasts')}
              style={[styles.tab, activeTab === 'podcasts' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'podcasts' && styles.activeTabText]}>
                PODCASTS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'videos' ? (
          <FlatList
            data={dummyVideos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id}
            pagingEnabled
            vertical
            showsVerticalScrollIndicator={false}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          />
        ) : activeTab === 'articles' ? (
          <FlatList
            data={dummyArticles}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />
        ) : (
          <FlatList
            data={dummyPodcasts}
            renderItem={renderPodcast}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />
        )}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['50%', '90%']}
          backdropComponent={BottomSheetBackdrop}
          backgroundStyle={[styles.bottomSheet, isDark && styles.bottomSheetDark]}
        >
          <View style={styles.commentsContainer}>
            <Text style={[styles.commentsTitle, isDark && styles.textDark]}>COMMENTS</Text>
            <FlatList
              data={selectedVideo?.comments || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <View style={styles.commentMeta}>
                    <TouchableOpacity>
                      <Text style={styles.commentLikes}>{item.likes} likes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View style={styles.commentInput}>
              <TextInput
                style={styles.input}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={submitComment}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#FF3B30',
  },
  tabText: {
    color: '#666666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    marginTop: 'auto',
    marginBottom: 100,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  interactionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  interactionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  interactionText: {
    color: '#FFFFFF',
    marginTop: 4,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
  },
  bottomSheetDark: {
    backgroundColor: '#1A1A1A',
  },
  commentsContainer: {
    flex: 1,
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  commentItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  commentUser: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    marginBottom: 4,
  },
  commentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentLikes: {
    color: '#666666',
    fontSize: 12,
  },
  commentInput: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: 10,
  },
  submitButton: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  articleCardDark: {
    backgroundColor: '#2A2A2A',
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  articleAuthor: {
    color: '#666666',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleCategory: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  articleReadTime: {
    color: '#666666',
  },
  podcastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  podcastCardDark: {
    backgroundColor: '#2A2A2A',
  },
  podcastCover: {
    width: 100,
    height: 100,
  },
  podcastContent: {
    flex: 1,
    padding: 15,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  podcastHost: {
    color: '#666666',
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'column',
  },
  podcastDuration: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  podcastEpisode: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
  textDark: {
    color: '#FFFFFF',
  },
});