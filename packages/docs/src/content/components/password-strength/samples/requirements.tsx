import { useState } from 'react';
import { Password, PasswordStrength, Stack } from 'move';

export default function RequirementsSample() {
  const [value, setValue] = useState('');

  // You own the rules — compute `met` however you like.
  const requirements = [
    { label: 'At least 8 characters', met: value.length >= 8 },
    { label: 'An uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'A number', met: /\d/.test(value) },
    { label: 'A symbol', met: /[^A-Za-z0-9]/.test(value) },
  ];

  return (
    <Stack gap="md">
      <Password
        placeholder="Enter a password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <PasswordStrength value={value} />
      <PasswordStrength.Requirements requirements={requirements} />
    </Stack>
  );
}
