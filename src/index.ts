import { MyTestBlock } from './blocks/MyTestBlock';
import { TestPluginPage } from './pages/test-plugin-page';
import { ListCollectionsReplacement } from './pages/list-collection-replacement';

// This will be added automatically.
// export const metadata = {
//   title: 'My plugin',
//   version: 'v1.0.0',
//   repository: 'https://...',
// };

export const id = 'test-plugin';

export function hookRoutes() {
  return [
    {
      path: '/test-plugin',
      component: TestPluginPage,
      exact: true,
    },
  ];
}

export function hookComponents() {
  return {
    AllCollections: ListCollectionsReplacement,
  };
}

export function hookBlocks() {
  return {
    MyTestBlock,
  };
}
