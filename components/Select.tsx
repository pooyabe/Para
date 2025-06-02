import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View, type TextInputProps } from "react-native";
import { Span } from "./Span";

import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export type InputProps = TextInputProps & {
  placeholder?: null | string;
  items_array: Array<{ label: string; value: any }>;
  label?: null | string;
  searchable?: boolean;
};

export function Select({
  style,
  placeholder = "",
  label = "",
  items_array = [],
  searchable = false,
  ...rest
}: InputProps) {
  // Theme color retrive
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] =
    useState<Array<{ label: string; value: any }>>(items_array);

  return (
    <View style={styles.inputGroup}>
      <Span style={styles.overLabel}>{label}</Span>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        language="FA"
        rtl={true}
        theme="DARK"
        listMode="MODAL"
        modalAnimationType="slide"
        placeholder="انتخاب"
        searchable={searchable}
        addCustomItem={true}
        showTickIcon={true}
        closeOnBackPressed={true}
        itemSeparator={false}
        placeholderStyle={{
          direction: "rtl",
          fontFamily: "VazirMedium",
          paddingRight: 40,
          paddingBottom: 10,
        }}
        dropDownContainerStyle={{
          direction: "rtl",
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
        }}
        selectedItemContainerStyle={{
          backgroundColor: "#000",
        }}
        arrowIconStyle={{
          marginRight: 20,
          marginLeft: 20,
          marginTop: 0,
          marginBottom: 10,
        }}
      />
    </View>
  );
}

/**
 *
 * Styles
 *
 */

// Theme styles
const borderColor = useThemeColor({}, "border");

const styles = StyleSheet.create({
  inputGroup: {
    borderWidth: 1.5,
    width: "100%",
    borderRadius: 100,
    borderColor,
    zIndex: 1,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  defaultTextInputStyle: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 50,
    fontSize: 18,
    fontFamily: "VazirRegular",
    backgroundColor: "transparent",
    textAlign: "center",
    zIndex: 1,
    paddingTop: 0,
  },

  ltr: {
    direction: "ltr",
  },
  rtl: {
    direction: "rtl",
  },

  /**
   *
   * Label Style
   *
   */
  overLabel: {
    backgroundColor: "rgb(24, 31, 47)",
    zIndex: 2,
    alignSelf: "flex-end",
    marginRight: 50,
    marginLeft: 50,
    paddingRight: 5,
    paddingLeft: 5,
  },
});
