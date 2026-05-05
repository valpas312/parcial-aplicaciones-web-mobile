import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Character, useCharacters } from '@/hooks/use-characters';

const IMAGE_PLACEHOLDER = require('@/assets/images/icon.png');

export default function HomeScreen() {
  const theme = useTheme();
  const {
    characters,
    loading,
    error,
    page,
    pages,
    canGoNext,
    canGoPrevious,
    onSearch,
    goToNextPage,
    goToPreviousPage,
    query,
    reload,
  } = useCharacters();

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (selectedCharacter && !characters.some((character) => character.id === selectedCharacter.id)) {
      setSelectedCharacter(null);
    }
  }, [characters, selectedCharacter]);

  const statusColor = useMemo(() => {
    if (!selectedCharacter) return theme.colors.outline;
    return selectedCharacter.status === 'Alive'
      ? '#24a148'
      : selectedCharacter.status === 'Dead'
        ? '#da1e28'
        : '#878d96';
  }, [selectedCharacter, theme.colors.outline]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Rick & Morty Explorer
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Busca personajes, navega por páginas y revisa su estado actual.
          </Text>
        </View>

        <Searchbar
          placeholder="Buscar personaje"
          value={query}
          onChangeText={onSearch}
          autoCorrect={false}
          style={styles.search}
        />

        {error && (
          <Card style={styles.errorCard}>
            <Card.Content style={styles.errorContent}>
              <Text variant="titleSmall">No pudimos cargar los personajes</Text>
              <Text variant="bodyMedium">{error}</Text>
              <Button mode="contained" onPress={reload} style={styles.retryButton}>
                Reintentar
              </Button>
            </Card.Content>
          </Card>
        )}

        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedCharacter?.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Divider}
          renderItem={({ item }) => {
            const selected = selectedCharacter?.id === item.id;

            return (
              <Card
                mode={selected ? 'elevated' : 'contained'}
                style={[styles.card, selected && styles.selectedCard]}
                onPress={() => setSelectedCharacter(item)}>
                <Card.Content style={styles.characterRow}>
                  <Image
                    source={{ uri: item.image }}
                    placeholder={IMAGE_PLACEHOLDER}
                    contentFit="cover"
                    transition={150}
                    cachePolicy="disk"
                    style={styles.avatar}
                  />
                  <View style={styles.characterInfo}>
                    <Text variant="titleMedium" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.species} • {item.gender}
                    </Text>
                    <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.location.name}
                    </Text>
                  </View>
                  <IconButton icon={selected ? 'star' : 'star-outline'} selected={selected} />
                </Card.Content>
              </Card>
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <Card mode="contained" style={styles.emptyCard}>
                <Card.Content>
                  <Text>No se encontraron personajes.</Text>
                </Card.Content>
              </Card>
            ) : null
          }
          ListFooterComponent={loading ? <ActivityIndicator animating size="large" style={styles.loader} /> : null}
        />

        <View style={[styles.pagination, { backgroundColor: theme.colors.elevation.level2 }]}>
          <Button mode="outlined" disabled={!canGoPrevious} onPress={goToPreviousPage} compact>
            Anterior
          </Button>
          <Chip compact>{`Página ${page} de ${pages}`}</Chip>
          <Button mode="outlined" disabled={!canGoNext} onPress={goToNextPage} compact>
            Siguiente
          </Button>
        </View>

        {selectedCharacter && (
          <Card mode="contained" style={styles.details}>
            <Card.Content style={styles.detailContent}>
              <View style={styles.detailHeader}>
                <Text variant="titleMedium">Detalle seleccionado</Text>
                <Chip compact style={{ backgroundColor: statusColor }} textStyle={{ color: 'white' }}>
                  {selectedCharacter.status}
                </Chip>
              </View>
              <Text>{selectedCharacter.name}</Text>
              <Text>{`Ubicación: ${selectedCharacter.location.name}`}</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  header: { gap: 4 },
  title: { fontWeight: '800' },
  search: { marginBottom: 2 },
  loader: { marginTop: 16 },
  listContent: { flexGrow: 1, paddingBottom: 12 },
  card: { marginVertical: 6 },
  selectedCard: { borderWidth: 1, borderColor: '#6750a4' },
  characterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#e7e0ec' },
  characterInfo: { flex: 1, minWidth: 0, gap: 2 },
  pagination: {
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  details: { marginTop: 2 },
  detailContent: { gap: 4 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  errorCard: { marginBottom: 4 },
  errorContent: { gap: 6 },
  retryButton: { marginTop: 4, alignSelf: 'flex-start' },
  emptyCard: { marginTop: 12 },
});
