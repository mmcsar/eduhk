import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FileText, Camera } from 'lucide-react-native';

export default function DocumentsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('documents.title')}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.uploadButton}>
          <Camera color="#2563eb" size={24} />
          <Text style={styles.uploadText}>{t('documents.uploadNew')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('documents.recent')}</Text>
        <DocumentItem
          title="Bill of Lading - MSN-000145"
          date="2024-01-15"
          type="PDF"
        />
        <DocumentItem
          title="Proof of Delivery - MSN-000144"
          date="2024-01-14"
          type="Image"
        />
      </View>
    </ScrollView>
  );
}

function DocumentItem({ title, date, type }: any) {
  return (
    <View style={styles.documentItem}>
      <FileText color="#2563eb" size={24} />
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{title}</Text>
        <Text style={styles.documentDate}>{date}</Text>
      </View>
      <Text style={styles.documentType}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2563eb',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  documentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  documentType: {
    fontSize: 12,
    color: '#6b7280',
  },
});
