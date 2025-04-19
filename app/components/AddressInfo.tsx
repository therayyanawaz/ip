"use client";

import { DataList, IconButton, HoverCard, Box, Inset } from "@radix-ui/themes";
import { Address } from "../types/index";
import { GlobeIcon } from "@radix-ui/react-icons";
import WFDService from "../services/addressService";
import { InfoItem } from "./InfoItem";

interface AddressInfoProps {
  address: Address | null;
  coordinates?: { latitude: number; longitude: number } | null;
  loading: boolean;
  createEmail?: any; // Not using this prop, but including it to match the passed props
}

interface AddressField {
  id: keyof Address;
  label: string;
}

export function AddressInfo({ address, coordinates, loading, createEmail }: Readonly<AddressInfoProps>) {
  const service = new WFDService();
  const mapUrl = address ? service.getGoogleMapUrl(address) : null;

  const addressFields: AddressField[] = [
    { id: "road", label: "Street" },
    { id: "city", label: "City" },
    { id: "state", label: "State/Province" },
    { id: "postcode", label: "Postal Code" },
    { id: "country", label: "Country" },
  ];

  const getMapIcon = (address: Address | null, mapUrl: string | null) => {
    if (!mapUrl || !address) return null;

    return (
      <HoverCard.Root>
        <HoverCard.Trigger>
          <IconButton
            size="1"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => window.open(mapUrl, "_blank")}
          >
            <GlobeIcon />
          </IconButton>
        </HoverCard.Trigger>
        <HoverCard.Content
          style={{
            padding: "10px",
            overflow: "hidden",
            backgroundColor: "var(--gray-1)",
            border: "1px solid var(--gray-6)",
            borderRadius: "var(--radius-3)",
            maxWidth: "500px",
            width: "500px",
          }}
          align="start"
          side="top"
          sideOffset={5}
          avoidCollisions={true}
        >
          <Inset clip="padding-box" side="all" p="0">
            <Box
              style={{
                width: "100%",
                height: "320px",
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => window.open(mapUrl, "_blank")}
            >
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  [address.road, address.city, address.state, address.country]
                    .filter(Boolean)
                    .join(", ")
                )}&output=embed&z=16`}
              />
            </Box>
          </Inset>
        </HoverCard.Content>
      </HoverCard.Root>
    );
  };

  return (
    <DataList.Root>
      {addressFields.map((field) => (
        <InfoItem
          key={field.id}
          label={field.label}
          value={address?.[field.id]?.toString()}
          loading={loading}
          extraIcon={
            field.id === "road" ? getMapIcon(address, mapUrl) : undefined
          }
        />
      ))}
    </DataList.Root>
  );
}
