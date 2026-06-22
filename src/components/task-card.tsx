import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';

import { AgendaTask } from '@/store/tasks-store';
import { formatCoordinates } from '@/utils/agenda';

const PLACEHOLDER = require('@/assets/images/icon.png');

type Props = {
  task: AgendaTask;
  onAttachPhoto?: () => void;
  onTakePhoto?: () => void;
  onAttachLocation?: () => void;
  onAttachContact?: () => void;
  onCreateCalendarEvent?: () => void;
};

export function TaskCard({ task, onAttachPhoto, onTakePhoto, onAttachLocation, onAttachContact, onCreateCalendarEvent }: Props) {
  return (
    <Card testID="task-card" style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Image source={task.imageUri ? { uri: task.imageUri } : PLACEHOLDER} style={styles.image} contentFit="cover" />
          <View style={styles.info}>
            <Text variant="titleMedium">{task.title}</Text>
            <Text variant="bodySmall">{task.notes ?? 'Sin notas'}</Text>
            <Text variant="bodySmall">Ubicación: {formatCoordinates(task.location)}</Text>
            <Text variant="bodySmall">Responsable: {task.contact?.name ?? 'Sin contacto'}</Text>
          </View>
        </View>
        <View style={styles.chips}>
          <Chip compact icon={task.imageUri ? 'check' : 'camera'}>{task.imageUri ? 'Foto' : 'Sin foto'}</Chip>
          <Chip compact icon={task.location ? 'map-marker-check' : 'map-marker'}>{task.location ? 'GPS' : 'Ubicación'}</Chip>
          <Chip compact icon={task.contact ? 'account-check' : 'account'}>{task.contact ? 'Contacto' : 'Responsable'}</Chip>
          <Chip compact icon={task.calendarEventId ? 'calendar-check' : 'calendar'}>{task.calendarEventId ? 'Calendario' : 'Evento'}</Chip>
        </View>
        <View style={styles.actions}>
          <Button onPress={onTakePhoto}>Cámara</Button>
          <Button onPress={onAttachPhoto}>Galería</Button>
          <Button onPress={onAttachLocation}>GPS</Button>
          <Button onPress={onAttachContact}>Contacto</Button>
          <Button onPress={onCreateCalendarEvent}>Calendario</Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 8 },
  content: { gap: 10 },
  row: { flexDirection: 'row', gap: 12 },
  image: { width: 76, height: 76, borderRadius: 16, backgroundColor: '#eee' },
  info: { flex: 1, gap: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
