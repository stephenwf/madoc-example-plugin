import React from 'react';
import { serverRendererFor } from '../external/server-renderer-for';

export const TestPluginPage = ({ hooks, loader }:  {hooks: any, loader: any}) => {
    const { Button } = hooks.useAtoms();
    const { data } = loader.useData();

    return (
        <div>
            <Button>Test button</Button>

          <h3>
            Change 3 I make a change...

            and it syncs up with madoc. and this shouldn't
          </h3>

            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

serverRendererFor(TestPluginPage, {
    getKey: () => {
        return ['test', { shouldFindThis: 'testing' }];
    },
    getData: async () => {
        return { test: 'testing' };
    },
});
