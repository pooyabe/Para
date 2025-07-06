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
        paddingRight: 0,
        paddingLeft: 0,
        direction: "ltr",
        height: "auto",
      }}
    >
      <TouchableOpacity
        onPress={() =>
          // router.navigate("/about")
          console.log("OK")
        }
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
      <Div
        style={{
          flex: 1,
          direction: "rtl",
          paddingRight: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.navigate("/(reports)/report")}
          style={{
            borderWidth: 1,
            borderRadius: 50,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            columnGap: 10,
            padding: 5,
            paddingRight: 15,
            paddingLeft: 15,
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: Colors[colorScheme].theGreen,
          }}
        >
          <IconSymbol
            type="Ionicons"
            name="wallet-outline"
            size={25}
            color={Colors[colorScheme].background}
          />
          <Span
            type="default"
            style={{
              fontSize: 14,
              color: Colors[colorScheme].background,
            }}
          >
            اوضاعم چطوره؟
          </Span>
        </TouchableOpacity>
      </Div>
    </Div>
  );
}
