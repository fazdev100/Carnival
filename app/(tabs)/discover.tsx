import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, withSpring } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        image: 'https://shrigramorganics.com/wp-content/uploads/2022/06/61uUKflvFCS._SL1200_.jpg',
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
    url: 'https://ik.imagekit.io/o0jxqanoq/superman.mp4?updatedAt=1740132604953',
    title: 'Celebrity Fitness Routine with Superman',
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
    url: 'https://ik.imagekit.io/o0jxqanoq/fashion%20week.mp4?updatedAt=1740129675085',
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
  }
];

const dummyArticles = [
  {
    id: '1',
    brand: 'PEOPLE',
    title: 'Inside the Glamorous Life of Hollywood Celebrities',
    image: 'https://images.ottplay.com/images/top-hollywood-1737549209.jpg?impolicy=ottplay-202501_high&width=600',
    category: 'Celebrity',
    readTime: '5 min read',
    type: 'article'
  },
  {
    id: '2',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'The Most Anticipated Movies of 2025',
    image: 'https://variety.com/wp-content/uploads/2024/12/MixCollage-16-Dec-2024-06-05-PM-1297.jpg?w=1000&h=667&crop=1',
    category: 'Movies',
    readTime: '7 min read',
    type: 'article'
  },
  {
    id: '3',
    brand: 'INSTYLE',
    title: 'The Ultimate Guide to Fall Fashion 2025',
    image: 'https://s.globalsources.com/IMAGES/skc/20240206014947494744889',
    category: 'Fashion',
    readTime: '6 min read',
    type: 'article'
  },
  {
    id: '4',
    brand: 'BRIDES',
    title: 'Top Wedding Destinations for 2025',
    image: 'https://media.weddingz.in/images/0d7c76d728071819720d4c4d6a0d9764/best-luxury-wedding-venues-in-jodhpur-for-a-regal-wedding-ceremony.jpg',
    category: 'Weddings',
    readTime: '6 min read',
    type: 'article'
  }
];

const dummyPodcasts = [
  {
    id: '1',
    title: 'PEOPLE Every Day',
    host: 'Janine Rubenstein',
    image: 'https://people.com/thmb/Cp_C1k2RXtDZO9UfVJq-CKBl80g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(599x0:601x2):format(webp)/PE_collage_11322-331d6fab33cc4b42b020ddd71b6ca159.png',
    duration: '30 min',
    latestEpisode: 'Latest Celebrity News & Updates'
  },
  {
    id: '2',
    title: "EW's The Awardist",
    host: 'Gerrad Hall',
    image: 'https://ew.com/thmb/MxAimPjEWWCSBeIAHmDiepm24OA=/318x212/filters:no_upscale():max_bytes(150000):strip_icc()/The-Awardist-13d4aa52d521425385ad1b313caea8be.jpg',
    duration: '45 min',
    latestEpisode: 'Awards Season Coverage'
  },
  {
    id: '3',
    title: "InStyle's The Beauty Podcast",
    host: 'Kayla Greaves',
    image: 'https://i.scdn.co/image/ab67656300005f1fa488567ad62513458e2e44ce',
    duration: '25 min',
    latestEpisode: 'Beauty Trends & Tips'
  },
  {
    id: '4',
    title: 'Brides Wedding Podcast',
    host: 'Anna Price Olson',
    image: 'https://images.prismic.io/ddhomepage/OTEyMDJiN2YtMDM0ZS00YTdjLWE2M2YtN2JmMmZiMzBmMTEx_ab40515b-baa6-48ee-bab7-bf6c3eba60b6_maincrop-8a0cd8e5545f4ff7a2a2fc6fde7c023ccopy.jpeg?auto=compress,format&rect=119,0,1188,1425&w=570&h=684&fit=clip&cs=srgb&q=65',
    duration: '40 min',
    latestEpisode: 'Wedding Planning Tips'
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
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems?.[0]) {
      const newIndex = viewableItems[0].index;
      setActiveVideoIndex(newIndex);
      
      Object.entries(videoRefs.current).forEach(([id, ref]) => {
        if (ref) {
          ref.pauseAsync();
        }
      });
      
      setTimeout(() => {
        const currentRef = videoRefs.current[viewableItems[0].item.id];
        if (currentRef) {
          currentRef.playAsync();
        }
      }, 100);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 300,
  }).current;

  const handleVideoPress = useCallback((videoRef) => {
    if (videoRef) {
      videoRef.getStatusAsync().then((status) => {
        if (status.isPlaying) {
          videoRef.pauseAsync();
        } else {
          videoRef.playAsync();
        }
      });
    }
  }, []);

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
      <TouchableOpacity 
        activeOpacity={1}
        onPress={() => handleVideoPress(videoRefs.current[item.id])}
        style={StyleSheet.absoluteFill}
      >
        <Video
          ref={ref => videoRefs.current[item.id] = ref}
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={index === activeVideoIndex}
          isMuted={false}
        />
      </TouchableOpacity>
      
      <Animated.View 
        style={[styles.videoOverlay]}
        entering={FadeInUp.springify()}
      >
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.description}</Text>
          
          {item.products?.[0] && (
            <Animated.View 
              entering={FadeInUp.delay(300).springify()}
              style={styles.productCard}
            >
              <Image 
                source={{ uri: item.products[0].image }} 
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.products[0].name}</Text>
                <Text style={styles.productPrice}>{item.products[0].price}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
        
        <View style={styles.interactionButtons}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={() => handleLike(item.id)}
          >
            <View style={styles.iconBackground}>
              <Ionicons 
                name={item.isLiked ? "heart" : "heart-outline"} 
                size={32} 
                color={item.isLiked ? "#FF3B30" : "#FFFFFF"} 
              />
            </View>
            <Text style={styles.interactionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.interactionButton} 
            onPress={() => handleComment(item.id)}
          >
            <View style={styles.iconBackground}>
              <Ionicons name="chatbubble" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.interactionText}>{item.comments.length}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton}>
            <View style={styles.iconBackground}>
              <Ionicons name="share-social" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.interactionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.podcastCard]}>
      <View style={styles.podcastImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.podcastCover}
          resizeMode="cover"
        />
      </View>
      <View style={styles.podcastContent}>
        <Text style={styles.podcastTitle}>{item.title}</Text>
        <Text style={styles.podcastHost}>Hosted by {item.host}</Text>
        <View style={styles.podcastMeta}>
          <Text style={styles.podcastDuration}>{item.duration}</Text>
          <Text style={styles.podcastEpisode}>{item.latestEpisode}</Text>
        </View>
      </View>
    </Animated.View>
  ), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>DISCOVER</Text>
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
              snapToInterval={height - 140}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              getItemLayout={(data, index) => ({
                length: height - 140,
                offset: (height - 140) * index,
                index,
              })}
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
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
    backgroundColor: '#2A2A2A',
  },
  activeTab: {
    backgroundColor: '#E31837',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A0A0',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  podcastCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 120,
  },
  podcastImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#2A2A2A',
  },
  podcastCover: {
    width: '100%',
    height: '100%',
  },
  podcastContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  podcastHost: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'column',
  },
  podcastDuration: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  podcastEpisode: {
    color: '#A0A0A0',
    fontSize: 13,
  },
  videoContainer: {
    width: width,
    height: height - 140,
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
    paddingBottom: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    marginTop: 'auto',
    marginBottom: 20,
    paddingRight: 80,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  videoDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  interactionButtons: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
  },
  interactionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  interactionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E31837',
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#E31837',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
}
  )