import { useState } from 'react';
import { PinInput, Stack, Text } from 'move';

export default function BasicSample() {
  const [otp, setOtp] = useState('');
  return (
    <Stack gap="sm" align="start">
      <PinInput length={6} value={otp} onChange={setOtp} />
      <Text size="sm" color="muted">{otp ? `value: ${otp}` : 'Type a 6-digit code'}</Text>
    </Stack>
  );
}
