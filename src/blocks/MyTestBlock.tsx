import React from 'react';

export const MyTestBlock = ({ text }: { text: string }) => {
    return <div>My test block. {text}</div>;
};

Madoc.blockConfigFor(MyTestBlock, {
    type: 'MyPlugin.MyTestBlock',
    label: 'My test block',
    requiredContext: [],
    editor: {
        text: { type: 'text-field' },
    },
    anyContext: [],
    defaultProps: {
        text: '',
    },
});
