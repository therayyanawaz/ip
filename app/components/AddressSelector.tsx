import { useState, useEffect } from "react";
import { Box, Flex, Select, Button } from "@radix-ui/themes";
import * as Popover from "@radix-ui/react-popover";
import styles from "./AddressSelector.module.css";

type RegionData = {
  [country: string]: {
    [state: string]: string[];
  };
};

interface AddressSelectorProps {
  children: React.ReactNode;
  onSelect: (address: string) => void;
}

export function AddressSelector({
  children,
  onSelect,
}: Readonly<AddressSelectorProps>) {
  const [country, setCountry] = useState<string>("United States");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [regionData, setRegionData] = useState<RegionData>({
    "United States": {}, // Provide initial value
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load geographic data
  useEffect(() => {
    const loadRegionData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/regionData.json");
        const data = await response.json();
        setRegionData(data);
      } catch (error) {
        console.error("Failed to load geographic data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRegionData();
  }, []);

  useEffect(() => {
    setState("");
    setCity("");
  }, [country]);

  useEffect(() => {
    setCity("");
  }, [state]);

  const handleConfirm = () => {
    if (country && state && city) {
      onSelect(`${country}|${state}|${city}`);
      setOpen(false);
    }
  };

  // Delay closing Popover to allow time to move to Popover content after moving out
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!hover) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 200);
    } else {
      setOpen(true);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [hover]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Box
          style={{ flex: 1 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
        </Box>
      </Popover.Trigger>
      <Popover.Content
        align="center"
        sideOffset={4}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={styles.popoverContent}
      >
        <Box p="3">
          <Flex direction="column" gap="3">
            <Select.Root
              value={country}
              onValueChange={setCountry}
              defaultValue="United States"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="United States">United States</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root value={state} onValueChange={setState}>
              <Select.Trigger
                placeholder={isLoading ? "Loading..." : "Select state"}
              />
              <Select.Content>
                {country &&
                  regionData[country] &&
                  Object.keys(regionData[country] || {})
                    .sort((a, b) => a.localeCompare(b))
                    .map((stateName) => (
                      <Select.Item key={stateName} value={stateName}>
                        {stateName}
                      </Select.Item>
                    ))}
              </Select.Content>
            </Select.Root>

            <Select.Root value={city} onValueChange={setCity}>
              <Select.Trigger
                placeholder={isLoading ? "Loading..." : "Select city"}
              />
              <Select.Content>
                {country &&
                  state &&
                  [...(regionData[country]?.[state] || [])]
                    .sort((a, b) => a.localeCompare(b))
                    .map((cityName, index) => (
                      <Select.Item
                        key={`${state}-${cityName}-${index}`}
                        value={cityName}
                      >
                        {cityName}
                      </Select.Item>
                    ))}
              </Select.Content>
            </Select.Root>

            <Button
              onClick={handleConfirm}
              disabled={!country || !state || !city || isLoading}
            >
              {isLoading ? "Loading..." : "Confirm"}
            </Button>
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
}
