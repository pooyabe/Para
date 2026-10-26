import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Span } from "./Span";

export type SelectProps = ViewProps & {
  placeholder?: string;
  items_array?: Array<{ label: string; value: string }>;
  label?: string | null;
  searchable?: boolean;
  onValueChange?: (value: string) => void;
  initialValue?: string | null;
};

export function Select({
  style,
  placeholder = "انتخاب",
  label = "",
  items_array = [],
  searchable = false,
  onValueChange,
  initialValue = null,
  ...rest
}: SelectProps) {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");
  const cardColor = useThemeColor({}, "card");
  const tintColor = useThemeColor({}, "tint");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(initialValue);
  const [items, setItems] = useState(items_array);

  // Sync external changes to items_array
  useEffect(() => {
    setItems(items_array);
  }, [items_array]);

  return (
    <View style={[styles.SelectInputGroup, { borderColor }, style]}>
      {label && (
        <Span style={[styles.SelectoverLabel, { backgroundColor, color: textColor }]}>
          {label}
        </Span>
      )}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(value);
          setValue(newValue);
          onValueChange?.(newValue);
        }}
        setItems={setItems}
        language="FA"
        rtl={true}
        theme={colorScheme === "dark" ? "DARK" : "LIGHT"}
        listMode="MODAL"
        modalAnimationType="slide"
        placeholder={placeholder}
        searchPlaceholder="جستجو یا اضافه کردن آیتم جدید"
        searchable={searchable}
        addCustomItem={true}
        showTickIcon={true}
        closeOnBackPressed={true}
        itemSeparator={false}
        searchPlaceholderTextColor={mutedColor}
        searchTextInputStyle={{
          borderColor: tintColor,
          color: textColor,
          backgroundColor: cardColor,
          fontFamily: "VazirRegular",
          borderRadius: 100,
          borderWidth: 2,
        }}
        modalContentContainerStyle={{
          backgroundColor: backgroundColor,
        }}
        modalTitleStyle={{
          color: textColor,
          fontFamily: "VazirMedium",
        }}
        placeholderStyle={{
          direction: "rtl",
          color: mutedColor,
          fontFamily: "VazirMedium",
          paddingRight: 40,
          paddingBottom: 10,
        }}
        dropDownContainerStyle={{
          direction: "rtl",
          backgroundColor: surfaceColor,
          borderRadius: 15,
          borderWidth: 0,
          padding: 5,
        }}
        style={{
          backgroundColor: "transparent",
          borderWidth: 0,
        }}
        labelStyle={{
          color: textColor,
          fontFamily: "VazirBold",
          direction: "rtl",
          paddingRight: 40,
          paddingLeft: 40,
          paddingTop: 0,
          paddingBottom: 10,
        }}
        listItemLabelStyle={{
          color: textColor,
          fontFamily: "VazirBold",
          direction: "rtl",
          fontSize: 16,
        }}
        selectedItemContainerStyle={{
          backgroundColor: cardColor,
          direction: "rtl",
        }}
        tickIconContainerStyle={{
          padding: 10,
        }}
        arrowIconStyle={{
          marginRight: 20,
          marginLeft: 20,
          marginTop: 0,
          marginBottom: 10,
        }}
        customItemLabelStyle={{
          color: textColor,
          fontFamily: "VazirRegular",
          direction: "rtl",
          fontSize: 18,
          fontWeight: "normal",
          fontStyle: "normal",
          paddingRight: 40,
        }}
      />
    </View>
  );
}

// === Style ===
const styles = StyleSheet.create({
  SelectInputGroup: {
    borderWidth: 1.5,
    width: "100%",
    borderRadius: 100,
    zIndex: 1,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  SelectoverLabel: {
    zIndex: 2,
    alignSelf: "flex-end",
    marginRight: 50,
    marginLeft: 50,
    paddingRight: 5,
    paddingLeft: 5,
  },
});
