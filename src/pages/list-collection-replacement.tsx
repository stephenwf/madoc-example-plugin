import React from 'react';
import { Link } from 'react-router-dom';

export const ListCollectionsReplacement = () => {
  const { resolvedData: data } = Madoc.useCollectionList();

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      All collections from plugin.
      <h1>All collections</h1>
      {(data as any).collections.map((collection: any) => {
        return (
          <div key={collection.id}>
            <Link to={`/collections/${collection.id}`}>
              <Madoc.LocaleString>{collection.label}</Madoc.LocaleString>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
