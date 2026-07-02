import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { ActionButton, ContextActionMenu, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { familyCircles, familyPeople, inviteMethods, permissionPreview, sharedChats, sharedTasks, type FamilyPerson, type FamilySharedItem } from "./familyData";

type MenuTarget =
  | { kind: "person"; item: FamilyPerson }
  | { kind: "shared"; item: FamilySharedItem }
  | null;

function PersonCard({ item, onLongPress }: { item: FamilyPerson; onLongPress: (item: FamilyPerson) => void }): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <HealthCard
      action={<ActionButton label="Open" onPress={() => router.push(item.route as Href)} variant="secondary" />}
      description={item.summary}
      onLongPress={() => onLongPress(item)}
      privacy={item.privacy}
      realm={item.tone}
      title={item.name}
    >
      <View style={styles.roleRow}>
        <Text style={[styles.relationship, { color: theme.colors.textPrimary }]}>{item.relationship}</Text>
        <Text style={[styles.roleText, { color: theme.colors.textSecondary }]}>
          {Object.values(item.roleByCircle).join(" / ")}
        </Text>
      </View>
    </HealthCard>
  );
}

function SharedItemCard({ item, onLongPress }: { item: FamilySharedItem; onLongPress: (item: FamilySharedItem) => void }): JSX.Element {
  const router = useRouter();

  return (
    <HealthCard
      action={<ActionButton label={item.action} onPress={() => router.push(item.route as Href)} variant="secondary" />}
      description={item.description}
      onLongPress={() => onLongPress(item)}
      privacy={item.privacy}
      realm={item.tone}
      title={item.title}
    />
  );
}

export function FamilyScreen(): JSX.Element {
  const [selectedCircleId, setSelectedCircleId] = useState(familyCircles[0].id);
  const [menuTarget, setMenuTarget] = useState<MenuTarget>(null);
  const theme = useHealthOSTheme();
  const router = useRouter();
  const selectedCircle = familyCircles.find((circle) => circle.id === selectedCircleId) ?? familyCircles[0];
  const visiblePeople = familyPeople.filter((person) => person.circleIds.includes(selectedCircleId));
  const menuTitle = menuTarget ? (menuTarget.kind === "person" ? menuTarget.item.name : menuTarget.item.title) : undefined;

  function openTarget(): void {
    if (!menuTarget) {
      return;
    }

    router.push(menuTarget.item.route as Href);
    setMenuTarget(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Family</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Circles, roles, caregivers, schools, shared chats, tasks, invites, permissions, and family Moments.
        </Text>
      </View>

      <SectionHeader title="Circle switcher" subtitle="People can have different roles in different circles." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.circleRail}>
          {familyCircles.map((circle) => {
            const active = circle.id === selectedCircleId;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={circle.id}
                onPress={() => setSelectedCircleId(circle.id)}
                style={[
                  styles.circleChip,
                  {
                    backgroundColor: active ? `${theme.brand.primary}18` : theme.colors.surface,
                    borderColor: active ? theme.brand.primary : theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.circleText, { color: active ? theme.brand.primary : theme.colors.textPrimary }]}>{circle.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <HealthCard
        privacy={selectedCircle.privacyLevel === "organization" ? "school" : "circle"}
        realm={selectedCircle.type === "school" ? "school" : selectedCircle.type === "care_team" ? "caregiver" : "familyHealth"}
        title={selectedCircle.name}
        description={`Circle type: ${selectedCircle.type.replace("_", " ")}. Privacy: ${selectedCircle.privacyLevel.replace("_", " ")}.`}
        action={<ActionButton label="Invite" onPress={() => router.push("/family/invite" as Href)} variant="secondary" />}
      />

      <SectionHeader title="People and roles" subtitle="Tap opens the profile. Long press opens permissions and sharing actions." />
      {visiblePeople.map((person) => (
        <PersonCard key={person.id} item={person} onLongPress={(item) => setMenuTarget({ kind: "person", item })} />
      ))}

      <SectionHeader title="Children, caregivers, and schools" subtitle="Child and caregiver data is permission-based." />
      {familyPeople
        .filter((person) => ["Child", "Caregiver", "Teacher"].includes(person.relationship))
        .map((person) => (
          <PersonCard key={`care-${person.id}`} item={person} onLongPress={(item) => setMenuTarget({ kind: "person", item })} />
        ))}

      <SectionHeader title="Shared chats" subtitle="Shared chats are private unless a sharing mode is selected." />
      {sharedChats.map((item) => (
        <SharedItemCard key={item.id} item={item} onLongPress={(next) => setMenuTarget({ kind: "shared", item: next })} />
      ))}

      <SectionHeader title="Shared tasks" subtitle="Tasks can be assigned without exposing records or documents." />
      {sharedTasks.map((item) => (
        <SharedItemCard key={item.id} item={item} onLongPress={(next) => setMenuTarget({ kind: "shared", item: next })} />
      ))}

      <SectionHeader title="Invites" subtitle="Choose circle, relationship, role, permissions, expiry, then send QR/link." />
      <View style={styles.inviteGrid}>
        {inviteMethods.map((method) => (
          <Pressable
            accessibilityRole="button"
            key={method}
            onPress={() => router.push("/family/invite" as Href)}
            style={({ pressed }) => [styles.inviteChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, pressed && styles.pressed]}
          >
            <Text style={[styles.inviteText, { color: theme.colors.textPrimary }]}>{method}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Permissions preview" subtitle="Every sensitive share requires permission review." />
      <HealthCard
        privacy="private"
        realm="records"
        title="Permission rules"
        description="Frontend labels prepare the UI. Backend row-level security must enforce the same ownership and sharing rules."
        action={<ActionButton label="Manage" onPress={() => router.push("/family/permissions" as Href)} variant="secondary" />}
      >
        {permissionPreview.map((item) => (
          <View key={item} style={styles.permissionRow}>
            <RealmBadge realm="records" label="Rule" />
            <Text style={[styles.permissionText, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </HealthCard>

      <SectionHeader title="Family Moments" subtitle="Save private first, share only after review." />
      <HealthCard
        privacy="private"
        realm="familyHealth"
        title="Family walk Moment"
        description="A private memory card is ready. Child photos, location, school, and health notes must be reviewed before export."
        action={<ActionButton label="Create Moment" onPress={() => router.push("/profile/moments" as Href)} variant="secondary" />}
      />

      <Modal animationType="fade" onRequestClose={() => setMenuTarget(null)} transparent visible={Boolean(menuTarget)}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setMenuTarget(null)} style={styles.scrim} />
          <View style={[styles.menuDock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ContextActionMenu
              title={menuTitle}
              actions={[
                { id: "open", label: "Open", onPress: openTarget },
                { id: "role", label: "Set role", onPress: () => router.push("/family/permissions" as Href) },
                { id: "permissions", label: "Manage permissions", onPress: () => router.push("/family/permissions" as Href) },
                { id: "share-chat", label: "Share chat", onPress: () => router.push("/ai/share-chat" as Href) },
                { id: "share-record", label: "Share record", onPress: () => router.push("/modals/privacy-review" as Href) },
                { id: "moment", label: "Create Moment", onPress: () => router.push("/profile/moments" as Href) },
                { id: "revoke", label: "Revoke access", destructive: true, onPress: () => setMenuTarget(null) },
              ]}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circleChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  circleRail: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  circleText: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  hero: {
    gap: spacing.sm,
  },
  inviteChip: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: "47%",
  },
  inviteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  inviteText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  menuDock: {
    borderRadius: radius.lg,
    borderWidth: 1,
    margin: spacing.lg,
    overflow: "hidden",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  permissionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  permissionText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  relationship: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  roleRow: {
    gap: spacing.xs,
  },
  roleText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  scrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  title: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
});
