import React from 'react';
import { Button, Atoms, serverRendererFor } from '@madoc.io/types';

export const TestPluginPage = ({ loader }: { loader: any }) => {
  const { data } = loader.useData();

  return (
    <div>
      <Atoms.Heading1>Testing page</Atoms.Heading1>
      <Button $primary>Test button</Button>

      <h3>Test plugin page? v15</h3>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

serverRendererFor(TestPluginPage, {
  getKey: () => {
    return ['test', { shouldFindThis: 'testing' }];
  },
  getData: async (key, vars, api) => {
    return { test: 'testing' };
  },
});
