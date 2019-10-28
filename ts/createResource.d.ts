import { LoadFunction, LoadsConfig } from './types';
declare type LoadsSuspenderOpts = {
    id?: string;
    args?: Array<unknown>;
};
declare type ResourceOptions<R> = {
    _namespace: string;
    [loadKey: string]: LoadFunction<R> | [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};
export default function createResource<R>(opts: ResourceOptions<R>): {
    unstable_load: ({ id, args }?: LoadsSuspenderOpts) => R | undefined;
    unstable_preload: ({ id, args }?: LoadsSuspenderOpts) => R | undefined;
};
export {};
