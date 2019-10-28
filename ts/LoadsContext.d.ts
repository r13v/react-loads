import * as React from 'react';
import { CacheProvider, LoadsContextState } from './types';
export declare const LoadsContext: React.Context<LoadsContextState>;
export declare function Provider({ children, cacheProvider }: {
    children: React.ReactNode;
    cacheProvider?: CacheProvider;
}): JSX.Element;
declare const _default: {
    Provider: typeof Provider;
    Consumer: React.ExoticComponent<React.ConsumerProps<LoadsContextState>>;
    displayName?: string | undefined;
};
export default _default;
