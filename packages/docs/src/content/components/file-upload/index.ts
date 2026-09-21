import { spec } from '@move-specs/forms/FileUpload/FileUpload.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Constraints from './samples/constraints';
import constraintsCode from './samples/constraints?raw';
import SimulatedUpload from './samples/simulated-upload';
import simulatedUploadCode from './samples/simulated-upload?raw';
import AutoDismiss from './samples/auto-dismiss';
import autoDismissCode from './samples/auto-dismiss?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    {
      id: 'simulated-upload',
      title: 'Uploading, end to end (simulated)',
      render: SimulatedUpload,
      code: simulatedUploadCode,
    },
    {
      id: 'auto-dismiss',
      title: 'Removing finished rows (removeOnComplete)',
      render: AutoDismiss,
      code: autoDismissCode,
    },
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    {
      id: 'constraints',
      title: 'Type, size & count limits',
      render: Constraints,
      code: constraintsCode,
    },
  ],
};
