declare module 'react-quill-new' {
  import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';
  import Quill from 'quill';

  export interface ReactQuillProps {
    id?: string;
    className?: string;
    theme?: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    onChange?: (content: string, delta: any, source: any, editor: any) => void;
    onChangeSelection?: (range: any, source: any, editor: any) => void;
    onFocus?: (range: any, source: any, editor: any) => void;
    onBlur?: (previousRange: any, source: any, editor: any) => void;
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
    formats?: string[];
    children?: React.ReactElement<any>;
    modules?: Record<string, any>;
    preserveWhitespace?: boolean;
  }

  export interface ReactQuillComponent extends ForwardRefExoticComponent<ReactQuillProps & RefAttributes<any>> {
    Quill: typeof Quill;
    displayName: string;
  }

  const ReactQuill: ReactQuillComponent;
  export default ReactQuill;
}