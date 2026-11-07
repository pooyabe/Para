import {
  Div,
  IconSymbol,
  Input,
  Mother,
  Radio,
  SButton,
  Select,
  Spacer,
  Span,
} from "@/components/Elements";
import { Colors } from "@/constants/Colors";
import { useCategoryEditor } from "@/hooks/BackEnd/Pages/useCategoryEditor";
import { type CategoryItem, type CategoryKind } from "@/hooks/DB";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type CategorySection = {
  key: CategoryKind;
  /** برچسب بخش در انتخاب‌گر بالای صفحه */
  label: string;
  /** نام یک مورد از این بخش، برای متن‌های صفحه */
  itemLabel: string;
};

const SECTIONS: CategorySection[] = [
  { key: "spending", label: "هزینه‌ها", itemLabel: "دسته هزینه" },
  { key: "incomeReason", label: "دلیل درآمد", itemLabel: "دلیل درآمد" },
  { key: "incomeDestination", label: "محل درآمد", itemLabel: "محل درآمد" },
];

/**
 * نویسه‌های عربی و نیم‌فاصله را یکدست می‌کند تا جستجو با تایپ ساده هم نتیجه بدهد.
 */
function normalizeTitle(text: string): string {
  return text
    .replace(/\u064a/g, "\u06cc") // ي عربی → ی فارسی
    .replace(/\u0643/g, "\u06a9") // ك عربی → ک فارسی
    .replace(/\u200c/g, " ") // نیم‌فاصله
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function formatCount(count: number): string {
  if (count === 0) return "بدون تراکنش";
  return `${count.toLocaleString("fa-IR")} تراکنش`;
}

export default function CategoriesPage() {
  const colors = Colors[useColorScheme()];

  const {
    kind,
    items,
    loading,
    saving,
    selectKind,
    renameItem,
    deleteItem,
    moveItem,
  } = useCategoryEditor();

  // جستجوی زنده در فهرست همین بخش
  const [searchQuery, setSearchQuery] = useState("");

  // مودال تغییر نام
  const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // مودال حذف
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);

  const activeSection =
    SECTIONS.find((section) => section.key === kind) ?? SECTIONS[0];
  const selectedIndex = Math.max(
    SECTIONS.findIndex((section) => section.key === kind),
    0,
  );

  /** فهرست نمایش‌داده‌شده؛ با هر تغییر متن جستجو دوباره حساب می‌شود. */
  const visibleItems = useMemo(() => {
    const needle = normalizeTitle(searchQuery);
    if (!needle) return items;

    return items.filter((item) =>
      normalizeTitle(item.title).includes(needle),
    );
  }, [items, searchQuery]);

  const isSearching = normalizeTitle(searchQuery).length > 0;

  const transferOptions = useMemo(
    () =>
      items
        .filter((item) => item.id !== deleteTarget?.id)
        .map((item) => ({ label: item.title, value: String(item.id) })),
    [deleteTarget?.id, items],
  );

  const canTransfer =
    (deleteTarget?.transactionCount ?? 0) > 0 && transferOptions.length > 0;

  const closeEdit = () => {
    setEditTarget(null);
    setEditTitle("");
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setTransferTargetId(null);
  };

  const openEdit = (item: CategoryItem) => {
    setEditTarget(item);
    setEditTitle(item.title);
  };

  const openDelete = (item: CategoryItem) => {
    setDeleteTarget(item);
    setTransferTargetId(null);
  };

  const handleSelectKind = (nextKind: CategoryKind) => {
    closeEdit();
    closeDelete();
    setSearchQuery("");
    selectKind(nextKind);
  };

  const confirmRename = () => {
    if (!editTarget) return;

    const nextTitle = editTitle.trim().replace(/\s+/g, " ");

    if (!nextTitle || nextTitle === editTarget.title) {
      closeEdit();
      return;
    }

    if (nextTitle.length > 60) {
      Alert.alert("نام خیلی بلند است", "نام باید حداکثر ۶۰ نویسه باشد.");
      return;
    }

    Alert.alert(
      "تغییر نام",
      `«${editTarget.title}» به «${nextTitle}» تغییر کند؟ این نام روی همه تراکنش‌های این مورد هم دیده می‌شه.`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "ذخیره",
          onPress: async () => {
            if (await renameItem(editTarget.id, nextTitle)) {
              closeEdit();
            }
          },
        },
      ],
    );
  };

  const confirmDeleteWithTransactions = () => {
    if (!deleteTarget) return;

    const target = deleteTarget;
    const count = target.transactionCount;
    const message =
      count > 0
        ? `«${target.title}» و ${formatCount(
            count,
          )} برای همیشه از برنامه حذف می‌شن. این کار برگشت‌پذیر نیست.`
        : `«${target.title}» از فهرست ${activeSection.label} حذف می‌شه.`;

    Alert.alert("حذف کامل", message, [
      { text: "لغو", style: "cancel" },
      {
        text: "حذف کن",
        style: "destructive",
        onPress: async () => {
          if (await deleteItem(target.id)) {
            closeDelete();
          }
        },
      },
    ]);
  };

  const confirmTransfer = () => {
    if (!deleteTarget || !transferTargetId) return;

    const target = deleteTarget;
    const destination = items.find(
      (item) => String(item.id) === transferTargetId,
    );

    if (!destination) return;

    Alert.alert(
      "انتقال تراکنش‌ها",
      `همه ${formatCount(
        target.transactionCount,
      )} «${target.title}» به «${destination.title}» منتقل و بعد «${
        target.title
      }» حذف می‌شه. ادامه می‌دی؟`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "انتقال و حذف",
          style: "destructive",
          onPress: async () => {
            if (await moveItem(target.id, destination.id)) {
              closeDelete();
            }
          },
        },
      ],
    );
  };

  return (
    <Mother style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Span type="title" style={styles.pageTitle}>
          دسته‌بندی‌ها
        </Span>
        <Span style={[styles.intro, { color: colors.muted }]}>
          دسته‌های هزینه، دلیل‌های درآمد و محل‌های درآمد را از همین‌جا مدیریت
          کن. تغییر نام روی همه تراکنش‌های همان مورد اعمال می‌شه.
        </Span>

        <Spacer height={16} />

        <Radio
          Items={SECTIONS.map((section) => section.label)}
          selectedIndex={selectedIndex}
          onChangeValueWithIndex={(value, index) => {
            handleSelectKind(SECTIONS[index].key);
          }}
        />

        <Spacer height={16} />

        <Input
          label="جستجو"
          placeholder="بخشی از نام را بنویس"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          returnKeyType="search"
        />

        <Spacer height={16} />

        <Span style={[styles.sectionHint, { color: colors.muted }]}>
          {loading
            ? "در حال خواندن فهرست…"
            : isSearching
              ? `${visibleItems.length.toLocaleString(
                  "fa-IR",
                )} نتیجه از ${items.length.toLocaleString("fa-IR")} مورد`
              : `${activeSection.label} (${items.length.toLocaleString("fa-IR")})`}
        </Span>

        <Spacer height={10} />

        {!loading && isSearching && items.length > 0 && visibleItems.length === 0 ? (
          <Div
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <IconSymbol
              type="Ionicons"
              name="search-outline"
              size={26}
              color={colors.muted}
            />
            <Span style={[styles.emptyText, { color: colors.muted }]}>
              موردی با «{searchQuery.trim()}» پیدا نشد.
            </Span>
          </Div>
        ) : null}

        {!loading && items.length === 0 ? (
          <Div
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <IconSymbol
              type="Ionicons"
              name="pricetags-outline"
              size={26}
              color={colors.muted}
            />
            <Span style={[styles.emptyText, { color: colors.muted }]}>
              هنوز موردی در این بخش ساخته نشده. با ثبت اولین تراکنش، موردها
              همین‌جا نمایش داده می‌شن.
            </Span>
          </Div>
        ) : null}

        {visibleItems.map((item) => (
          <Div
            key={item.id}
            style={[
              styles.itemCard,
              { backgroundColor: colors.card, borderColor: colors.divider },
            ]}
          >
            <Div style={styles.itemHeader}>
              <Span
                type="defaultSemiBold"
                style={styles.itemTitle}
                numberOfLines={2}
              >
                {item.title}
              </Span>
              <Span
                type="subtitle"
                style={[
                  styles.countBadge,
                  { backgroundColor: colors.infoBackground, color: colors.muted },
                ]}
              >
                {formatCount(item.transactionCount)}
              </Span>
            </Div>

            <Div style={styles.itemActions}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`ویرایش نام ${item.title}`}
                onPress={() => openEdit(item)}
                style={[styles.actionButton, { borderColor: colors.tint }]}
              >
                <IconSymbol
                  type="Ionicons"
                  name="create-outline"
                  size={16}
                  color={colors.tint}
                />
                <Span type="subtitle" style={{ color: colors.tint }}>
                  ویرایش نام
                </Span>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`حذف ${item.title}`}
                onPress={() => openDelete(item)}
                style={[styles.actionButton, { borderColor: colors.theRed }]}
              >
                <IconSymbol
                  type="Ionicons"
                  name="trash-outline"
                  size={16}
                  color={colors.theRed}
                />
                <Span type="subtitle" style={{ color: colors.theRed }}>
                  حذف
                </Span>
              </TouchableOpacity>
            </Div>
          </Div>
        ))}

        <Spacer height={24} />
      </ScrollView>

      {/* تغییر نام */}
      <Modal
        visible={editTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
            onPress={closeEdit}
            accessibilityRole="button"
            accessibilityLabel="بستن"
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.modalBackground,
                borderColor: colors.divider,
              },
            ]}
          >
            <Span type="defaultBold" style={styles.sheetTitle}>
              ویرایش نام {activeSection.itemLabel}
            </Span>
            <Span type="subtitle" style={[styles.sheetHint, { color: colors.muted }]}>
              نام تازه روی {formatCount(editTarget?.transactionCount ?? 0)} این
              مورد نمایش داده می‌شه.
            </Span>

            <Spacer height={16} />

            <Input
              label="نام جدید"
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder={editTarget?.title ?? ""}
              autoFocus
            />

            <Spacer height={16} />

            <SButton
              text={saving ? "در حال ذخیره…" : "ذخیره نام"}
              disabled={saving || editTitle.trim().length === 0}
              onPress={confirmRename}
              style={saving ? { opacity: 0.6 } : undefined}
            />

            <TouchableOpacity
              onPress={closeEdit}
              accessibilityRole="button"
              style={styles.cancelButton}
            >
              <Span style={{ color: colors.muted }}>انصراف</Span>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* حذف و انتقال */}
      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={closeDelete}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
            onPress={closeDelete}
            accessibilityRole="button"
            accessibilityLabel="بستن"
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.modalBackground,
                borderColor: colors.divider,
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              <Span type="defaultBold" style={styles.sheetTitle}>
                حذف «{deleteTarget?.title}»
              </Span>
              <Span
                type="subtitle"
                style={[styles.sheetHint, { color: colors.theRed }]}
              >
                حواست باشه این بخش خطرناکه؛ بعد از انجام، برگشت‌پذیر نیست.
              </Span>

              <Spacer height={16} />

              <Div
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.dangerBackground,
                    borderColor: colors.theRed,
                  },
                ]}
              >
                <Span type="defaultSemiBold">۱. حذف با همه تراکنش‌ها</Span>
                <Span
                  type="subtitle"
                  style={[styles.optionHint, { color: colors.muted }]}
                >
                  {deleteTarget && deleteTarget.transactionCount > 0
                    ? `«${deleteTarget.title}» و ${formatCount(
                        deleteTarget.transactionCount,
                      )} برای همیشه حذف می‌شن.`
                    : `«${deleteTarget?.title ?? ""}» حذف می‌شه؛ تراکنشی برای حذف ندارد.`}
                </Span>

                {deleteTarget && deleteTarget.loanTransactionCount > 0 ? (
                  <Span
                    type="subtitle"
                    style={[styles.optionHint, { color: colors.theOrange }]}
                  >
                    {deleteTarget.loanTransactionCount.toLocaleString("fa-IR")}{' '}
                    مورد از این تراکنش‌ها به یک وام وصل‌اند؛ با حذفشان مبلغ
                    پرداخت‌شده آن وام هم کم می‌شه.
                  </Span>
                ) : null}

                <SButton
                  text={saving ? "در حال حذف…" : "حذف کامل"}
                  disabled={saving}
                  onPress={confirmDeleteWithTransactions}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: colors.dangerBackground,
                      borderColor: colors.theRed,
                    },
                    saving ? { opacity: 0.6 } : undefined,
                  ]}
                />
              </Div>

              <Spacer height={12} />

              <Div
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.cardAlt,
                    borderColor: colors.divider,
                  },
                ]}
              >
                <Span type="defaultSemiBold">
                  ۲. انتقال تراکنش‌ها به {activeSection.itemLabel} دیگر
                </Span>
                <Span
                  type="subtitle"
                  style={[styles.optionHint, { color: colors.muted }]}
                >
                  تراکنش‌ها به موردی که انتخاب می‌کنی منتقل می‌شن و بعد این مورد
                  خالی حذف می‌شه.
                </Span>

                <Spacer height={14} />

                <Select
                  label="انتقال به"
                  placeholder={
                    canTransfer ? "یک مورد را انتخاب کن" : "مورد دیگری موجود نیست"
                  }
                  items_array={transferOptions}
                  value={transferTargetId}
                  onValueChange={setTransferTargetId}
                  allowCustomItem={false}
                  searchable
                  disabled={!canTransfer || saving}
                />

                <Spacer height={14} />

                <SButton
                  text={saving ? "در حال انتقال…" : "انتقال و حذف"}
                  disabled={!canTransfer || !transferTargetId || saving}
                  onPress={confirmTransfer}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: colors.warningBackground,
                      borderColor: colors.theOrange,
                    },
                    !canTransfer || !transferTargetId || saving
                      ? { opacity: 0.5 }
                      : undefined,
                  ]}
                />
              </Div>

              <TouchableOpacity
                onPress={closeDelete}
                accessibilityRole="button"
                style={styles.cancelButton}
              >
                <Span style={{ color: colors.muted }}>انصراف</Span>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Mother>
  );
}

const styles = StyleSheet.create({
  container: { direction: "rtl" },
  content: { paddingTop: 12, paddingBottom: 32 },
  pageTitle: { fontSize: 26, },
  intro: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 22,
    textAlign: "justify",
  },
  sectionHint: { fontSize: 13 },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    rowGap: 8,
  },
  emptyText: { fontSize: 13, lineHeight: 22, textAlign: "center" },
  itemCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    rowGap: 12,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  itemTitle: { flex: 1, fontSize: 16 },
  countBadge: {
    overflow: "hidden",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    borderWidth: 1.5,
    borderRadius: 100,
    paddingHorizontal: 14,
    height: 34,
  },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
    maxHeight: "88%",
  },
  sheetContent: { paddingBottom: 4 },
  sheetTitle: { fontSize: 18 },
  sheetHint: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 20,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    rowGap: 8,
  },
  optionHint: { fontSize: 12, lineHeight: 20 },
  optionButton: { height: 46, borderWidth: 2 },
  cancelButton: { alignItems: "center", paddingVertical: 14 },
});
