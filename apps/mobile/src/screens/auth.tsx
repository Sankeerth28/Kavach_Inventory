import { APP_NAME } from '@kavach/shared';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { errorMessage } from '../lib/api';
import { useSession } from '../lib/session';
import { Banner, Button, Field, styles } from '../ui';

export function LoginScreen() {
  const session = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await session.login(identifier.trim(), password);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.body, { paddingTop: 48 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { fontSize: 32 }]}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>Sign in to manage your store.</Text>
        <View style={{ height: 12 }} />
        <Field
          label="Mobile number or e-mail"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="username"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          onSubmitEditing={() => void submit()}
        />
        {error ? <Banner>{error}</Banner> : null}
        <Button
          label="Sign in"
          big
          busy={busy}
          disabled={!identifier.trim() || !password}
          onPress={() => void submit()}
        />
        <Text style={styles.hint}>Forgot your password? Ask your Project Admin to reset it.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** First login: the password set by the admin must be changed (DECISIONS Q36). */
export function ChangePasswordScreen() {
  const session = useSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mismatch = again.length > 0 && next !== again;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await session.changePassword(current, next);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.body, { paddingTop: 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Choose a new password</Text>
        <Text style={styles.subtitle}>
          You must change the password you were given before you continue.
        </Text>
        <Field label="Current password" value={current} onChangeText={setCurrent} secureTextEntry />
        <Field
          label="New password"
          value={next}
          onChangeText={setNext}
          secureTextEntry
          hint="At least 8 characters, with a letter and a number."
        />
        <Field
          label="New password again"
          value={again}
          onChangeText={setAgain}
          secureTextEntry
          warn={mismatch}
          hint={mismatch ? 'The two passwords do not match.' : undefined}
        />
        {error ? <Banner>{error}</Banner> : null}
        <Button
          label="Change password"
          big
          busy={busy}
          disabled={!current || next.length < 8 || next !== again}
          onPress={() => void submit()}
        />
        <Button label="Sign out" variant="ghost" onPress={() => void session.logout()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
