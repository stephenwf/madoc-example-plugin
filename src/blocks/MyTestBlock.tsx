import React from 'react';
import { blockConfigFor } from "@madoc.io/types";

export const MyTestBlock = ({ text }: { text: string }) => {
    return <div>My test block. {text}</div>;
};

blockConfigFor(MyTestBlock, {
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
