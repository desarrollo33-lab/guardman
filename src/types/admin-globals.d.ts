// Helpers globales que AdminLayout expone con <script is:inline> y que las
// islas React y los componentes .astro del panel consumen. Antes no estaban
// declarados: `window.gmToast` daba error de tipos en cada uso, y el patrón
// que las islas usaban era un cast inline
// `(window as unknown as { gmToast?: … }).gmToast` repetido en cada archivo.
declare global {
  interface Window {
    gmToast?: (o: {
      type?: 'success' | 'error' | 'warning' | 'info';
      title?: string;
      msg?: string;
      duration?: number;
    }) => void;
    gmConfirm?: (o: {
      title?: string;
      msg?: string;
      danger?: boolean;
      confirmLabel?: string;
      onConfirm?: () => void;
      onCancel?: () => void;
    }) => void;
    gmMoveMenu?: (o: {
      x?: number;
      y?: number;
      items?: { label?: string; color?: string; sep?: boolean }[];
      onSelect?: (item: unknown) => void;
      onCancel?: () => void;
    }) => void;
    gmLongPress?: (
      el: HTMLElement,
      handler: (pos: { x: number; y: number }) => void,
      opts?: { ms?: number },
    ) => void;
    /** Cierra sesión revocando el refresh token en el servidor. */
    gmLogout?: () => void | Promise<void>;
  }
}

export {};
