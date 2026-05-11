import { useState } from 'react';
import { RadioGroup, Stack, Text } from 'move';

export default function BasicSample() {
  const [plan, setPlan] = useState('pro');
  return (
    <Stack gap="sm" align="start">
      <RadioGroup.Root value={plan} onValueChange={setPlan}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro — €12/mo</RadioGroup.Item>
        <RadioGroup.Item value="team">Team — €25/seat/mo</RadioGroup.Item>
      </RadioGroup.Root>
      <Text size="sm" color="muted">selected: {plan}</Text>
    </Stack>
  );
}
