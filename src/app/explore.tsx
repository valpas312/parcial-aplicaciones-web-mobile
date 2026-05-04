import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, List, SegmentedButtons, Switch, Text } from 'react-native-paper';

export default function ExploreScreen() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [counter, setCounter] = useState(0);

  const summary = useMemo(
    () =>
      `Modo: ${themeMode === 'light' ? 'Claro' : 'Oscuro'} | Notificaciones: ${notifications ? 'ON' : 'OFF'} | Interacciones: ${counter}`,
    [themeMode, notifications, counter]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall">Configuración demo</Text>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Estados y hooks</Text>
          <Text variant="bodyMedium" style={styles.summary}>{summary}</Text>

          <SegmentedButtons
            value={themeMode}
            onValueChange={(value) => {
              setThemeMode(value as 'light' | 'dark');
              setCounter((prev) => prev + 1);
            }}
            buttons={[
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Oscuro' },
            ]}
          />

          <View style={styles.row}>
            <Text>Notificaciones</Text>
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
                setCounter((prev) => prev + 1);
              }}
            />
          </View>

          <Button mode="contained-tonal" onPress={() => setCounter(0)}>
            Reiniciar interacciones
          </Button>
        </Card.Content>
      </Card>

      <List.Section>
        <List.Subheader>Secciones</List.Subheader>
        <List.Item title="React Navigation" description="Navegación por tabs con Expo Router" left={(props) => <List.Icon {...props} icon="navigation" />} />
        <List.Item title="React Native Paper" description="Componentes Material y theming" left={(props) => <List.Icon {...props} icon="palette" />} />
        <List.Item title="Paginación + API" description="Consumo de Rick and Morty API en Home" left={(props) => <List.Icon {...props} icon="database" />} />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  summary: { marginVertical: 8 },
});
