import React from 'react';
import { Button } from '@madoc.io/types';

export const TestPluginPage = ({ loader }: { loader: any }) => {
  const { data } = loader.useData();

  return (
    <div>
      <Button $primary>Test button</Button>

      <h3>Test plugin page?</h3>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

Madoc.serverRendererFor(TestPluginPage, {
  getKey: () => {
    return ['test', { shouldFindThis: 'testing' }];
  },
  getData: async () => {
    return { test: 'testing' };
  },
});
