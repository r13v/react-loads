/// <reference types="react" />
export default function StateComponent(state: boolean): ({ children, or }: {
    children: string | number | boolean | {} | import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)> | import("react").ReactNodeArray | import("react").ReactPortal | ((loader: any) => import("react").ReactNode) | null | undefined;
    or?: any;
}, loader?: Object | undefined) => any;
