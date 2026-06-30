import { useState } from 'react';
import { Password, PasswordStrength, Stack } from 'move';

export default function BasicSample() {
  const [value, setValue] = useState('');
  return (
    <Stack gap="md">
      <Password
        placeholder="Enter a password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <PasswordStrength value={value} />
    </Stack>
  );
}
