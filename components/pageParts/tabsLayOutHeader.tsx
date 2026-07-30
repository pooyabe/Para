import { Dimensions, Image, TouchableOpacity } from "react-native";
import { Div, IconSymbol, Span } from "../Elements";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";

export function TabsHeader() {
  const ScreenHeight = Dimensions.get("screen").height;
  const colorScheme = useColorScheme() as "light" | "dark";

  return (
    <Div
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 0,
        paddingTop: ScreenHeight * 0.06,
        paddingHorizontal: 35,
        direction: "rtl",
        height: "auto",
        display: "flex",
        columnGap: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => router.navigate("/about")}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 20,
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          alt="Para"
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <Span type="title" style={{ fontSize: 25, fontWeight: "normal" }}>
          پارا
        </Span>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.navigate("/(reports)/report")}
        style={{
          borderWidth: 2,
          borderRadius: 100,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          columnGap: 5,
          padding: 1,
          paddingRight: 7,
          paddingLeft: 7,
          justifyContent: "space-around",
          alignItems: "center",
          borderColor: Colors[colorScheme].theGreen,
        }}
      >
        <IconSymbol
          type="Ionicons"
          name="wallet-outline"
          size={15}
          color={Colors[colorScheme].text}
        />
        <Span
          type="default"
          style={{
            fontSize: 12,
            color: Colors[colorScheme].text,
          }}
        >
          اوضاعم چطوره؟
        </Span>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.navigate("/(reports)/transactionsList")}
        style={{
          borderWidth: 2,
          borderRadius: 100,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          columnGap: 5,
          padding: 1,
          paddingRight: 7,
          paddingLeft: 7,
          justifyContent: "space-around",
          alignItems: "center",
          borderColor: Colors[colorScheme].theOrange,
        }}
      >
        <IconSymbol
          type="MaterialIcons"
          name="list-alt"
          size={15}
          color={Colors[colorScheme].text}
        />
        <Span
          type="default"
          style={{
            fontSize: 12,
            color: Colors[colorScheme].text,
          }}
        >
          تراکنش‌ها
        </Span>
      </TouchableOpacity>
    </Div>
  );
}
