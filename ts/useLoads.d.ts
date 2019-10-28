import * as React from 'react';
import { LoadsConfig, LoadFunction, LoadingState } from './types';
export default function useLoads<R>(fn: LoadFunction<R>, config?: LoadsConfig<R>, inputs?: Array<any>): {
    Idle: ({ children, or }: {
        children: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | ((loader: any) => React.ReactNode) | null | undefined;
        or?: any;
    }, loader?: Object | undefined) => any;
    Pending: ({ children, or }: {
        children: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | ((loader: any) => React.ReactNode) | null | undefined;
        or?: any;
    }, loader?: Object | undefined) => any;
    Timeout: ({ children, or }: {
        children: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | ((loader: any) => React.ReactNode) | null | undefined;
        or?: any;
    }, loader?: Object | undefined) => any;
    Resolved: ({ children, or }: {
        children: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | ((loader: any) => React.ReactNode) | null | undefined;
        or?: any;
    }, loader?: Object | undefined) => any;
    Rejected: ({ children, or }: {
        children: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | ((loader: any) => React.ReactNode) | null | undefined;
        or?: any;
    }, loader?: Object | undefined) => any;
    isCached: boolean;
    isIdle: boolean;
    isPending: boolean;
    isTimeout: boolean;
    isResolved: boolean;
    isRejected: boolean;
    load: (..._args: any) => Promise<void | R> | undefined;
    update: ((..._args: any) => Promise<void | R> | undefined) | ((..._args: any) => Promise<void | R> | undefined)[] | undefined;
    reset: () => void;
    response: R | undefined;
    error: any;
    state: LoadingState;
};
