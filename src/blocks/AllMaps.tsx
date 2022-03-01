import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { blockConfigFor } from '@madoc.io/types';
// @ts-ignore
import { createMap } from './allmaps.dist';

export function AllMaps({ annotationJson }: { annotationJson: string }) {
  const ref = useRef<HTMLDivElement>(null);
  console.log('All maps working?');

  const annotation = useMemo(() => {
    if (!annotationJson) {
      return null;
    }
    try {
      return JSON.parse(annotationJson);
    } catch (e) {
      return null;
    }
  }, [annotationJson]);

  useLayoutEffect(() => {
    if (annotation) {
      console.log(createMap);
      if (createMap) {
        // @ts-ignore
        createMap(ref.current, annotation);
      }
    }
  }, [annotation]);

  return <div ref={ref} style={{ height: 600 }} />;
}

blockConfigFor(AllMaps, {
  type: 'MyPlugin.AllMaps',
  label: 'All maps viewer',
  requiredContext: [],
  editor: {
    annotationJson: { type: 'text-field', label: 'Annotation (json)' },
  },
  anyContext: [],
  defaultProps: {
    annotationJson: '',
  },
});
