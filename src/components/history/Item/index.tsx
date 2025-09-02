import { createMemo, Show } from "solid-js";
import { AiFillApi, AiFillChrome, AiFillDelete } from "solid-icons/ai";

import { Caption1 } from "fluent-solid";

import { deleteHistoryByID, open } from "~/command";
import {
  LazyButton,
  LazyCard,
  LazyCardHeader,
  LazySpinner,
  LazyText,
  LazyTooltip,
} from "~/lazy";

import { platforms } from "~/parser";

import { useParsingContext } from "~/contexts/ParsingContext";

import * as styles from "./index.css";

interface HistoryItemProps extends HistoryItem {
  index: number;
  onDelete: () => void;
}

const BUTTON_ICON_FONT_SIZE = "16px";

const HistoryItem = (props: HistoryItemProps) => {
  const { onParse, parsingHistoryItemIndex: parsingIndex } =
    useParsingContext();

  const isParsing = createMemo(() => parsingIndex() === props.index);

  const onDelete = async () => {
    await deleteHistoryByID(props.id);
    props.onDelete();
  };

  const handleParse = async () => {
    onParse(props.platform, props.room_id, props.index);
  };

  return (
    <LazyCard size="small" class={styles.item} onClick={() => {}}>
      <LazyCardHeader
        class={styles.header}
        header={
          <div class={styles.headerHeader}>
            <LazyText weight="semibold">{props.last_title}</LazyText>

            <Caption1 class={styles.category} italic>
              {props.category}
            </Caption1>
          </div>
        }
      />

      <div class={styles.description}>
        <div class={styles.descriptionPart1}>
          <img
            width={12}
            height={12}
            src={platforms[props.platform].logo}
            alt={platforms[props.platform].label}
          />
          <Caption1 class={styles.anchor}>{props.anchor}</Caption1>
        </div>

        <div class={styles.actions}>
          <LazyTooltip
            content="解析本直播间"
            relationship="label"
            positioning="below"
            withArrow
          >
            <LazyButton
              class={styles.button}
              icon={
                <Show
                  when={!isParsing()}
                  fallback={<LazySpinner size="extra-tiny" />}
                >
                  <AiFillApi font-size={BUTTON_ICON_FONT_SIZE} />
                </Show>
              }
              appearance="transparent"
              shape="circular"
              isLoading={isParsing()}
              onClick={handleParse}
              size="small"
              disabled={
                parsingIndex() !== null &&
                (parsingIndex() !== props.index || parsingIndex() === -1)
              }
            />
          </LazyTooltip>

          <LazyTooltip
            content="在浏览器中打开此直播间"
            relationship="label"
            positioning="below"
            withArrow
          >
            <LazyButton
              class={styles.button}
              icon={<AiFillChrome font-size={BUTTON_ICON_FONT_SIZE} />}
              appearance="transparent"
              shape="circular"
              size="small"
              onClick={() =>
                open(platforms[props.platform].roomBaseURL + props.room_id)
              }
            />
          </LazyTooltip>

          <LazyTooltip
            content="删除本条历史记录"
            relationship="label"
            positioning="below"
            withArrow
          >
            <LazyButton
              classList={{
                [styles.button]: true,
                [styles.deleteButton]: true,
              }}
              onClick={onDelete}
              icon={<AiFillDelete font-size={BUTTON_ICON_FONT_SIZE} />}
              appearance="transparent"
              shape="circular"
              size="small"
            />
          </LazyTooltip>
        </div>
      </div>
    </LazyCard>
  );
};

export default HistoryItem;
