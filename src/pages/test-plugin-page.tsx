import React from 'react';

export const TestPluginPage = ({ loader }: { loader: any }) => {
  const { data } = loader.useData();

  return (
    <div>
      <Madoc.Button>Test button</Madoc.Button>

      <h3>Test plugin page.</h3>

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
