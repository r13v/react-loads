import * as React from 'react';
import { LoadsConfig, LoadFunction, StateComponentProps } from './types';
export declare type LoadsProps = LoadsConfig<unknown> & {
    children: (loader: any) => React.ReactNode;
    load: LoadFunction<unknown>;
    inputs?: Array<any>;
};
export declare const Loads: React.FunctionComponent<LoadsProps> & {
    Idle: React.FunctionComponent<StateComponentProps>;
    Pending: React.FunctionComponent<StateComponentProps>;
    Timeout: React.FunctionComponent<StateComponentProps>;
    Resolved: React.FunctionComponent<StateComponentProps>;
    Rejected: React.FunctionComponent<StateComponentProps>;
};
export default Loads;
