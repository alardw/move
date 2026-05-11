import { Accordion } from 'move';

const faq = [
  {
    value: 'shipping',
    question: 'How long does shipping take?',
    answer:
      'Most orders ship within one business day. From there it’s 2–5 days to get to your door, depending on how aggressively the couriers are moving this week. Express options exist at checkout if the clock is louder than the budget.',
  },
  {
    value: 'returns',
    question: 'What’s the return policy?',
    answer:
      'You have 30 days from delivery to change your mind. Send the item back in the same condition you received it — still wearable, still readable, still edible — and we’ll refund the original payment method within a week. No restocking fees, no sad exit surveys.',
  },
  {
    value: 'tracking',
    question: 'Can I track my order?',
    answer:
      'Yes. The second it leaves our warehouse, we email a tracking link. You can watch it bounce across regional hubs, pause mysteriously for six hours in a town you’ve never heard of, and then finally hit your doorstep at exactly the moment you step into the shower.',
  },
  {
    value: 'gift',
    question: 'Do you wrap gifts?',
    answer:
      'We do, and we’re good at it — tissue paper, tied ribbon, no receipt in the box. Add a short note at checkout and we’ll write it out in handwriting that doesn’t look like it came from a bot.',
  },
];

export default function BasicSample() {
  return (
    <Accordion.Root type="single" collapsible defaultValue="shipping">
      {faq.map((it) => (
        <Accordion.Item key={it.value} value={it.value}>
          <Accordion.Header>
            <Accordion.Trigger>{it.question}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{it.answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
