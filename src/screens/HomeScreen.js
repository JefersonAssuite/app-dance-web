
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { supabase, fetchPaginatedVideos } from '../config/supabase';
import VideoCard from '../components/VideoCard';

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    hasMore: false
  });

  const fetchVideos = useCallback(async (page = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const result = await fetchPaginatedVideos(page);
      
      setVideos(prev => shouldAppend ? [...prev, ...result.videos] : result.videos);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.hasMore
      });
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos(1, false);
  }, [fetchVideos]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchVideos(pagination.currentPage + 1, true);
    }
  }, [pagination.hasMore, pagination.currentPage, loading, fetchVideos]);

  useEffect(() => {
    fetchVideos(1, false);
  }, [fetchVideos]);

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;
