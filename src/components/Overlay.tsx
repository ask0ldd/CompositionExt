import { useState } from "react";

type GridType = "thirds" | "phi";

export function Overlay() {
  // const [enabled, setEnabled] = useState(true);
  const [gridType ] = useState<GridType>("thirds");

  /*useEffect(() => {
    chrome.storage.sync.get(["gridEnabled", "gridType"], (result) => {
      if (typeof result.gridEnabled === "boolean") setEnabled(result.gridEnabled);
      if (result.gridType === "thirds" || result.gridType === "phi") {
        setGridType(result.gridType);
      }
    });

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.gridEnabled) setEnabled(Boolean(changes.gridEnabled.newValue));
      if (changes.gridType) setGridType(changes.gridType.newValue as GridType);
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  if (!enabled) return null;*/

  const lines =
    gridType === "thirds"
      ? [33.3333, 66.6667]
      : [38.2, 61.8];

  const opacity = 0.3;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `
          linear-gradient(to right,
            transparent calc(${lines[0]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[0]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[0]}% + 1px),
            transparent calc(${lines[0]}% + 1px)
          ),
          linear-gradient(to right,
            transparent calc(${lines[1]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[1]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[1]}% + 1px),
            transparent calc(${lines[1]}% + 1px)
          ),
          linear-gradient(to bottom,
            transparent calc(${lines[0]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[0]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[0]}% + 1px),
            transparent calc(${lines[0]}% + 1px)
          ),
          linear-gradient(to bottom,
            transparent calc(${lines[1]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[1]}% - 1px),
            rgba(255, 0, 0, ${opacity}) calc(${lines[1]}% + 1px),
            transparent calc(${lines[1]}% + 1px)
          )
        `,
      }}
    >TEST</div>
  );
}