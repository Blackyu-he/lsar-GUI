import { children, createSignal, For } from "solid-js";
import { AiOutlineCheck } from "solid-icons/ai";

import { LazyButton, LazyInput, LazyBadge } from "~/lazy";

import { useAppContext } from "~/context";

import { parse, platforms } from "~/parser";
import { isValidNumberOrHttpsUrl } from "~/parser/validators";

import * as styles from "./index.css";

const Search = () => {
  const [
    _,
    { setToast },
    { config },
    { setParsedResult },
    { setShowSettings: setShowBilibiliCookieEditor },
  ] = useAppContext();

  const [input, setInput] = createSignal<string>("");
  const [currentPlatform, setCurrentPlatform] = createSignal<Platform | null>(
    null,
  );

  const [loading, setLoading] = createSignal(false);

  const resetParseResult = () => setParsedResult(null);
  const resetInput = () => setInput("");

  const selectPlatform = (value: Platform) => {
    if (currentPlatform() === value) return;

    if (currentPlatform()) resetInput();

    setCurrentPlatform(value);
    resetParseResult();
  };

  const onInput = (v: string) => {
    setInput(v);
  };

  const buttons = children(() => (
    <div class={styles.badges}>
      <For each={Object.keys(platforms)}>
        {(key) => {
          const item = platforms[key as Platform];

          return (
            <LazyBadge
              shape="rounded"
              color={currentPlatform() === key ? "brand" : "informative"}
              onClick={() => selectPlatform(key as Platform)}
            >
              {item.label}
            </LazyBadge>
          );
        }}
      </For>
    </div>
  ));

  const onParse = async () => {
    const value = input().trim();
    const parsedInput = isValidNumberOrHttpsUrl(value);
    if (parsedInput instanceof Error) {
      setToast({ type: "error", message: parsedInput.message });
      return;
    }

    setLoading(true);

    await parse(
      currentPlatform()!,
      parsedInput,
      config()!,
      setShowBilibiliCookieEditor,
      setToast,
      setParsedResult,
    );

    setLoading(false);
  };

  return (
    <div>
      {buttons()}

      <LazyInput
        placeholder="输入房间号或直播间链接"
        value={input()}
        onChange={onInput}
        disabled={loading()}
        contentAfter={
          <LazyButton
            icon={<AiOutlineCheck />}
            isLoading={loading()}
            disabled={!currentPlatform() || !input()}
            onClick={onParse}
            appearance="transparent"
          />
        }
      />
    </div>
  );
};

export default Search;
