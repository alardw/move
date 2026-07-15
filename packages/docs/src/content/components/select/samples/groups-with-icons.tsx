import { useState } from 'react';
import { Select, Icon } from 'move';

interface FileTypeOption {
  value: string;
  label: string;
  icon: string;
  group: 'Documents' | 'Code' | 'Media';
}

const fileTypes: FileTypeOption[] = [
  { value: 'txt', label: 'Text documents', icon: 'file-text', group: 'Documents' },
  { value: 'pdf', label: 'PDF documents', icon: 'file', group: 'Documents' },
  { value: 'spreadsheet', label: 'Spreadsheets', icon: 'table-2', group: 'Documents' },
  { value: 'code', label: 'Source code files', icon: 'file-code', group: 'Code' },
  { value: 'json', label: 'JSON data', icon: 'braces', group: 'Code' },
  { value: 'image', label: 'Images', icon: 'image', group: 'Media' },
  { value: 'video', label: 'Videos', icon: 'video', group: 'Media' },
  { value: 'audio', label: 'Audio files', icon: 'music', group: 'Media' },
];
const groups = ['Documents', 'Code', 'Media'] as const;

export default function GroupsWithIconsSample() {
  const [value, setValue] = useState('pdf');
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger aria-label="File type">
        <Select.Value placeholder="Pick a file type" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {groups.map((group, i) => (
            <Select.Group key={group}>
              {i > 0 && <Select.Separator />}
              <Select.Label>{group}</Select.Label>
              {fileTypes.filter((f) => f.group === group).map((f) => (
                <Select.Item key={f.value} value={f.value}>
                  <Icon name={f.icon} />{f.label}
                </Select.Item>
              ))}
            </Select.Group>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}
