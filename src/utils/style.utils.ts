import { addCustomProperty } from '@dvcol/common-utils/common/style';

export const addCustomProgressProperty = (progress = 0, throwOnError = false) =>
  addCustomProperty(
    {
      name: '--progress',
      syntax: '<percentage>',
      inherits: true,
      initialValue: `${progress}%`,
    },
    throwOnError,
  );
