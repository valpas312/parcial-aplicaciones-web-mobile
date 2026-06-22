import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { TaskCard } from '../task-card';

jest.mock('expo-image', () => ({ Image: 'Image' }));

describe('TaskCard', () => {
  it('renders task data and responds to actions', () => {
    const onAttachLocation = jest.fn();
    const { getByText } = render(
      <TaskCard
        task={{ id: '1', title: 'Comprar materiales', dueDate: new Date().toISOString(), contact: { name: 'Ada' } }}
        onAttachLocation={onAttachLocation}
      />
    );

    expect(getByText('Comprar materiales')).toBeTruthy();
    expect(getByText('Responsable: Ada')).toBeTruthy();
    fireEvent.press(getByText('GPS'));
    expect(onAttachLocation).toHaveBeenCalledTimes(1);
  });
});
