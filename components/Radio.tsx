import { useThemeColor } from "@/hooks/useThemeColor";
import SegmentedControl, {
  SegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import { Span } from "./Span";

export type RadioProps = SegmentedControlProps & {
  Items: Array<string>;
  label?: string | undefined;
};

export function Radio({
  Items = [],
  label = "برچسب",
  style,
  ...otherProps
}: RadioProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const theLightBlue = useThemeColor({}, "theLightBlue");

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
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
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
          fontSize: 16,
          fontWeight: "normal",
          color: textColor,
        }}
        sliderStyle={{
          borderRadius: 100,
          borderWidth: 0,
          borderColor: tintColor,
          backgroundColor: theLightBlue,
        }}
      />
    </>
  );
}
