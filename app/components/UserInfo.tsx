"use client";

import { DataList } from "@radix-ui/themes";
import { User } from "../types/index";
import { InfoItem } from "./InfoItem";

interface UserInfoProps {
  user: User | null;
  loading: boolean;
  email?: string;
}

interface UserField {
  id: string;
  label: string;
  getValue: (user: User, email?: string) => string;
}

export function UserInfo({ user, loading, email }: Readonly<UserInfoProps>) {
  const userFields: UserField[] = [
    {
      id: "last",
      label: "Last Name",
      getValue: (user) => user.name.last,
    },
    {
      id: "first",
      label: "First Name",
      getValue: (user) => user.name.first,
    },
    {
      id: "phone",
      label: "Phone",
      getValue: (user) => user.phone,
    },
    {
      id: "ssn",
      label: "SSN",
      getValue: (user) => user.id.value || "N/A",
    },
    {
      id: "email",
      label: "Email",
      getValue: (_, email) => email,
    },
  ];

  return (
    <DataList.Root>
      {userFields.map((field) => (
        <InfoItem
          key={field.id}
          label={field.label}
          value={user ? field.getValue(user, email) : undefined}
          loading={loading}
        />
      ))}
    </DataList.Root>
  );
}
