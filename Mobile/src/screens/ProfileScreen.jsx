import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';

// import { launchImageLibrary } from 'react-native-image-picker';

const COLORS = {
  border: '#111111',
  cardBg: '#FFFFFF',
  shadow: '#111111',
  primary: '#ED2553',
  textPrimary: '#111111',
  textMuted: '#6B7280',
  background: '#F7F5F5',
  fieldBg: '#F9FAFB',
  danger: '#B91C1C',
};

const SHADOW_OFFSET = 5;
const CARD_RADIUS = 18;
const AVATAR_SIZE = 104;

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    fullname: 'Phạm Minh Luân',
    avatarUrl: null,
    majorCode: 'CIT',
    gender: 'Male',
    email: 'luan.pham@eiu.edu.vn',
    socialLink: 'https://www.facebook.com/pham.luan.136149',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const requestAndroidPermission = async () => {
    if (Platform.OS !== 'android') return true;
 
    // Android 13+ (API 33) dùng permission khác Android cũ
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
 
    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };
 
  const handleChangePhoto = async () => {
    const hasPermission = await requestAndroidPermission();
 
    if (!hasPermission) {
      Alert.alert(
        'Photo access is required.',
        'Allow the app to access your photo library in Settings to change your avatar.'
      );
      return;
    }
 
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;
 
        const pickedUri = response.assets?.[0]?.uri;
        if (pickedUri) {
          setProfile((prev) => ({ ...prev, avatarUrl: pickedUri }));
        }
      }
    );
  };

  const handleStartEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    // TODO: NỐI API — await updateProfile(userId, draft)
    setProfile(draft);
    setIsEditing(false);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      // TODO: NỐI API — giống hệt logic logout() trong ChatRoomScreen
    } finally {
      setLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ---- Header ---- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Your EZone identity</Text>
        </View>

        {/* ---- Avatar block ---- */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
            )}
          </View>
 
          <Pressable style={styles.changeAvatarButton} onPress={handleChangePhoto}>
            <Text style={styles.changeAvatarText}>Change Photo</Text>
          </Pressable>
        </View>

        {/* ---- Info card ---- */}
        <View style={styles.cardWrapper}>
          <View style={styles.shadowLayer} />

          <View style={styles.card}>
            <ProfileField
              label="Full Name"
              value={isEditing ? draft.fullname : profile.fullname}
              editable={isEditing}
              onChangeText={(text) => setDraft((d) => ({ ...d, fullname: text }))}
            />

            <ProfileField
              label="Major"
              value={isEditing ? draft.majorCode : profile.majorCode}
              editable={isEditing}
              onChangeText={(text) => setDraft((d) => ({ ...d, majorCode: text }))}
            />

            <ProfileField
              label="Gender"
              value={isEditing ? draft.gender : profile.gender}
              editable={isEditing}
              onChangeText={(text) => setDraft((d) => ({ ...d, gender: text }))}
            />

            <ProfileField
              label="Email"
              value={profile.email}
              editable={false}
              helperText="Email không thể thay đổi"
            />

            <ProfileField
              label="Social Link"
              value={isEditing ? draft.socialLink : profile.socialLink}
              editable={isEditing}
              onChangeText={(text) => setDraft((d) => ({ ...d, socialLink: text }))}
              isLast
            />
          </View>
        </View>

        {/* ---- Buttons ---- */}
        {isEditing ? (
          <View style={styles.editButtonRow}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save changes</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={handleStartEdit}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.actionButton, styles.logoutButton]}
          onPress={() => setShowLogoutDialog(true)}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Pressable>
      </ScrollView>

      <LogoutConfirmationDialog
        visible={showLogoutDialog}
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </SafeAreaView>
  );
};

/**
 * LogoutConfirmationDialog — dialog xác nhận đăng xuất
 */
const LogoutConfirmationDialog = ({ visible, onCancel, onConfirm, loading = false }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
    <View style={styles.dialogOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={loading ? undefined : onCancel} />
      <View style={styles.dialogCardWrapper}>
        <View style={styles.dialogShadowLayer} />
        <View style={styles.dialogCard}>
          <Text style={styles.dialogTitle}>Log Out?</Text>
          <Text style={styles.dialogDescription}>
            You'll be signed out of EZone. You can always come back anytime.
          </Text>
          <View style={styles.dialogButtonRow}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={({ pressed }) => [
                styles.dialogButton,
                styles.dialogCancelButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Text style={styles.dialogCancelText}>Ở Lại</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={({ pressed }) => [
                styles.dialogButton,
                styles.dialogConfirmButton,
                { opacity: loading ? 0.7 : pressed ? 0.85 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.dialogConfirmText}>Log Out</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);


const ProfileField = ({ label, value, editable, onChangeText, helperText, isLast }) => (
  <View style={[styles.field, isLast && styles.fieldLast]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.fieldInput}
        placeholderTextColor="#9CA3AF"
      />
    ) : (
      <Text style={styles.fieldValue}>{value || 'N/A'}</Text>
    )}
    {helperText ? <Text style={styles.fieldHelper}>{helperText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D879C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 44,
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  shadowLayer: {
    position: 'absolute',
    top: SHADOW_OFFSET,
    left: SHADOW_OFFSET,
    right: -SHADOW_OFFSET,
    bottom: -SHADOW_OFFSET,
    backgroundColor: COLORS.shadow,
    borderRadius: CARD_RADIUS,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: CARD_RADIUS,
    borderWidth: 2.5,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  field: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  fieldLast: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
    includeFontPadding: false,
  },
  fieldInput: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: COLORS.fieldBg,
    includeFontPadding: false,
  },
  fieldHelper: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  actionButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  editButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontWeight: '800',
    fontSize: 14,
  },

  // ---- Style riêng cho LogoutConfirmationDialog 
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialogCardWrapper: {
    width: '100%',
    maxWidth: 380,
  },
  dialogShadowLayer: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: COLORS.shadow,
    borderRadius: 20,
  },
  dialogCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: COLORS.border,
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 24,
  },
  dialogTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    includeFontPadding: false,
  },
  dialogDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  dialogButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 22,
  },
  dialogButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCancelButton: {
    backgroundColor: '#F3F4F6',
  },
  dialogCancelText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  dialogConfirmButton: {
    backgroundColor: COLORS.primary,
  },
  dialogConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default ProfileScreen;
