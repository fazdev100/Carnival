import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, FlatList, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../hooks/useAppTheme';

const { width, height } = Dimensions.get('window');

const dummyVideos = [
  {
    id: '1',
    url: 'https://ik.imagekit.io/o0jxqanoq/celeb.mp4?tr=orig&updatedAt=1740050072430',
    title: 'Behind the Scenes: Celebrity Interview',
    likes: 15234,
    isLiked: false,
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
    isLiked: false,
    comments: [
      { id: '1', user: 'FoodLover', text: 'Gordon is the best! 👨‍🍳', likes: 67 },
      { id: '2', user: 'ChefJenny', text: 'Need that recipe!', likes: 34 }
    ],
    description: 'Join celebrity chef Gordon Ramsey as he shares his secret pasta recipe.',
    products: [
      { id: '3', name: 'Chefs Knife Set', price: '$299' }
    ]
  }
];

const dummyArticles = [
  {
    id: '1',
    brand: 'PEOPLE',
    title: 'Inside the Glamorous Life of Hollywood Celebrities',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop',
    category: 'Celebrity',
    readTime: '5 min read',
    type: 'article'
  },
  {
    id: '2',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'The Most Anticipated Movies of 2024',
    image: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=800&auto=format&fit=crop',
    category: 'Movies',
    readTime: '7 min read',
    type: 'article'
  },
  {
    id: '3',
    brand: 'INSTYLE',
    title: 'The Ultimate Guide to Fall Fashion 2024',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
    category: 'Fashion',
    readTime: '6 min read',
    type: 'article'
  },
  {
    id: '4',
    brand: 'BRIDES',
    title: 'Top Wedding Destinations for 2024',
    image: 'https://images.unsplash.com/photo-1521805103420-1f3b9c5c2a4f?w=800&auto=format&fit=crop',
    category: 'Weddings',
    readTime: '6 min read',
    type: 'article'
  }
];

const dummyPodcasts = [
  {
    id: '1',
    brand: 'PEOPLE',
    title: 'Inside the Glamorous Life of Hollywood Celebrities',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop',
    category: 'Celebrity',
    readTime: '5 min read',
    type: 'article'
  },
  {
    id: '2',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'The Most Anticipated Movies of 2024',
    image: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=800&auto=format&fit=crop',
    category: 'Movies',
    readTime: '7 min read',
    type: 'article'
  },
  {
    id: '3',
    brand: 'INSTYLE',
    title: 'The Ultimate Guide to Fall Fashion 2024',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
    category: 'Fashion',
    readTime: '6 min read',
    type: 'article'
  },
  {
    id: '4',
    brand: 'BRIDES',
    title: 'Top Wedding Destinations for 2024',
    image: 'https://images.unsplash.com/photo-1521805103420-1f3b9c5c2a4f?w=800&auto=format&fit=crop',
    category: 'Weddings',
    readTime: '6 min read',
    type: 'article'
  }
];

export default function DiscoverScreen() {
  const { colors, touchTargets, shadows } = useAppTheme();
  const [activeTab, setActiveTab] = useState('videos');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const bottomSheetModalRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState(dummyVideos);
  const videoRefs = useRef({});

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems?.[0]) {
      const newIndex = viewableItems[0].index;
      setActiveVideoIndex(newIndex);
      
      Object.entries(videoRefs.current).forEach(([id, ref]) => {
        if (id !== viewableItems[0].item.id) {
          ref?.pauseAsync();
        } else {
          ref?.playAsync();
        }
      });
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const handleLike = useCallback((videoId) => {
    setVideos(prevVideos => 
      prevVideos.map(video => {
        if (video.id === videoId) {
          return {
            ...video,
            likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            isLiked: !video.isLiked
          };
        }
        return video;
      })
    );
  }, []);

  const handleComment = useCallback((videoId) => {
    const video = videos.find(v => v.id === videoId);
    setSelectedVideo(video);
    bottomSheetModalRef.current?.present();
  }, [videos]);

  const submitComment = useCallback(() => {
    if (newComment.trim() && selectedVideo) {
      const newCommentObj = {
        id: Date.now().toString(),
        user: 'User',
        text: newComment,
        likes: 0
      };

      setVideos(prevVideos =>
        prevVideos.map(video => {
          if (video.id === selectedVideo.id) {
            return {
              ...video,
              comments: [...video.comments, newCommentObj]
            };
          }
          return video;
        })
      );

      setNewComment('');
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
      <View style={[styles.videoOverlay, { backgroundColor: colors.overlay.dark }]}>
        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.videoDescription, { color: colors.text }]}>{item.description}</Text>
        </View>
        <View style={styles.interactionButtons}>
          <TouchableOpacity 
            style={[styles.interactionButton, { minHeight: touchTargets.minimum }]}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={touchTargets.icon.large} 
              color={item.isLiked ? colors.interactive.primary : colors.icon.primary}
              style={styles.iconShadow}
            />
            <Text style={[styles.interactionText, { color: colors.text }]}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.interactionButton, { minHeight: touchTargets.minimum }]}
            onPress={() => handleComment(item.id)}
          >
            <Ionicons 
              name="chatbubble" 
              size={touchTargets.icon.medium} 
              color={colors.icon.primary}
              style={styles.iconShadow}
            />
            <Text style={[styles.interactionText, { color: colors.text }]}>{item.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.interactionButton, { minHeight: touchTargets.minimum }]}>
            <Ionicons 
              name="share-social" 
              size={touchTargets.icon.medium} 
              color={colors.icon.primary}
              style={styles.iconShadow}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [activeVideoIndex, handleLike, handleComment, colors, touchTargets]);

  const renderArticle = useCallback(({ item }) => (
    <View style={[styles.articleCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={[styles.articleTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.articleAuthor, { color: colors.textSecondary }]}>By {item.author}</Text>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleCategory, { color: colors.interactive.primary }]}>{item.category}</Text>
          <Text style={[styles.articleReadTime, { color: colors.textSecondary }]}>{item.readTime}</Text>
        </View>
      </View>
    </View>
  ), [colors]);

  const renderPodcast = useCallback(({ item }) => (
    <View style={[styles.podcastCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.coverImage }} style={styles.podcastCover} />
      <View style={styles.podcastContent}>
        <Text style={[styles.podcastTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.podcastHost, { color: colors.textSecondary }]}>Hosted by {item.host}</Text>
        <View style={styles.podcastMeta}>
          <Text style={[styles.podcastDuration, { color: colors.textSecondary }]}>{item.duration}</Text>
          <Text style={[styles.podcastEpisode, { color: colors.interactive.primary }]}>{item.latestEpisode}</Text>
        </View>
      </View>
    </View>
  ), [colors]);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>DISCOVER</Text>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('videos')}
              style={[
                styles.tab,
                activeTab === 'videos' && { backgroundColor: colors.interactive.primary },
                { minHeight: touchTargets.minimum }
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'videos' ? colors.text : colors.textSecondary }
              ]}>
                VIDEOS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('articles')}
              style={[
                styles.tab,
                activeTab === 'articles' && { backgroundColor: colors.interactive.primary },
                { minHeight: touchTargets.minimum }
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'articles' ? colors.text : colors.textSecondary }
              ]}>
                ARTICLES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('podcasts')}
              style={[
                styles.tab,
                activeTab === 'podcasts' && { backgroundColor: colors.interactive.primary },
                { minHeight: touchTargets.minimum }
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'podcasts' ? colors.text : colors.textSecondary }
              ]}>
                PODCASTS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'videos' && (
          <FlatList
            data={videos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id}
            pagingEnabled
            vertical
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}

        {activeTab === 'articles' && (
          <FlatList
            data={dummyArticles}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />
        )}

        {activeTab === 'podcasts' && (
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
          snapPoints={['50%']}
          enablePanDownToClose={true}
          backdropComponent={BottomSheetBackdrop}
          backgroundStyle={[styles.bottomSheet, { backgroundColor: colors.card }]}
        >
          <View style={styles.commentsContainer}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>COMMENTS</Text>
            <FlatList
              data={selectedVideo?.comments || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.commentItem, { backgroundColor: colors.interactive.background }]}>
                  <Text style={[styles.commentUser, { color: colors.text }]}>{item.user}</Text>
                  <Text style={[styles.commentText, { color: colors.textSecondary }]}>{item.text}</Text>
                  <View style={styles.commentMeta}>
                    <TouchableOpacity style={{ minHeight: touchTargets.minimum }}>
                      <Text style={[styles.commentLikes, { color: colors.textSecondary }]}>
                        {item.likes} likes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              style={styles.commentsList}
            />
            <View style={[styles.commentInput, { borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.interactive.background,
                  color: colors.text,
                  minHeight: touchTargets.minimum
                }]}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: colors.interactive.primary }]}
                onPress={submitComment}
              >
                <Text style={[styles.submitButtonText, { color: colors.text }]}>Post</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
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
  },
  videoInfo: {
    marginTop: 'auto',
    marginBottom: 100,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  videoDescription: {
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
    padding: 8,
  },
  interactionText: {
    marginTop: 4,
    fontSize: 12,
  },
  iconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  commentsList: {
    flex: 1,
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 15,
    padding: 10,
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
    justifyContent: 'flex-end',
  },
  commentLikes: {
    fontSize: 12,
  },
  commentInput: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  submitButton: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    minHeight: 44,
  },
  submitButtonText: {
    fontWeight: '600',
  },
  articleCard: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    fontSize: 14,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  articleReadTime: {
    fontSize: 12,
  },
  podcastCard: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastCover: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  podcastContent: {
    padding: 15,
  },
  podcastTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  podcastHost: {
    fontSize: 14,
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  podcastDuration: {
    fontSize: 12,
  },
  podcastEpisode: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  }
});