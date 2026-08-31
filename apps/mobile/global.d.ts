/**
 * @types/react 19 removed the global `JSX` namespace (it now lives
 * under `React.JSX`). The codebase annotates components with
 * `JSX.Element` throughout; this restores the shorthand so the SDK 54
 * upgrade typechecks without editing every component.
 */
declare global {
  namespace JSX {
    type Element = import("react").JSX.Element;
  }
}

export {};
