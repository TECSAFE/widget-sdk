/**
 * The stylesheet for the SDK debug overlay. It is injected into the overlay's shadow root, so
 * the host page's styles cannot leak in and these rules cannot leak out.
 * @category Internal
 */
export const OVERLAY_STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, sans-serif; }
.root {
  position: fixed; right: 0; bottom: 0; z-index: 2000000;
  display: flex; align-items: flex-end; gap: 8px; padding: 0 32px;
  color: #000; font-size: 14px; line-height: 1.4;
}
button {
  padding: 8px; background: #fff; color: #000; cursor: pointer;
  border: 2px solid #fde047; font-size: 14px; font-family: inherit;
}
button:hover { background: #fde047; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.launcher { background: rgba(254, 240, 138, 0.85); border-bottom: none; }
.panel {
  background: rgba(254, 240, 138, 0.95); border: 2px solid #fde047; border-bottom: none;
  padding: 8px; min-width: 320px; max-width: 40vw;
}
.title { margin: 0 0 8px; font-size: 18px; font-family: ui-monospace, monospace; }
.row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.row > .grow { flex: 1 1 auto; }
select, textarea {
  padding: 4px; border: 1px solid #fde047; background: #fff; color: #000;
  font-size: 14px; font-family: inherit; width: 100%;
}
textarea { min-height: 30vh; font-family: ui-monospace, monospace; font-size: 12px; }
.legend { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 8px; margin-bottom: 8px; }
.legend > .sdk { background: #bfdbfe; padding: 4px 8px; border-radius: 0 12px 0 12px; }
.legend > .widget { background: #bbf7d0; padding: 4px 8px; border-radius: 12px 0 12px 0; text-align: right; }
.log {
  display: flex; flex-direction: column; gap: 8px; padding: 8px; overflow-y: auto;
  min-height: 20vh; max-height: 40vh; background: #fff; border: 1px solid #fde047;
}
.entry { padding: 8px; max-width: 90%; width: fit-content; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.entry.out { background: #bfdbfe; border-radius: 0 12px 0 12px; text-align: left; }
.entry.in { background: #bbf7d0; border-radius: 12px 0 12px 0; text-align: right; margin-left: auto; }
.entry.system {
  background: none; box-shadow: none; text-align: center; width: 100%; max-width: 100%;
  font-style: italic; font-size: 12px; color: rgba(0,0,0,0.5); padding: 0;
}
.entry-meta { margin: 0 0 4px; font-size: 12px; color: rgba(0,0,0,0.6); }
.entry-payload { margin: 0; font-size: 12px; font-family: ui-monospace, monospace; white-space: pre-wrap; word-break: break-all; }
.empty { margin: 32px 0; text-align: center; font-style: italic; color: #ca8a04; }
.error { margin: 4px 0 0; color: #b91c1c; font-size: 12px; }
.hidden { display: none !important; }
`
