import { Div } from '@/components/Div';
import { Span } from '@/components/Span';
import { StyleSheet } from 'react-native';


export default function HomeScreen() {
  return (
    <Div style={styles.container}>
      <Span>سلام دنیا</Span>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
