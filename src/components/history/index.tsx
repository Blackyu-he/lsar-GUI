import { For, Show } from "solid-js";

import { useHistoryContext } from "~/contexts/HistoryContext";

import HistoryItem from "./Item";

import * as styles from "./index.css";

const History = () => {
  const { historyItems, refetchHistoryItems } = useHistoryContext();

  return (
    <div
      classList={{
        [styles.history]: true,
        "history-empty": !historyItems()?.length,
      }}
    >
      <Show when={historyItems()?.length}>
        <For each={historyItems()}>
          {(item, index) => (
            <HistoryItem
              {...item}
              index={index()}
              onDelete={() => refetchHistoryItems()}
            />
          )}
        </For>
      </Show>
    </div>
  );
};

export default History;
