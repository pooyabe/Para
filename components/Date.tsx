import DatePicker, { type Props } from "@mohamadkh75/react-native-jalali-datepicker";

export type DateProps = Props & {};

export function Date(props: DateProps) {
  return (
    <DatePicker
      {...props}
      style={{
        width: "100%",
        height: 50,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10,
      }}
    />
  );
}