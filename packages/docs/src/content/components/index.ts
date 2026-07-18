import type { ComponentContent } from './types';
import { content as accordion } from './accordion';
import { content as align } from './align';
import { content as alert } from './alert';
import { content as animatedText } from './animated-text';
import { content as audioPlayer } from './audio-player';
import { content as autocomplete } from './autocomplete';
import { content as avatar } from './avatar';
import { content as badge } from './badge';
import { content as breadcrumb } from './breadcrumb';
import { content as button } from './button';
import { content as calendar } from './calendar';
import { content as calendarView } from './calendar-view';
import { content as card } from './card';
import { content as carousel } from './carousel';
import { content as chatBubble } from './chat-bubble';
import { content as checkbox } from './checkbox';
import { content as code } from './code';
import { content as collapsible } from './collapsible';
import { content as colorInput } from './color-input';
import { content as colorPicker } from './color-picker';
import { content as datePicker } from './date-picker';
import { content as dialog } from './dialog';
import { content as divider } from './divider';
import { content as drawer } from './drawer';
import { content as dropdown } from './dropdown';
import { content as emptyState } from './empty-state';
import { content as fileUpload } from './file-upload';
import { content as formField } from './form-field';
import { content as grid } from './grid';
import { content as heading } from './heading';
import { content as layoutGroup } from './layout-group';
import { content as image } from './image';
import { content as inputRange } from './input-range';
import { content as inputText } from './input-text';
import { content as label } from './label';
import { content as link } from './link';
import { content as list } from './list';
import { content as markerList } from './marker-list';
import { content as loader } from './loader';
import { content as numberInput } from './number-input';
import { content as pagination } from './pagination';
import { content as password } from './password';
import { content as passwordStrength } from './password-strength';
import { content as pinInput } from './pin-input';
import { content as popover } from './popover';
import { content as progressBar } from './progress-bar';
import { content as prose } from './prose';
import { content as quote } from './quote';
import { content as radioGroup } from './radio-group';
import { content as richTextEditor } from './rich-text-editor';
import { content as scrollArea } from './scroll-area';
import { content as select } from './select';
import { content as sidebar } from './sidebar';
import { content as skeleton } from './skeleton';
import { content as splitter } from './splitter';
import { content as stack } from './stack';
import { content as stepper } from './stepper';
import { content as switchContent } from './switch';
import { content as table } from './table';
import { content as tableOfContents } from './table-of-contents';
import { content as tabs } from './tabs';
import { content as text } from './text';
import { content as textarea } from './textarea';
import { content as timeField } from './time-field';
import { content as timeline } from './timeline';
import { content as toast } from './toast';
import { content as toggleButton } from './toggle-button';
import { content as toggleGroup } from './toggle-group';
import { content as tooltip } from './tooltip';
import { content as videoPlayer } from './video-player';

export const COMPONENT_CONTENT: Record<string, ComponentContent> = {
  accordion,
  align,
  alert,
  'animated-text': animatedText,
  'audio-player': audioPlayer,
  autocomplete,
  avatar,
  badge,
  breadcrumb,
  button,
  calendar,
  'calendar-view': calendarView,
  card,
  carousel,
  'chat-bubble': chatBubble,
  checkbox,
  code,
  collapsible,
  'color-input': colorInput,
  'color-picker': colorPicker,
  'date-picker': datePicker,
  dialog,
  divider,
  drawer,
  dropdown,
  'empty-state': emptyState,
  'file-upload': fileUpload,
  'form-field': formField,
  grid,
  heading,
  'layout-group': layoutGroup,
  image,
  'input-range': inputRange,
  'input-text': inputText,
  label,
  link,
  list,
  'marker-list': markerList,
  loader,
  'number-input': numberInput,
  pagination,
  password,
  'password-strength': passwordStrength,
  'pin-input': pinInput,
  popover,
  'progress-bar': progressBar,
  prose,
  quote,
  'radio-group': radioGroup,
  'rich-text-editor': richTextEditor,
  'scroll-area': scrollArea,
  select,
  sidebar,
  skeleton,
  splitter,
  stack,
  stepper,
  switch: switchContent,
  table,
  'table-of-contents': tableOfContents,
  tabs,
  text,
  textarea,
  'time-field': timeField,
  timeline,
  toast,
  'toggle-button': toggleButton,
  'toggle-group': toggleGroup,
  tooltip,
  'video-player': videoPlayer,
};

export type { ComponentContent, ComponentDocument, ComponentSample, KeyboardRow, ComponentBadge } from './types';
