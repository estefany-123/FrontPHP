import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    width: "100%",
    height: 200,
    objectFit: "contain",
    marginBottom: 20,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#333",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#e4e4e4",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
    padding: 5,
    textAlign: "center",
    fontSize: 9,
  },
});

type Props = {
  title: string;
  headers: string[];
  accessors: string[];
  data: any[];
// imagen opcional del gráfico
};

const ReportPDF = ({
  title,
  headers,
  accessors,
  data,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.table}>
        {/* Encabezado */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {headers.map((h, i) => (
            <Text key={i} style={styles.tableCell}>
              {h}
            </Text>
          ))}
        </View>

        {/* Filas */}
        {data.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            {accessors.map((acc, j) => (
              <Text key={j} style={styles.tableCell}>
                {Array.isArray(row[acc])
                  ? row[acc].join(", ")
                  : row[acc]?.toString() || ""}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
