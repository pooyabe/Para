import { Div, Span } from "@/components/Elements";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";

import { PieChart, PieChartPropsType } from "react-native-gifted-charts";

// Get Screen Dimensions
const screenWidth = Dimensions.get("window").width;

type pieChartOneType = PieChartPropsType & {
  data: Array<{
    value: number;
    text: string;
    color: string;
    amount?: number;
    items?: Array<{ title: string; amount: number; percent: number }>;
  }>;
  title?: string;
};

export function PieChartOne({
  data,
  title = "نمودار دایره‌ای",
}: pieChartOneType) {
  /**
   *
   * Get the Colors
   *
   */
  const colors = Colors[useColorScheme()];
  const theBGColor = useThemeColor({}, "background");
  const theTintColor = useThemeColor({}, "tint");

  const formatNumber = (num: number) => {
    if (num == null) return "0";
    try {
      return Number(num).toLocaleString();
    } catch {
      return String(num);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    text: string;
    amount?: number;
    value: number;
    items?: Array<{ title: string; amount: number; percent: number }>;
  } | null>(null);

  const showDetails = (item: {
    text: string;
    amount?: number;
    value: number;
    items?: Array<{ title: string; amount: number; percent: number }>;
  }) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <Div
      style={[
        styles.chartWithBG,
        styles.singleChart,
        {
          direction: "rtl",
          backgroundColor: colors.infoBackground,
          borderColor: colors.theLightBlue,
        },
      ]}
    >
      <Span type="title" style={styles.chartTitle}>
        {title}
      </Span>
      <PieChart
        strokeColor={colors.surface}
        strokeWidth={2}
        donut
        data={data}
        innerCircleColor={colors.surface}
        innerCircleBorderWidth={0}
        innerRadius={80}
        innerCircleBorderColor={theTintColor}
        labelsPosition="onBorder"
        textSize={11}
        textColor={theBGColor}
        inwardExtraLengthForFocused={50}
        tooltipDuration={1500}
        showValuesAsTooltipText
        showTooltip
        tooltipBackgroundColor={theTintColor}
        tooltipWidth={100}
        tooltipComponent={(item: number) => (
          <Span
            style={[
              styles.tooltipStyle,
              { backgroundColor: theTintColor, color: theBGColor },
            ]}
            type="default"
          >
            {data[item].text}
            {"\n"}
            {data[item].value}%
          </Span>
        )}
      />

      <Div style={styles.dataLegendContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => showDetails(item)}
            activeOpacity={0.7}
            style={styles.legendTouchable}
          >
            <Div style={styles.dataLegendItem}>
              <Span
                style={[
                  styles.dataLegendIndicator,
                  {
                    backgroundColor: item.color || colors.background,
                    fontSize: 12,
                  },
                ]}
              >
                {item.value}%
              </Span>

              <Span style={styles.dataLegendLabel} type="default">
                {item.text || ""}
              </Span>
            </Div>
          </TouchableOpacity>
        ))}
      </Div>

      {/* Details Modal */}
      {selectedItem && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          >
            <Div style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Span type="title" style={styles.modalTitle}>
                {selectedItem.text}
                {selectedItem.amount
                  ? ` — جمع: ${formatNumber(selectedItem.amount)} تومان`
                  : ""}
              </Span>

              <Span style={[styles.modalSubtitle, { color: colors.muted }]}>
                درصد: {selectedItem.value}%
              </Span>

              {selectedItem.items && selectedItem.items.length > 0 ? (
                <ScrollView style={styles.modalItems}>
                  {selectedItem.items.map((sub, idx) => (
                    <Div
                      style={[styles.modalItem, { borderBottomColor: colors.divider }]}
                      key={idx}
                    >
                      <Span style={styles.modalItemTitle}>{sub.title}</Span>
                      <Span style={[styles.modalItemAmount, { color: colors.muted }]}>
                        {formatNumber(sub.amount)} تومان ({sub.percent}%)
                      </Span>
                    </Div>
                  ))}
                </ScrollView>
              ) : (
                <Div style={styles.modalSingle}>
                  <Span>{formatNumber(selectedItem.amount || 0)} تومان</Span>
                </Div>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalCloseButton, { backgroundColor: colors.theLightBlue }]}
                activeOpacity={0.8}
              >
                <Span type="default">باشه</Span>
              </TouchableOpacity>
            </Div>
          </View>
        </Modal>
      )}
    </Div>
  );
}

const styles = StyleSheet.create({
  // Charts
  singleChart: {
    alignItems: "center",
    direction: "ltr",
    paddingTop: 20,
    paddingBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 20,
  },

  chartWithBG: {
    borderRadius: 12,
    borderRightWidth: 4,
    width: screenWidth * 0.95,
    marginTop: 20,
    alignSelf: "center",
  },

  /**
   *
   * Pie chart section
   *
   */
  tooltipStyle: {
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.9,
    fontSize: 12,
  },
  dataLegendContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    width: screenWidth,
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 20,
    paddingHorizontal: 2,
  },
  dataLegendItem: {
    flexDirection: "row",
    width: screenWidth * 0.3,
    alignItems: "center",
    flexWrap: "wrap",
  },
  dataLegendIndicator: {
    marginRight: 10,
    borderRadius: 4,
    padding: 2,
    width: 45,
    textAlign: "center",
  },
  dataLegendLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  legendTouchable: {
    marginRight: 6,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 18,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  modalItems: {
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  modalItemTitle: {
    fontSize: 13,
  },
  modalItemAmount: {
    fontSize: 13,
  },
  modalSingle: {
    marginBottom: 12,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
