import { Table } from 'move';

// `stagger` reveals the rows in sequence when the body mounts. It is off unless
// you ask for it: a table arrives with the page and so does everything else on
// it, and the call site is the only place that can see whether one more thing
// moving is welcome.
//
// The spacing is deliberately tight (12ms) because dense data should settle,
// not perform — it reads as one sweep down the table rather than as rows
// arriving one at a time. Enough rows here to actually see that; at five it is
// over before you notice it started. Pass an object to tune it.
const elements: Array<[string, string, number]> = [
  ['Hydrogen', 'H', 1.008],
  ['Helium', 'He', 4.003],
  ['Lithium', 'Li', 6.94],
  ['Beryllium', 'Be', 9.012],
  ['Boron', 'B', 10.81],
  ['Carbon', 'C', 12.011],
  ['Nitrogen', 'N', 14.007],
  ['Oxygen', 'O', 15.999],
  ['Fluorine', 'F', 18.998],
  ['Neon', 'Ne', 20.18],
  ['Sodium', 'Na', 22.99],
  ['Magnesium', 'Mg', 24.305],
  ['Aluminium', 'Al', 26.982],
  ['Silicon', 'Si', 28.085],
  ['Phosphorus', 'P', 30.974],
  ['Sulfur', 'S', 32.06],
  ['Chlorine', 'Cl', 35.45],
  ['Argon', 'Ar', 39.95],
  ['Potassium', 'K', 39.098],
  ['Calcium', 'Ca', 40.078],
  ['Scandium', 'Sc', 44.956],
  ['Titanium', 'Ti', 47.867],
  ['Vanadium', 'V', 50.942],
  ['Chromium', 'Cr', 51.996],
  ['Manganese', 'Mn', 54.938],
  ['Iron', 'Fe', 55.845],
  ['Cobalt', 'Co', 58.933],
  ['Nickel', 'Ni', 58.693],
  ['Copper', 'Cu', 63.546],
  ['Zinc', 'Zn', 65.38],
];

export default function RowRevealSample() {
  return (
    <Table size="sm" stagger>
      <Table.Header>
        <Table.Row>
          <Table.Head>Element</Table.Head>
          <Table.Head>Symbol</Table.Head>
          <Table.Head align="end">Atomic weight</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {elements.map(([name, symbol, weight]) => (
          <Table.Row key={symbol}>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{symbol}</Table.Cell>
            <Table.Cell align="end">{weight}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
