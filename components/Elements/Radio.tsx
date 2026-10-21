import { useThemeColor } from "@/hooks/useThemeColor";
import SegmentedControl, {
  SegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import { useEffect, useState } from "react";
import { Span } from "./Span";

export type RadioProps = SegmentedControlProps & {
  Items: Array<string>;
  label?: string | undefined;
  onChangeValueWithIndex?: (value: string, index: number) => void;
};

export function Radio({
  Items = [],
  label = "",
  style,
  selectedIndex: propSelectedIndex,
  onChangeValueWithIndex,
  ...otherProps
}: RadioProps) {
  const [selectedIndex, setSelectedIndex] = useState(propSelectedIndex ?? 0);

  useEffect(() => {
    if (propSelectedIndex !== undefined) {
      setSelectedIndex(propSelectedIndex);
    }
  }, [propSelectedIndex]);

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const theLightBlue = useThemeColor({}, "theLightBlue");

  const currentIndex =
    propSelectedIndex !== undefined ? propSelectedIndex : selectedIndex;

  return (
    <>
      <Span
        style={{
          alignSelf: "flex-end",
          marginRight: 50,
          marginLeft: 50,
          paddingRight: 5,
          paddingLeft: 5,
        }}
      >
        {label}
      </Span>
      <SegmentedControl
        values={Items}
        selectedIndex={currentIndex}
        onChange={(event) => {
          const newIndex = event.nativeEvent.selectedSegmentIndex;
          setSelectedIndex(newIndex);
          onChangeValueWithIndex?.(Items[newIndex], newIndex);
        }}
        onValueChange={(value) => {
          // این تابع فقط برای رفع اخطار لازمه چون SegmentedControl بهش نیاز داره
        }}
        appearance="dark"
        backgroundColor={backgroundColor}
        style={[
          {
            width: "100%",
            height: 60,
            borderRadius: 100,
            borderColor: tintColor,
            borderWidth: 2,
            marginTop: 10,
          },
          style,
        ]}
        fontStyle={{
          fontFamily: "VazirRegular",
          fontSize: 14,
          fontWeight: "normal",
          color: textColor,
        }}
        sliderStyle={{
          borderRadius: 100,
          borderWidth: 0,
          borderColor: tintColor,
          backgroundColor: theLightBlue,
          marginBottom: 1,
        }}
        {...otherProps}
      />
    </>
  );
}
