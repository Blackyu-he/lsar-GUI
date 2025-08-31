import { createSignal, For, lazy, Show, useContext } from "solid-js";

import { AppContext } from "~/context";

import HistoryItem from "./Item";

import * as styles from "./index.css";

const LazyEmpty = lazy(() => import("alley-components/lib/components/empty"));

interface HistoryProps {
  items?: HistoryItem[];
}

const History = (props: HistoryProps) => {
  const [{ refetchHistoryItems }] = useContext(AppContext)!;

  const [parsingIndex, setParsingIndex] = createSignal<number | null>(null);

  return (
    <div
      classList={{
        [styles.history]: true,
        "history-empty": !props.items?.length,
      }}
    >
      <Show
        when={props.items?.length}
        fallback={<LazyEmpty description="空空如也" />}
      >
        <For each={props.items}>
          {(item, index) => (
            <HistoryItem
              {...item}
              onDelete={() => refetchHistoryItems()}
              startParsing={() => setParsingIndex(index())}
              endParsing={() => setParsingIndex(null)}
              disableParseButton={
                parsingIndex() !== null && parsingIndex() !== index()
              }
            />
          )}
        </For>
      </Show>
    </div>
  );
};

export default History;
