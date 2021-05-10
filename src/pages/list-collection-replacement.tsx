import React from 'react';
import { Link } from 'react-router-dom';

export const ListCollectionsReplacement = ({ loader, hooks }: {  loader: any, hooks: any  }) => {
    const { resolvedData: data } = loader.useCollectionList();
    const { LocaleString } =  hooks.useComponents();

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
                            <LocaleString>{collection.label}</LocaleString>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};
