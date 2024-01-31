import { expect } from 'vitest';

import { type BaseTemplate, ClientEndpoint } from './base-client';

import type { RecursiveRecord } from '~/utils/typescript.utils';

export const hasTemplateProperty = (_client: ClientEndpoint | ClientEndpoint['cached'], template: BaseTemplate, recursive = true) => {
  expect(_client).toBeTypeOf('function');
  expect(_client.method).toBeDefined();
  expect(_client.url).toBeDefined();
  expect(_client.opts).toBeDefined();
  if (template.validate) expect(_client.validate).toBeDefined();
  if (template.body) expect(_client.body).toBeDefined();
  if (template.init) expect(_client.init).toBeDefined();
  if (recursive && template.opts?.cache) hasTemplateProperty((_client as ClientEndpoint).cached, template, false);
};

export const hasOwnProperty = (template: RecursiveRecord, _client: RecursiveRecord) =>
  Object.keys(template).forEach(endpoint => {
    expect(_client).toHaveProperty(endpoint);
    if (!(template[endpoint] instanceof ClientEndpoint)) {
      hasOwnProperty(template[endpoint], _client[endpoint]);
    } else {
      hasTemplateProperty(_client[endpoint], template[endpoint]);
    }
  });
