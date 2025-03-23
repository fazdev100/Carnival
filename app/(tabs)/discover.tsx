import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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
      { 
        id: '1', 
        name: 'Professional Streaming Microphone',
        price: '$129.99',
        image: 'https://images.unsplash.com/photo-1610042143536-9f88a3df8fbc?w=800&auto=format&fit=crop',
        description: 'Studio-quality USB microphone for professional interviews and podcasting'
      }
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
      { 
        id: '1', 
        name: 'Professional Chef Knife Set',
        price: '$299.99',
        image: 'https://images.unsplash.com/photo-1593618998160-c4d5a436638b?w=800&auto=format&fit=crop',
        description: 'Premium 8-piece knife set used by professional chefs'
      }
    ]
  },
  {
    id: '3',
    url: 'https://ik.imagekit.io/o0jxqanoq/zendya%20makeup.mp4?updatedAt=1742724911930',
    title: 'Celebrity Makeup Tutorial',
    likes: 23456,
    isLiked: false,
    comments: [
      { id: '1', user: 'BeautyGuru', text: 'Love these products! 💄', likes: 89 },
      { id: '2', user: 'MakeupArtist', text: 'Perfect technique!', likes: 56 }
    ],
    description: 'Get the perfect Zendaya red carpet look with this celebrity makeup artist tutorial.',
    products: [
      {
        id: '1',
        name: 'Luxury Makeup Brush Set',
        price: '$149.99',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
        description: 'Professional 15-piece makeup brush set for flawless application'
      }
    ]
  },
  {
    id: '4',
    url: 'https://ik.imagekit.io/o0jxqanoq/workout.mp4?tr=orig&updatedAt=1740050923145',
    title: 'Celebrity Fitness Routine',
    likes: 19876,
    isLiked: false,
    comments: [
      { id: '1', user: 'FitnessFanatic', text: 'Great workout! 💪', likes: 78 },
      { id: '2', user: 'HealthyLife', text: 'Trying this tomorrow!', likes: 45 }
    ],
    description: 'Get fit with this celebrity trainer-approved workout routine.',
    products: [
      {
        id: '1',
        name: 'Smart Fitness Tracker',
        price: '$199.99',
        image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&auto=format&fit=crop',
        description: 'Advanced fitness tracker with heart rate monitoring and workout tracking'
      }
    ]
  },
  {
    id: '5',
    url: 'https://ik.imagekit.io/o0jxqanoq/fashion.mp4?tr=orig&updatedAt=1740051078912',
    title: 'Fashion Week Highlights',
    likes: 27654,
    isLiked: false,
    comments: [
      { id: '1', user: 'Fashionista', text: 'Stunning collection! 👗', likes: 92 },
      { id: '2', user: 'StyleIcon', text: 'Need everything!', likes: 67 }
    ],
    description: 'Exclusive behind-the-scenes look at Fashion Week.',
    products: [
      {
        id: '1',
        name: 'Designer Handbag',
        price: '$899.99',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
        description: 'Limited edition designer handbag from the latest collection'
      }
    ]
  },
  {
    id: '6',
    url: 'https://ik.imagekit.io/o0jxqanoq/music.mp4?tr=orig&updatedAt=1740051234567',
    title: 'Studio Session',
    likes: 31245,
    isLiked: false,
    comments: [
      { id: '1', user: 'MusicLover', text: 'Can\'t wait for the album! 🎵', likes: 88 },
      { id: '2', user: 'Producer', text: 'Those beats are fire!', likes: 59 }
    ],
    description: 'Exclusive studio session with top music producer.',
    products: [
      {
        id: '1',
        name: 'Professional Studio Headphones',
        price: '$349.99',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop',
        description: 'Studio-quality headphones used by professional musicians'
      }
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
      
      // Pause all videos except the active one
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
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={item.isLiked ? "#FF3B30" : "#FFFFFF"} 
            />
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
    <View style={[styles.articleCard, isDark && styles.articleCardDark]}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={[styles.articleTitle, isDark && styles.textDark]}>{item.title}</Text>
        <Text style={styles.articleAuthor}>By {item.author}</Text>
        <View style={styles.articleMeta}>
          <Text style={styles.articleCategory}>{item.category}</Text>
          <Text style={styles.articleReadTime}>{item.readTime}</Text>
        </View>
      </View>
    </View>
  ), [isDark]);

  const renderPodcast = useCallback(({ item }) => (
    <View style={[styles.podcastCard, isDark && styles.podcastCardDark]}>
      <Image source={{ uri: item.coverImage }} style={styles.podcastCover} />
      <View style={styles.podcastContent}>
        <Text style={[styles.podcastTitle, isDark && styles.textDark]}>{item.title}</Text>
        <Text style={styles.podcastHost}>Hosted by {item.host}</Text>
        <View style={styles.podcastMeta}>
          <Text style={styles.podcastDuration}>{item.duration}</Text>
          <Text style={styles.podcastEpisode}>{item.latestEpisode}</Text>
        </View>
      </View>
    </View>
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
              style={styles.commentsList}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
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
    backgroundColor: '#E31837',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
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
    fontSize: 12,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetDark: {
    backgroundColor: '#1C1C1E',
  },
  commentsContainer: {
    flex: 1,
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000000',
  },
  commentsList: {
    flex: 1,
    marginBottom: 10,
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
    fontSize: 14,
    marginBottom: 8,
  },
  commentMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commentLikes: {
    fontSize: 12,
    color: '#666666',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#E31837',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textDark: {
    color: '#FFFFFF',
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
    shadowRadius: 4,
    elevation: 3,
  },
  articleCardDark: {
    backgroundColor: '#1C1C1E',
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
    color: '#666666',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleCategory: {
    fontSize: 12,
    color: '#E31837',
    fontWeight: '600',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#666666',
  },
  podcastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastCardDark: {
    backgroundColor: '#1C1C1E',
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
    color: '#666666',
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  podcastDuration: {
    fontSize: 12,
    color: '#666666',
  },
  podcastEpisode: {
    fontSize: 12,
    color: '#E31837',
    fontWeight: '600',
  }
});