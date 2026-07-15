import { Code, Stack, Text } from 'move';

export default function InlineSample() {
  return (
    <Stack gap="sm">
      <Text>
        Set the brand colour with the <Code>--move-primary</Code> token and theme it via{' '}
        <Code>ThemeProvider</Code> at the root of your app.
      </Text>
      <Text>
        Run <Code>npm create move</Code> to scaffold a new project, or install with{' '}
        <Code>npm i move</Code> if you already have one.
      </Text>
      <Text>
        Press <Code>?</Code> anywhere in the docs to open the keyboard cheatsheet.
      </Text>
    </Stack>
  );
}
