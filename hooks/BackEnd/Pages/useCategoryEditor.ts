import { bumpDataRevision } from "@/hooks/BackEnd/useDataRevision";
import {
  deleteCategoryItem,
  getCategoryItems,
  moveCategoryTransactions,
  renameCategoryItem,
  type CategoryError,
  type CategoryItem,
  type CategoryKind,
} from "@/hooks/DB/actions/categories";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner-native";

const ERROR_MESSAGES: Record<CategoryError, string> = {
  "invalid-title": "نام باید بین ۱ تا ۶۰ نویسه باشد.",
  "duplicate-title": "مورد دیگری با همین نام وجود دارد.",
  "not-found": "این مورد دیگر وجود ندارد.",
  "invalid-target": "مقصد انتقال معتبر نیست.",
  failed: "انجام این کار ممکن نشد.",
};

/**
 * ویرایش دسته‌های هزینه، دلیل‌های درآمد و محل‌های درآمد.
 *
 * تایید گرفتن از کاربر با خود صفحه است؛ این هوک فقط می‌خواند، تغییر می‌دهد و
 * فهرست را بعد از هر تغییر از دیتابیس دوباره می‌خواند.
 */
export function useCategoryEditor() {
  const [kind, setKind] = useState<CategoryKind>("spending");
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const loadItems = useCallback(async (nextKind: CategoryKind) => {
    setLoading(true);
    try {
      setItems(await getCategoryItems(nextKind));
    } catch (error) {
      console.error("[Categories] ❌ loading failed:", error);
      toast.error("خواندن فهرست انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      await loadItems(kind);
    };

    fetchItems();
  }, [kind, loadItems]);

  const selectKind = useCallback((nextKind: CategoryKind) => {
    setKind(nextKind);
  }, []);

  /** پس از هر تغییر موفق، گزارش‌های باز هم باید نام‌های تازه را بخوانند. */
  const applyResult = useCallback(
    async (result: { success: boolean; error?: CategoryError }) => {
      if (!result.success) {
        toast.error(
          result.error ? ERROR_MESSAGES[result.error] : ERROR_MESSAGES.failed,
        );
        return false;
      }

      await loadItems(kind);
      bumpDataRevision();
      return true;
    },
    [kind, loadItems],
  );

  const renameItem = useCallback(
    async (id: number, title: string): Promise<boolean> => {
      setSaving(true);
      try {
        const renamed = await applyResult(
          await renameCategoryItem(kind, id, title),
        );
        if (renamed) toast.success("نام با موفقیت تغییر کرد.");
        return renamed;
      } finally {
        setSaving(false);
      }
    },
    [applyResult, kind],
  );

  const deleteItem = useCallback(
    async (id: number): Promise<boolean> => {
      setSaving(true);
      try {
        const deleted = await applyResult(await deleteCategoryItem(kind, id));
        if (deleted) toast.success("مورد و تراکنش‌هایش حذف شد.");
        return deleted;
      } finally {
        setSaving(false);
      }
    },
    [applyResult, kind],
  );

  const moveItem = useCallback(
    async (id: number, targetId: number): Promise<boolean> => {
      setSaving(true);
      try {
        const moved = await applyResult(
          await moveCategoryTransactions(kind, id, targetId),
        );
        if (moved) toast.success("تراکنش‌ها منتقل و مورد حذف شد.");
        return moved;
      } finally {
        setSaving(false);
      }
    },
    [applyResult, kind],
  );

  return {
    kind,
    items,
    loading,
    saving,
    selectKind,
    renameItem,
    deleteItem,
    moveItem,
  };
}
