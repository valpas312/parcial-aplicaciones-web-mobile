import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskCard } from '@/components/task-card';
import { AgendaTask, PermissionState, useTasksStore } from '@/store/tasks-store';
import { permissionMessage } from '@/utils/agenda';

const permissionFromStatus = (status: string): PermissionState => (status === 'granted' ? 'granted' : 'denied');

export default function HomeScreen() {
  const theme = useTheme();
  const tasks = useTasksStore((state) => state.tasks);
  const addTask = useTasksStore((state) => state.addTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const [title, setTitle] = useState('');
  const [permissions, setPermissions] = useState<Record<string, PermissionState>>({
    cámara: 'pending', galería: 'pending', ubicación: 'pending', contactos: 'pending', calendario: 'pending',
  });

  const permissionSummary = useMemo(
    () => Object.entries(permissions).map(([resource, state]) => permissionMessage(resource, state)).join('\n'),
    [permissions]
  );

  const setPermission = (resource: string, state: PermissionState) => setPermissions((prev) => ({ ...prev, [resource]: state }));

  const showDenied = (resource: string) => Alert.alert('Permiso rechazado', permissionMessage(resource, 'denied'));

  const createTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, notes: 'Recordatorio creado desde la agenda', dueDate: new Date(Date.now() + 60 * 60 * 1000).toISOString() });
    setTitle('');
  };

  const attachPhoto = async (task: AgendaTask, source: 'camera' | 'gallery') => {
    const resource = source === 'camera' ? 'cámara' : 'galería';
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    const state = permissionFromStatus(permission.status);
    setPermission(resource, state);
    if (state !== 'granted') return showDenied(resource);
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) updateTask(task.id, { imageUri: result.assets[0]?.uri });
  };

  const attachLocation = async (task: AgendaTask) => {
    const permission = await Location.requestForegroundPermissionsAsync();
    const state = permissionFromStatus(permission.status);
    setPermission('ubicación', state);
    if (state !== 'granted') return showDenied('ubicación');
    const current = await Location.getCurrentPositionAsync({});
    const [address] = await Location.reverseGeocodeAsync(current.coords).catch(() => []);
    updateTask(task.id, {
      location: {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        label: address ? `${address.street ?? ''} ${address.city ?? ''}`.trim() : undefined,
      },
    });
  };

  const attachContact = async (task: AgendaTask) => {
    const permission = await Contacts.requestPermissionsAsync();
    const state = permissionFromStatus(permission.status);
    setPermission('contactos', state);
    if (state !== 'granted') return showDenied('contactos');
    const result = await Contacts.presentContactPickerAsync();
    if (result) updateTask(task.id, { contact: { id: result.id, name: result.name, phone: result.phoneNumbers?.[0]?.number, email: result.emails?.[0]?.email } });
  };

  const createCalendarEvent = async (task: AgendaTask) => {
    const permission = await Calendar.requestCalendarPermissionsAsync();
    const state = permissionFromStatus(permission.status);
    setPermission('calendario', state);
    if (state !== 'granted') return showDenied('calendario');
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const calendar = calendars.find((item) => item.allowsModifications) ?? calendars[0];
    if (!calendar) return Alert.alert('Calendario no disponible', 'No se encontró un calendario editable en el dispositivo.');
    const startDate = new Date(task.dueDate);
    const eventId = await Calendar.createEventAsync(calendar.id, {
      title: task.title,
      notes: `${task.notes ?? ''}\nResponsable: ${task.contact?.name ?? 'Sin contacto'}`,
      location: task.location?.label ?? (task.location ? `${task.location.latitude}, ${task.location.longitude}` : undefined),
      startDate,
      endDate: new Date(startDate.getTime() + 60 * 60 * 1000),
      timeZone: Platform.OS === 'ios' ? undefined : 'UTC',
    });
    updateTask(task.id, { calendarEventId: eventId });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Agenda / Recordatorios</Text>
        <Text variant="bodyMedium">Adjunta foto, ubicación GPS, responsable y evento del calendario a cada tarea.</Text>
        <Card mode="contained"><Card.Content style={styles.form}>
          <TextInput label="Nueva tarea" value={title} onChangeText={setTitle} />
          <Button mode="contained" onPress={createTask}>Agregar tarea</Button>
          <Text variant="bodySmall">{permissionSummary}</Text>
        </Card.Content></Card>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskCard task={item} onTakePhoto={() => attachPhoto(item, 'camera')} onAttachPhoto={() => attachPhoto(item, 'gallery')} onAttachLocation={() => attachLocation(item)} onAttachContact={() => attachContact(item)} onCreateCalendarEvent={() => createCalendarEvent(item)} />}
          ListEmptyComponent={<Text>No hay tareas cargadas.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontWeight: '800' },
  form: { gap: 10 },
});
