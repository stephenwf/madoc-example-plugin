import '@madoc.io/types';
import { MyTestBlock } from './blocks/MyTestBlock';
import { TestPluginPage } from './pages/test-plugin-page';
import { ListCollectionsReplacement } from './pages/list-collection-replacement';
import { kitchenSinkTemplate } from './project-templates/kitchen-sink';
import { AllMaps } from './blocks/AllMaps';
import { exampleTheme } from './themes/example-theme';

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
    AllMaps,
  };
}

export const projectTemplates = [kitchenSinkTemplate];

// All themes.
export const themes = [exampleTheme];
