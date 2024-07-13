import type { RecursiveRecord } from '@dvcol/common-utils/common';

export const defaultFileHandlerOptions: SaveFilePickerOptions = {
  startIn: 'downloads',
  types: [
    {
      description: 'Json Files',
      accept: {
        'application/json': ['.json'],
      },
    },
  ],
};

/** @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle */
export const getNewFileHandle = (options: SaveFilePickerOptions = {}): Promise<FileSystemFileHandle> => {
  if (!('showSaveFilePicker' in window)) throw new Error('File System Access API not supported');
  if (options.types === undefined) options.types = defaultFileHandlerOptions.types;
  if (options.startIn === undefined) options.startIn = defaultFileHandlerOptions.startIn;
  return window.showSaveFilePicker(options);
};

export type JsonWriterOptions = {
  picker?: SaveFilePickerOptions;
  replacer?: Parameters<typeof JSON.stringify>[1];
  space?: Parameters<typeof JSON.stringify>[2];
  fileHandle?: FileSystemFileHandle;
  separator?: string;
};

/** @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle */
export const getJsonWriter = async ({ picker, replacer = null, space = 2, fileHandle, separator }: JsonWriterOptions = {}): Promise<{
  handle: FileSystemFileHandle;
  writable: FileSystemWritableFileStream;
  write: (newContents: RecursiveRecord) => Promise<void>;
  close: () => Promise<void>;
  length: number;
  [Symbol.asyncDispose]: () => Promise<void>;
}> => {
  if (!fileHandle) fileHandle = await getNewFileHandle(picker);
  const writable = await fileHandle.createWritable();
  let length = 0;
  const write = async (newContents: RecursiveRecord) => {
    const content = `${length && separator ? separator : ''}${length ? '\n' : ''}${JSON.stringify(newContents, replacer, space)}`;
    await writable.write(content);
    length += content.length;
  };
  const close = async () => writable.close();
  return {
    handle: fileHandle,
    writable,
    write,
    close,
    length,
    [Symbol.asyncDispose]: close,
  };
};

/** @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle */
export const writeJson = async (contents: RecursiveRecord, options?: JsonWriterOptions): Promise<FileSystemFileHandle> => {
  const { write, close, handle } = await getJsonWriter(options);
  await write(contents);
  await close();
  return handle;
};
