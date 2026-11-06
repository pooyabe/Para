import { useThemeColor } from "@/hooks/useThemeColor";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
  type ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "./IconSymbol";
import { Span } from "./Span";

export type SelectItem = { label: string; value: string };

export type SelectProps = ViewProps & {
  placeholder?: string;
  items_array?: SelectItem[];
  label?: string | null;
  searchable?: boolean;
  onValueChange?: (value: string) => void;
  initialValue?: string | null;
  /** مقدار کنترل‌شده؛ وقتی پاس داده شود، انتخاب از بیرون مدیریت می‌شود */
  value?: string | null;
  disabled?: boolean;
  /** اجازه افزودن گزینه تازه از داخل جستجو (پیش‌فرض: روشن) */
  allowCustomItem?: boolean;
  /** عنوان شیت؛ اگر نباشد از label استفاده می‌شود */
  modalTitle?: string;
  searchPlaceholder?: string;
  emptyText?: string;
};

const ITEM_HEIGHT = 56;
const SHEET_MAX_HEIGHT_RATIO = 0.8;

/**
 * یکسان‌سازی متن فارسی برای جستجو؛ «ي/ك» عربی، اعراب و نیم‌فاصله باعث
 * می‌شوند جستجویی که کاربر انتظار دارد نتیجه بدهد، نتیجه ندهد.
 */
function normalizeSearchText(value: string) {
  return value
    .replace(/[\u064B-\u0652\u0640\u200C\u200D]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ۀة]/g, "ه")
    .replace(/[أإآ]/g, "ا")
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

type OptionRowProps = {
  item: SelectItem;
  selected: boolean;
  textColor: string;
  accentColor: string;
  selectedBackground: string;
  pressedBackground: string;
  onSelect: (value: string) => void;
};

/**
 * Render جداگانه هر گزینه تا با تایپ در جستجو فقط ردیف‌های واقعاً تغییرکرده
 * دوباره رندر شوند.
 */
const OptionRow = memo(function OptionRow({
  item,
  selected,
  textColor,
  accentColor,
  selectedBackground,
  pressedBackground,
  onSelect,
}: OptionRowProps) {
  return (
    <View style={styles.rowWrapper}>
      <Pressable
        onPress={() => onSelect(item.value)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: selected
              ? selectedBackground
              : pressed
                ? pressedBackground
                : "transparent",
          },
        ]}
      >
        <View style={styles.rowIndicator}>
          {selected ? (
            <IconSymbol
              type="Ionicons"
              name="checkmark-circle"
              size={20}
              color={accentColor}
            />
          ) : null}
        </View>
        <Span
          numberOfLines={1}
          style={[
            styles.rowLabel,
            {
              color: textColor,
              fontFamily: selected ? "VazirBold" : "VazirRegular",
            },
          ]}
        >
          {item.label}
        </Span>
      </Pressable>
    </View>
  );
});

export function Select({
  style,
  placeholder = "انتخاب",
  label = "",
  items_array = [],
  searchable = false,
  onValueChange,
  initialValue = null,
  value,
  disabled = false,
  allowCustomItem = true,
  modalTitle,
  searchPlaceholder = "جستجو یا افزودن گزینه جدید",
  emptyText = "گزینه‌ای پیدا نشد",
  ...rest
}: SelectProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");
  const cardColor = useThemeColor({}, "card");
  const dividerColor = useThemeColor({}, "divider");
  const overlayColor = useThemeColor({}, "overlay");
  const infoBackground = useThemeColor({}, "infoBackground");
  const tintColor = useThemeColor({}, "tint");

  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const [internalValue, setInternalValue] = useState<string | null>(
    initialValue,
  );
  const [customItems, setCustomItems] = useState<SelectItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  // مقدار انیمیشن در state نگه داشته می‌شود تا مثل ref در رندر خوانده نشود.
  const [progress] = useState(() => new Animated.Value(0));

  const currentValue = value !== undefined ? value : internalValue;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setSearchText("");
    setIsOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsOpen(false);
    });
  }, [progress]);

  useEffect(() => {
    if (!isOpen) return;

    progress.setValue(0);
    Animated.spring(progress, {
      toValue: 1,
      stiffness: 260,
      damping: 30,
      mass: 0.9,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
  }, [isOpen, progress]);

  const options = useMemo(() => {
    if (customItems.length === 0) return items_array;

    const knownValues = new Set(items_array.map((item) => item.value));
    return [
      ...items_array,
      ...customItems.filter((item) => !knownValues.has(item.value)),
    ];
  }, [customItems, items_array]);

  const selectedLabel = useMemo(() => {
    const match = options.find((item) => item.value === currentValue);
    return match ? match.label : null;
  }, [currentValue, options]);

  const normalizedQuery = normalizeSearchText(searchText);

  // نمایه جستجو یک‌بار ساخته می‌شود تا هر بار تایپ، همه برچسب‌ها دوباره
  // نرمال‌سازی نشوند.
  const searchIndex = useMemo(
    () =>
      options.map((item) => ({
        item,
        searchableLabel: normalizeSearchText(item.label),
      })),
    [options],
  );

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return options;

    return searchIndex
      .filter((entry) => entry.searchableLabel.includes(normalizedQuery))
      .map((entry) => entry.item);
  }, [normalizedQuery, options, searchIndex]);

  const trimmedQuery = searchText.trim().replace(/\s+/g, " ");
  const canAddCustom =
    allowCustomItem &&
    searchable &&
    trimmedQuery.length > 0 &&
    !searchIndex.some(
      (entry) => entry.searchableLabel === normalizeSearchText(trimmedQuery),
    );

  const rowCount = filteredOptions.length + (canAddCustom ? 1 : 0);

  // ارتفاع لیست از قبل حساب می‌شود تا شیت با محتوای خودش اندازه بگیرد و
  // FlatList محدوده اسکرول مشخصی داشته باشد.
  const listHeight = useMemo(() => {
    const chromeHeight = 132 + (searchable ? 58 : 0) + insets.bottom;
    const maxListHeight = Math.max(
      ITEM_HEIGHT * 3,
      windowHeight * SHEET_MAX_HEIGHT_RATIO - chromeHeight,
    );

    if (rowCount === 0) return Math.min(160, maxListHeight);
    return Math.min(rowCount * ITEM_HEIGHT, maxListHeight);
  }, [insets.bottom, rowCount, searchable, windowHeight]);

  const handleSelect = useCallback(
    (nextValue: string) => {
      if (value === undefined) setInternalValue(nextValue);
      onValueChange?.(nextValue);
      handleClose();
    },
    [handleClose, onValueChange, value],
  );

  const handleAddCustom = useCallback(() => {
    if (!trimmedQuery) return;

    const newItem = { label: trimmedQuery, value: trimmedQuery };
    setCustomItems((previous) =>
      previous.some((item) => item.value === newItem.value)
        ? previous
        : [...previous, newItem],
    );
    handleSelect(newItem.value);
  }, [handleSelect, trimmedQuery]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SelectItem>) => (
      <OptionRow
        item={item}
        selected={item.value === currentValue}
        textColor={textColor}
        accentColor={tintColor}
        selectedBackground={infoBackground}
        pressedBackground={cardColor}
        onSelect={handleSelect}
      />
    ),
    [cardColor, currentValue, handleSelect, infoBackground, textColor, tintColor],
  );

  const keyExtractor = useCallback(
    (item: SelectItem, index: number) => `${item.value}-${index}`,
    [],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<SelectItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const sheetTravel = windowHeight;
  const sheetTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetTravel, 0],
  });
  const chevronRotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const hasValue = selectedLabel !== null;
  const sheetTitle = modalTitle || label || placeholder;
  const optionCountLabel =
    filteredOptions.length > 0
      ? `${filteredOptions.length.toLocaleString("fa-IR")} گزینه`
      : "بدون گزینه";

  const addRow = canAddCustom ? (
    <View style={styles.rowWrapper}>
      <Pressable
        onPress={handleAddCustom}
        accessibilityRole="button"
        accessibilityLabel={`افزودن ${trimmedQuery}`}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: pressed ? cardColor : "transparent" },
        ]}
      >
        <View style={styles.rowIndicator}>
          <IconSymbol
            type="Ionicons"
            name="add-circle"
            size={20}
            color={tintColor}
          />
        </View>
        <Span
          numberOfLines={1}
          style={[
            styles.rowLabel,
            { color: tintColor, fontFamily: "VazirBold" },
          ]}
        >
          افزودن «{trimmedQuery}»
        </Span>
      </Pressable>
    </View>
  ) : null;

  return (
    <View style={[styles.wrapper, style]} {...rest}>
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label || placeholder}${
          selectedLabel ? `: ${selectedLabel}` : ""
        }`}
        accessibilityState={{ disabled, expanded: isOpen }}
        style={({ pressed }) => [
          styles.field,
          {
            borderColor: isOpen || hasValue ? tintColor : borderColor,
            opacity: disabled ? 0.55 : 1,
            transform: [{ scale: pressed && !isOpen ? 0.995 : 1 }],
          },
        ]}
      >
        <View
          style={[
            styles.chevron,
            { backgroundColor: isOpen || hasValue ? tintColor : cardColor },
          ]}
        >
          <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
            <IconSymbol
              type="Ionicons"
              name="chevron-down"
              size={16}
              color={isOpen || hasValue ? backgroundColor : mutedColor}
            />
          </Animated.View>
        </View>

        <Span
          numberOfLines={1}
          style={[
            styles.fieldValue,
            {
              color: hasValue ? textColor : mutedColor,
              fontFamily: hasValue ? "VazirBold" : "VazirMedium",
            },
          ]}
        >
          {selectedLabel ?? placeholder}
        </Span>
      </Pressable>

      {label ? (
        <Span
          style={[
            styles.floatingLabel,
            {
              backgroundColor,
              color: hasValue ? textColor : mutedColor,
            },
          ]}
        >
          {label}
        </Span>
      ) : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.modalRoot}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: overlayColor, opacity: overlayOpacity },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="بستن"
            />
          </Animated.View>

          <KeyboardAvoidingView
            pointerEvents="box-none"
            style={styles.sheetPositioner}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Animated.View
              style={[
                styles.sheet,
                {
                  backgroundColor,
                  paddingBottom: insets.bottom + 10,
                  maxHeight: windowHeight * SHEET_MAX_HEIGHT_RATIO,
                  transform: [{ translateY: sheetTranslateY }],
                },
              ]}
            >
              <View style={styles.handleWrapper}>
                <View
                  style={[styles.handle, { backgroundColor: dividerColor }]}
                />
              </View>

              <View style={styles.header}>
                <Pressable
                  onPress={handleClose}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="بستن"
                  style={({ pressed }) => [
                    styles.closeButton,
                    {
                      backgroundColor: cardColor,
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <IconSymbol
                    type="Ionicons"
                    name="close"
                    size={18}
                    color={textColor}
                  />
                </Pressable>

                <View style={styles.headerText}>
                  <Span
                    type="defaultBold"
                    numberOfLines={1}
                    style={styles.headerTitle}
                  >
                    {sheetTitle}
                  </Span>
                  <Span
                    numberOfLines={1}
                    style={[styles.headerSubtitle, { color: mutedColor }]}
                  >
                    {optionCountLabel}
                  </Span>
                </View>
              </View>

              {searchable ? (
                <View
                  style={[
                    styles.searchBox,
                    { backgroundColor: surfaceColor, borderColor: dividerColor },
                  ]}
                >
                  {searchText.length > 0 ? (
                    <Pressable
                      onPress={() => setSearchText("")}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="پاک کردن جستجو"
                    >
                      <IconSymbol
                        type="Ionicons"
                        name="close-circle"
                        size={18}
                        color={mutedColor}
                      />
                    </Pressable>
                  ) : null}

                  <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={mutedColor}
                    style={[styles.searchInput, { color: textColor }]}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                    underlineColorAndroid="transparent"
                    selectionColor={tintColor}
                    accessibilityLabel="جستجو در گزینه‌ها"
                  />

                  <IconSymbol
                    type="Ionicons"
                    name="search-outline"
                    size={18}
                    color={mutedColor}
                  />
                </View>
              ) : null}

              <FlatList
                data={filteredOptions}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                style={{ height: listHeight }}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={addRow}
                ListEmptyComponent={
                  canAddCustom ? null : (
                    <View style={styles.emptyState}>
                      <IconSymbol
                        type="Ionicons"
                        name="file-tray-outline"
                        size={24}
                        color={mutedColor}
                      />
                      <Span
                        style={[styles.emptyText, { color: mutedColor }]}
                      >
                        {emptyText}
                      </Span>
                    </View>
                  )
                }
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                initialNumToRender={12}
                maxToRenderPerBatch={14}
                updateCellsBatchingPeriod={40}
                windowSize={7}
                removeClippedSubviews={Platform.OS === "android"}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 60,
    zIndex: 1,
  },
  field: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 100,
    paddingHorizontal: 10,
    columnGap: 10,
  },
  fieldValue: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
    direction: "rtl",
    paddingRight: 8,
  },
  chevron: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingLabel: {
    position: "absolute",
    top: -11,
    right: 46,
    zIndex: 2,
    paddingHorizontal: 6,
    fontSize: 12,
    lineHeight: 20,
  },
  modalRoot: {
    flex: 1,
  },
  sheetPositioner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 0,
    elevation: 24,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
  },
  handleWrapper: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 2,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 52,
    columnGap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    direction: "rtl",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 11,
    textAlign: "right",
    direction: "rtl",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    columnGap: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontFamily: "VazirRegular",
    textAlign: "right",
    direction: "rtl",
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  rowWrapper: {
    height: ITEM_HEIGHT,
    paddingVertical: 2,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    columnGap: 8,
  },
  rowIndicator: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
    direction: "rtl",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    rowGap: 6,
  },
  emptyText: {
    fontSize: 13,
  },
});
