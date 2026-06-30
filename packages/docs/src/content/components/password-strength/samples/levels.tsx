import { PasswordStrength, Stack, Text } from 'move';

export default function LevelsSample() {
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <Text size="sm" weight="medium">Four levels (default)</Text>
        {[0, 1, 2, 3].map((score) => (
          <PasswordStrength key={score} score={score} />
        ))}
      </Stack>

      <Stack gap="sm">
        <Text size="sm" weight="medium">Five levels — match a zxcvbn 0–4 score</Text>
        {[0, 1, 2, 3, 4].map((score) => (
          <PasswordStrength
            key={score}
            levels={5}
            score={score}
            labels={{ levels: ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'] }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
