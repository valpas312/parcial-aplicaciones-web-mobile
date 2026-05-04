import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Searchbar,
  Text,
} from 'react-native-paper';

import { Character, useCharacters } from '@/hooks/use-characters';

export default function HomeScreen() {
  const {
    characters,
    loading,
    error,
    page,
    pages,
    canGoNext,
    canGoPrevious,
    setPage,
    onSearch,
    query,
    reload,
  } = useCharacters();

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const statusColor = useMemo(() => {
    if (!selectedCharacter) return '#999';
    return selectedCharacter.status === 'Alive'
      ? '#24a148'
      : selectedCharacter.status === 'Dead'
        ? '#da1e28'
        : '#878d96';
  }, [selectedCharacter]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Rick & Morty Explorer
      </Text>
      <Searchbar
        placeholder="Buscar personaje"
        value={query}
        onChangeText={onSearch}
        style={styles.search}
      />

      {loading && <ActivityIndicator animating size="large" style={styles.loader} />}
      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
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
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => setSelectedCharacter(item)}>
            <Card.Title
              title={item.name}
              subtitle={`${item.species} • ${item.gender}`}
              left={() => <Avatar.Image source={{ uri: item.image }} size={52} />}
              right={() => (
                <IconButton icon={selectedCharacter?.id === item.id ? 'star' : 'star-outline'} />
              )}
            />
          </Card>
        )}
        ListEmptyComponent={!loading ? <Text>No se encontraron personajes.</Text> : null}
      />

      <View style={styles.pagination}>
        <Button mode="outlined" disabled={!canGoPrevious} onPress={() => setPage(page - 1)}>
          Anterior
        </Button>
        <Chip>{`Página ${page} de ${pages}`}</Chip>
        <Button mode="outlined" disabled={!canGoNext} onPress={() => setPage(page + 1)}>
          Siguiente
        </Button>
      </View>

      {selectedCharacter && (
        <Card mode="contained" style={styles.details}>
          <Card.Content>
            <Text variant="titleMedium">Detalle seleccionado</Text>
            <Text>{selectedCharacter.name}</Text>
            <Text>{`Ubicación: ${selectedCharacter.location.name}`}</Text>
            <Chip compact style={{ alignSelf: 'flex-start', backgroundColor: statusColor }} textStyle={{ color: 'white' }}>
              {selectedCharacter.status}
            </Chip>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontWeight: '700' },
  search: { marginBottom: 4 },
  loader: { marginTop: 12 },
  listContent: { paddingBottom: 12 },
  card: { marginVertical: 4 },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  details: { marginTop: 8 },
  errorCard: { marginBottom: 12 },
  retryButton: { marginTop: 10, alignSelf: 'flex-start' },
});
