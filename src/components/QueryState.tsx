import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

type QueryStateProps<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | null | undefined;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  children: (data: T) => ReactNode;
};

export function QueryState<T>({
  isLoading,
  isError,
  data,
  isEmpty,
  onRetry,
  emptyTitle = 'Nada por aqui',
  emptyDescription,
  errorTitle = 'Não foi possível carregar',
  children,
}: QueryStateProps<T>) {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.greenPrimary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <EmptyState title={errorTitle} description="Verifique sua conexão e tente novamente." icon="wifi-off" />
        {onRetry ? <Button label="Tentar novamente" variant="secondary" onPress={onRetry} style={styles.retryButton} /> : null}
      </View>
    );
  }

  if (data == null || (isEmpty && isEmpty(data))) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return <>{children(data)}</>;
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  retryButton: { marginTop: spacing.md, alignSelf: 'stretch' },
});
