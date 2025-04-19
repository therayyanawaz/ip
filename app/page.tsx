"use client";

import { useState, useEffect } from "react";
import WFDService from "./services/addressService";
import useIP from "@/hooks/useIP";
import useUser from "@/hooks/useUser";
import useAddress from "@/hooks/useAddress";
import useHistory from "@/hooks/useHistory";
import useMail from "@/hooks/useMail";
import type { HistoryRecord, TempMailMessage } from "./types/index";
import {
  Card,
  Text,
  Heading,
  Flex,
  Box,
  Code,
  TextField,
  Button,
  Skeleton,
  SegmentedControl,
  Separator,
} from "@radix-ui/themes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { UserInfo } from "./components/UserInfo";
import { AddressInfo } from "./components/AddressInfo";
import { AddressSelector } from "./components/AddressSelector";
import { InboxDialog } from "./components/InboxDialog";
import { HistoryList } from "./components/HistoryList";
import { TopBar } from "./components/TopBar";
import { Toast } from "./components/Toast";

export default function Home() {
  const { ip, isLoading: ipLoading, error: ipError } = useIP();
  const {
    user,
    isLoading: userLoading,
    error: userError,
    fetchUser,
    setUser,
  } = useUser("US");
  const [inputIp, setInputIp] = useState<string>("");
  const [inputMode, setInputMode] = useState<string>("ip");
  const {
    address,
    setAddress,
    coordinates,
    setCoordinates,
    loading: addressLoading,
    error: addressError,
  } = useAddress(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    history,
    selectedHistory,
    setSelectedHistory,
    addHistoryRecord,
    deleteHistoryRecord,
    deleteAllHistory,
  } = useHistory();
  const {
    tempEmail,
    emailLoading,
    messages,
    selectedMessage,
    toastMessage,
    setSelectedMessage,
    setToastMessage,
    handleMessageClick,
  } = useMail();
  const [inboxOpen, setInboxOpen] = useState(false);
  const [shouldAddToHistory, setShouldAddToHistory] = useState(false);

  // Calculate total loading state
  const isLoading =
    loading || emailLoading || addressLoading || ipLoading || userLoading;

  // Monitor data changes, add to history
  useEffect(() => {
    if (!shouldAddToHistory) return;
    if (coordinates && user && address && ip) {
      addHistoryRecord({ user, address, ip });
      setShouldAddToHistory(false);
    }
  }, [coordinates, user, address, ip, shouldAddToHistory]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (!ip) return;
      setLoading(true);
      try {
        const service = new WFDService();
        const coords = await service.getIPCoordinates(ip);
        setCoordinates(coords);
        setShouldAddToHistory(true);
      } catch (err) {
        setError("Failed to get address");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [ip]);

  const handleGenerateAddress = async () => {
    setLoading(true);
    try {
      if (inputMode === "address") {
        if (!inputIp) {
          setError("Please select an address");
          return;
        }
        const [country, state, city] = inputIp.split("|");
        try {
          const service = new WFDService();
          const coords = await service.getCoordinates(country, state, city);
          setCoordinates({
            latitude: Number(coords.lat),
            longitude: Number(coords.lon),
          });
          await fetchUser();
          setShouldAddToHistory(true);
        } catch (err) {
          setError("Failed to get address");
          console.error(err);
        }
        return;
      }

      // IP mode handling
      const targetIp = inputIp || ip;
      if (targetIp) {
        try {
          const service = new WFDService();
          const coords = await service.getIPCoordinates(targetIp);
          setCoordinates(coords);
          await fetchUser();
          setShouldAddToHistory(true);
        } catch (err) {
          setError("Failed to get address");
          console.error(err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (record: HistoryRecord) => {
    setSelectedHistory(record.id);
    // Directly use data from history record, don't trigger any requests
    setAddress(record.address);
    setUser(record.user);
  };

  const handleToastClick = (message: TempMailMessage) => {
    setInboxOpen(true);
    setSelectedMessage(message);
  };

  return (
    <Box>
      <TopBar onInboxOpen={() => setInboxOpen(true)} />

      {/* Main content */}
      <Flex
        className="min-h-screen"
        direction="column"
        align="center"
        justify="center"
        gap="4"
        style={{
          backgroundImage: "var(--background-image)",
          backgroundSize: "var(--background-size)",
          paddingTop: "60px", // Space for fixed navigation bar
        }}
      >
        <Heading size="8">Real Address Generator 🏴󠁧󠁢󠁳󠁣󠁴󠁿</Heading>
        <Flex gap="2" align="center">
          <Text size="4" color="gray">
            Your current IP address:
          </Text>
          {ipLoading ? (
            <Skeleton>
              <Code size="4">loading...</Code>
            </Skeleton>
          ) : ipError ? (
            <Text color="red">Failed to get IP</Text>
          ) : (
            <Code size="4">{ip}</Code>
          )}
        </Flex>

        {userError && <Text color="red">Failed to get user information</Text>}

        <Flex
          gap="4"
          style={{ width: "100%", maxWidth: "900px" }}
          className="flex flex-col md:flex-row"
        >
          {/* Left card */}
          <Card size="5" style={{ flex: 4 }} className="hidden md:flex">
            <Flex direction="column" gap="3" style={{ flex: 1 }}>
              <Box>
                <Flex gap="3">
                  <SegmentedControl.Root
                    defaultValue="ip"
                    onValueChange={(value) => {
                      setInputMode(value);
                      setInputIp(""); // Clear input content
                    }}
                    size="2"
                  >
                    <SegmentedControl.Item value="ip">IP</SegmentedControl.Item>
                    <SegmentedControl.Item value="address">
                      Address
                    </SegmentedControl.Item>
                  </SegmentedControl.Root>
                  {inputMode === "address" ? (
                    <Flex style={{ flex: 1 }}>
                      <AddressSelector onSelect={setInputIp}>
                        <TextField.Root
                          size="2"
                          placeholder="Please select address"
                          value={inputIp}
                          onChange={(e) => setInputIp(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </AddressSelector>
                    </Flex>
                  ) : (
                    <TextField.Root
                      size="2"
                      placeholder={ip}
                      value={inputIp}
                      onChange={(e) => setInputIp(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  )}
                  <Button
                    size="2"
                    onClick={handleGenerateAddress}
                    disabled={isLoading}
                  >
                    <Text>{isLoading ? "Generating..." : "Generate Address"}</Text>
                    <ReloadIcon className={isLoading ? "animate-spin" : ""} />
                  </Button>
                </Flex>
              </Box>

              {/* History list */}
              <HistoryList
                history={history}
                selectedHistory={selectedHistory}
                onHistoryClick={handleHistoryClick}
                onDeleteHistory={deleteHistoryRecord}
                onDeleteAllHistory={deleteAllHistory}
              />
            </Flex>
          </Card>

          {/* Right card */}
          <Card size="9" style={{ flex: 2 }}>
            <Flex direction="column" gap="3">
              {/* User info */}
              <UserInfo user={user} loading={userLoading} email={tempEmail} />

              {/* Address info */}
              <AddressInfo
                address={address}
                coordinates={coordinates}
                loading={addressLoading}
                createEmail={useMail}
              />
            </Flex>
          </Card>
        </Flex>
      </Flex>

      {/* Mobile-only display */}
      <Card
        size="4"
        className="md:hidden fixed bottom-0 left-0 right-0 z-20"
        style={{ borderRadius: "12px 12px 0 0" }}
      >
        <Flex direction="column" gap="3" p="2">
          <Flex gap="3">
            <SegmentedControl.Root
              defaultValue="ip"
              onValueChange={(value) => {
                setInputMode(value);
                setInputIp(""); // Clear input
              }}
              size="2"
            >
              <SegmentedControl.Item value="ip">IP</SegmentedControl.Item>
              <SegmentedControl.Item value="address">
                Address
              </SegmentedControl.Item>
            </SegmentedControl.Root>
            {inputMode === "address" ? (
              <Flex style={{ flex: 1 }}>
                <AddressSelector onSelect={setInputIp}>
                  <TextField.Root
                    size="2"
                    placeholder="Please select address"
                    value={inputIp}
                    onChange={(e) => setInputIp(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </AddressSelector>
              </Flex>
            ) : (
              <TextField.Root
                size="2"
                placeholder={ip}
                value={inputIp}
                onChange={(e) => setInputIp(e.target.value)}
                style={{ flex: 1 }}
              />
            )}
            <Button
              size="2"
              onClick={handleGenerateAddress}
              disabled={isLoading}
            >
              <Text>{isLoading ? "Generating..." : "Generate"}</Text>
              <ReloadIcon className={isLoading ? "animate-spin" : ""} />
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Inbox dialog */}
      <InboxDialog
        open={inboxOpen}
        onOpenChange={setInboxOpen}
        tempEmail={tempEmail}
        messages={messages}
        selectedMessage={selectedMessage}
        onMessageClick={handleMessageClick}
      />

      {/* Toast notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClick={handleToastClick} 
          onClose={() => setToastMessage(null)}
        />
      )}
    </Box>
  );
}
