import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Div } from '@/components/Elements/Div';
import { Span } from '@/components/Elements/Span';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Div style={styles.container}>
        <Span type="title">This screen does not exist.</Span>
        <Link href="/" style={styles.link}>
          <Span type="link">Go to home screen!</Span>
        </Link>
      </Div>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
