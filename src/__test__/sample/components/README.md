# @/ui 元件庫文件

本文件旨在說明 `src/modules/common/components/ui` 目錄下的所有 UI 元件。這些元件大多基於 [Chakra UI](https://chakra-ui.com/)，並在其基礎上進行了封裝或擴展，以符合專案的特定需求。

---

## `accordion.tsx`

提供可折疊的手風琴元件。

### `AccordionRoot`
手風琴的根容器。直接導出 `Accordion.Root`。

### `AccordionItem`
手風琴的單個項目。直接導出 `Accordion.Item`。

### `AccordionItemTrigger`
用於開/關手風琴項目的觸發器。
- **Props**:
  - `indicatorPlacement`: `'start' | 'end'` - 指示器圖示（箭頭）的位置，預設為 `'end'`。
  - 繼承 `@chakra-ui/react` 的 `Accordion.ItemTriggerProps`。

### `AccordionItemContent`
手風琴項目的內容區域。
- **Props**:
  - 繼承 `@chakra-ui/react` 的 `Accordion.ItemContentProps`。

---

## `alert.tsx`

用於顯示提示訊息的元件。

### `Alert`
- **Props**:
  - `title`: `React.ReactNode` - 提示標題。
  - `children`: `React.ReactNode` - 提示的詳細描述內容。
  - `icon`: `React.ReactElement` - 顯示在標題左側的圖示。
  - `closable`: `boolean` - 是否顯示關閉按鈕。
  - `onClose`: `() => void` - 點擊關閉按鈕時的回呼。
  - `startElement`: `React.ReactNode` - 替代預設圖示的自訂起始元素。
  - `endElement`: `React.ReactNode` - 顯示在結尾的自訂元素。
  - 繼承 `@chakra-ui/react` 的 `Alert.RootProps` (除了 `title`)。

---

## `button/`

包含專案中使用的各種按鈕。

### `Button` (`button/index.tsx`)
通用的按鈕元件，擴展了 Chakra Button 並增加了載入狀態。
- **Props**:
  - `loading`: `boolean` - 是否處於載入狀態。按鈕將被禁用並顯示旋轉圖示。
  - `loadingText`: `React.ReactNode` - 載入時顯示在旋轉圖示旁的文字。
  - `variant`: `'solid' | 'outline' | 'subtle' | 'surface' | 'ghost' | 'plain' | 'secondary' | 'tertiary' | 'primary'` - 按鈕的樣式。
  - 繼承 `@chakra-ui/react` 的 `ButtonProps`。

### `GoldenButton` (`button/GoldenButton.tsx`)
一個預設樣式為金色漸層的特殊按鈕。
- **Props**:
  - 繼承 `Button` 的所有 props。

---

## `checkbox.tsx`

提供核取方塊功能。

### `Checkbox`
- **Props**:
  - `icon`: `React.ReactNode` - 自訂核取方塊內的圖示（例如，取代預設的勾號）。
  - `inputProps`: `React.InputHTMLAttributes<HTMLInputElement>` - 傳遞給內部 `<input>` 元素的屬性。
  - `rootRef`: `React.Ref<HTMLLabelElement>` - 根 `label` 元素的 ref。
  - 繼承 `@chakra-ui/react` 的 `Checkbox.RootProps`。

---

## `close-button.tsx`

一個預設用於「關閉」操作的圖示按鈕。

### `CloseButton`
- **Props**:
  - `children`: `React.ReactNode` - 可用於覆寫預設的 `X` 圖示。
  - 預設 `variant` 為 `'ghost'`，`aria-label` 為 `'Close'`。
  - 繼承 `@chakra-ui/react` 的 `ButtonProps`。

---

## `color-mode.tsx`

提供亮色/暗色主題切換功能。

### `ColorModeProvider`
應放置在應用程式根部的提供者，用於啟用顏色模式功能。

### `useColorMode`
一個 Hook，回傳 `{ colorMode, setColorMode, toggleColorMode }`，用於讀取和控制顏色模式。

### `useColorModeValue`
一個 Hook，接收 `(lightValue, darkValue)` 兩個參數，並根據目前的顏色模式回傳對應的值。

### `ColorModeIcon`
根據目前顏色模式顯示太陽 (`<LuSun />`) 或月亮 (`<LuMoon />`) 圖示。

### `ColorModeButton`
一個點擊後可切換顏色模式的圖示按鈕。

---

## `data-list.tsx`

用於顯示「標籤-值」配對的列表。

### `DataListRoot`
列表的根容器。直接導出 `DataList.Root`。

### `DataListItem`
列表中的單個項目。
- **Props**:
  - `label`: `React.ReactNode` - 標籤。
  - `value`: `React.ReactNode` - 值。
  - `info`: `React.ReactNode` - 若提供，會在標籤旁顯示一個資訊圖示及提示。
  - `grow`: `boolean` - 若為 `true`，標籤和值會佔滿可用空間。
  - `_valueProps`: `ChakraDataList.ItemValueProps` - 傳遞給值容器的額外 props。
  - 繼承 `@chakra-ui/react` 的 `DataList.ItemProps`。

---

## `dialog.tsx`

用於建立對話框（Modal）。

- **直接導出**: `DialogRoot`, `DialogTrigger`, `DialogFooter`, `DialogHeader`, `DialogBody`, `DialogBackdrop`, `DialogTitle`, `DialogDescription`, `DialogActionTrigger`。

### `DialogContent`
對話框的內容容器。
- **Props**:
  - `portalled`: `boolean` - 是否使用 Portal 渲染，預設 `true`。
  - `portalRef`: `React.RefObject<HTMLElement>` - Portal 的容器 ref。
  - `backdrop`: `boolean` - 是否顯示背景遮罩，預設 `true`。
  - 繼承 `@chakra-ui/react` 的 `Dialog.ContentProps`。

### `DialogCloseTrigger`
一個預設樣式並定位在右上角的關閉按鈕。

---

## `drawer.tsx`

用於建立從側面滑出的抽屜式面板。

- **直接導出**: `DrawerRoot`, `DrawerTrigger`, `DrawerFooter`, `DrawerHeader`, `DrawerBody`, `DrawerBackdrop`, `DrawerTitle`, `DrawerDescription`, `DrawerActionTrigger`。

### `DrawerContent`
抽屜的內容容器。
- **Props**:
  - `portalled`: `boolean` - 是否使用 Portal 渲染，預設 `true`。
  - `portalRef`: `React.RefObject<HTMLElement>` - Portal 的容器 ref。
  - `offset`: `string | number` - 抽屜與螢幕邊緣的間距。
  - 繼承 `@chakra-ui/react` 的 `Drawer.ContentProps`。

### `DrawerCloseTrigger`
一個預設樣式並定位在右上角的關閉按鈕。

---

## `field.tsx`

用於封裝表單欄位，提供標籤、輔助文字等。

### `Field`
- **Props**:
  - `label`: `React.ReactNode` - 欄位標籤。
  - `helperText`: `React.ReactNode` - 顯示在下方的輔助說明文字。
  - `errorText`: `React.ReactNode` - 顯示在下方的錯誤訊息。
  - `optionalText`: `React.ReactNode` - 當欄位非必填時顯示的文字（例如 `(選填)`）。
  - `children`: 應傳入表單輸入元件，如 `<Input />`。
  - 繼承 `@chakra-ui/react` 的 `Field.RootProps`。

---

## `file-upload.tsx`

提供檔案上傳功能，包含拖放區域、檔案列表等。

- **直接導出**: `FileUploadLabel`, `FileUploadClearTrigger`, `FileUploadTrigger`。

### `FileUploadRoot`
檔案上傳功能的根容器。
- **Props**:
  - `inputProps`: `React.InputHTMLAttributes<HTMLInputElement>` - 傳遞給內部 `<input type="file">` 的屬性。

### `FileUploadDropzone`
拖放檔案的區域。
- **Props**:
  - `label`: `React.ReactNode` - 拖放區的標題。
  - `description`: `React.ReactNode` - 拖放區的描述文字。

### `FileUploadList`
顯示已上傳檔案的列表。
- **Props**:
  - `files`: `File[]` - (可選) 受控的檔案列表。
  - `showSize`: `boolean` - 是否顯示檔案大小。
  - `clearable`: `boolean` - 是否顯示清除單個檔案的按鈕。

### `FileInput`
一個外觀像輸入框的按鈕，點擊後觸發檔案選擇。會顯示已選檔案名稱或數量。
- **Props**:
  - `placeholder`: `React.ReactNode` - 未選擇檔案時的提示文字。
  - 繼承 `ButtonProps`。

---

## `input-group.tsx`

在輸入框前後添加額外元素（Addon）。

### `InputGroup`
- **Props**:
  - `children`: **必須**是單一的輸入元件，如 `<Input />`。
  - `startElement`: `React.ReactNode` - 在輸入框前方的元素。
  - `endElement`: `React.ReactNode` - 在輸入框後方的元素。
  - `startOffset`, `endOffset`: `string | number` - 用於微調內距。

---

## `menu.tsx`

用於建立下拉式選單。

- **直接導出**: `MenuRoot`, `MenuTrigger`, `MenuItem`, `MenuSeparator`, 等多個 Chakra Menu 元件。

### `MenuContent`
選單的內容容器。
- **Props**:
  - `portalled`: `boolean` - 是否使用 Portal 渲染，預設 `true`。

### `MenuArrow`
在選單上顯示一個指向觸發器的小箭頭。

### `MenuCheckboxItem`
可勾選的選單項目。

### `MenuRadioItem`
單選群組中的選單項目。

### `MenuItemGroup`
可為一組選單項目加上標題。
- **Props**:
  - `title`: `React.ReactNode` - 群組標題。

### `MenuTriggerItem`
用於觸發子選單的項目，會自動在右側顯示一個箭頭。

---

## `popover.tsx`

用於建立彈出式內容。

- **直接導出**: `PopoverRoot`, `PopoverTrigger`, `PopoverBody`, 等多個 Chakra Popover 元件。

### `PopoverContent`
彈出框的內容容器。
- **Props**:
  - `portalled`: `boolean` - 是否使用 Portal 渲染，預設 `true`。

### `PopoverArrow`
在彈出框上顯示一個指向觸發器的小箭頭。

### `PopoverCloseTrigger`
一個預設樣式並定位在右上角的關閉按鈕。

---

## `progress-circle.tsx`

圓形進度指示器。

### `ProgressCircleRoot`
根容器，直接導出 `ChakraProgressCircle.Root`。

### `ProgressCircleRing`
進度環的視覺元件。
- **Props**:
  - `trackColor`: `string` - 背景軌道的顏色。
  - `cap`: `'round' | 'butt'` - 進度條末端的形狀。
  - `color`: `string` - 進度條本身的顏色。

### `ProgressCircleValueText`
在圓心顯示進度數值的文字。

---

## `progress.tsx`

長條形進度指示器。

- **直接導出**: `ProgressRoot`, `ProgressValueText`。

### `ProgressBar`
進度條的視覺元件。

### `ProgressLabel`
進度條的標籤。
- **Props**:
  - `info`: `React.ReactNode` - 若提供，會在標籤旁顯示一個資訊圖示及提示。

---

## `provider.tsx`

應用程式的頂層提供者。

### `Provider`
封裝了 `ChakraProvider` 和 `ColorModeProvider`，應在應用程式的最外層使用以啟用 Chakra UI 和顏色模式功能。

---

## `radio-group.tsx`

提供單選按鈕功能。

### `RadioGroup`
單選按鈕群組的容器。直接導出 `ChakraRadioGroup.Root`。

### `Radio`
單個單選按鈕。
- **Props**:
  - `inputProps`: `React.InputHTMLAttributes<HTMLInputElement>` - 傳遞給內部 `<input>` 的屬性。
  - `rootRef`: `React.RefObject<HTMLDivElement | null>` - 根元素的 ref。

---

## `select.tsx`

用於建立下拉選擇器。

- **直接導出**: `SelectLabel`, `SelectItemText`。

### `SelectRoot`
Select 元件的根容器，預設下拉選單與觸發器同寬。

### `SelectTrigger`
使用者點擊以開啟下拉選單的觸發器。
- **Props**:
  - `clearable`: `boolean` - 是否在有選中值時顯示清除按鈕。

### `SelectContent`
下拉選單的內容容器。
- **Props**:
  - `portalled`: `boolean` - 是否使用 Portal 渲染，預設 `true`。

### `SelectItem`
下拉選單中的單個選項。

### `SelectValueText`
在觸發器中顯示已選中的值。支援自訂顯示邏輯。

### `SelectItemGroup`
可為一組選項加上標題。
- **Props**:
  - `label`: `React.ReactNode` - 群組標題。

---

## `timeline.tsx`

用於顯示時間軸。

- **直接導出**: `TimelineRoot`, `TimelineContent`, `TimelineItem`, 等多個 Chakra Timeline 元件。

### `TimelineConnector`
時間軸上的指示點和連接線。
- **Props**:
  - `showSeparator`: `boolean` - 是否顯示項目之間的連接線。

---

## `toaster.tsx`

提供全域的 Toast 通知功能。

### `toaster` (object)
由 `createToaster` 建立的物件，用於程式化地觸發 toast。
- **使用方法**: `toaster.success('訊息')`, `toaster.error('錯誤')` 等。
- **設定**: 預設位置為 `'top'`。

### `Toaster` (Component)
必須在應用程式根部渲染此元件，以顯示由 `toaster` 物件觸發的通知。它會根據不同類型（`success`, `error`, `info`, `loading`）顯示對應的圖示和樣式。

---

## `toggle-tip.tsx`

一個基於 Popover 的提示元件，通常由點擊觸發。

### `ToggleTip`
- **Props**:
  - `content`: `React.ReactNode` - 提示的內容。
  - `children`: `React.ReactNode` - 觸發提示的元素。
  - `showArrow`: `boolean` - 是否顯示指向觸發器的小箭頭。
  - `portalled`: `boolean` - 是否使用 Portal 渲染，預設 `true`。

### `InfoTip`
`ToggleTip` 的一個變體，預設使用一個資訊圖示作為觸發器。`children` prop 會被當作 `content` 傳遞。

---

## `tooltip.tsx`

在元素 hover 或 focus 時顯示的工具提示。

### `Tooltip`
- **Props**:
  - `content`: `React.ReactNode` - **必要**。工具提示的內容。
  - `children`: `React.ReactNode` - 觸發提示的元素。
  - `disabled`: `boolean` - 是否禁用工具提示。
  - `showArrow`: `boolean` - 是否顯示指向觸發器的小箭頭。
  - `portalled`: `boolean` - 是否使用 Portal 渲染。
  - `contentProps`: `ChakraTooltip.ContentProps` - 傳遞給內容容器的額外 props。

---

## `radio.tsx`

單選按鈕組件，基於 `@chakra-ui/react` 的 `RadioGroup` 進行封裝。

### `Radio`
- **Props**:
  - `rootRef`: `React.RefObject<HTMLDivElement | null>` - 組件根元素的 ref。
  - `inputProps`: `React.InputHTMLAttributes<HTMLInputElement>` - 應用於隱藏 input 元素的屬性。
  - 繼承 `@chakra-ui/react` 的 `RadioGroup.ItemProps`。

### `RadioGroup`
- **Props**:
  - 繼承 `@chakra-ui/react` 的 `RadioGroup.Root` 組件的所有 props。

## `SpotlightCard.tsx`

帶有滑鼠聚光燈效果的卡片組件，當滑鼠移動時會產生動態聚光燈追蹤效果。

### `SpotlightCard`
- **Props**:
  - `children`: `React.ReactNode` - 卡片內容。
  - `spotlightColor`: `string` - 聚光燈顏色，預設為 `#e89d1c`。
  - 繼承 `@chakra-ui/react` 的 `BoxProps`。
