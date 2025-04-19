"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Text,
  ScrollArea,
  Tabs,
  Box,
  Flex,
  Badge,
  Heading,
  IconButton,
  Avatar,
  Separator,
} from "@radix-ui/themes";
import { TempMailMessage } from "../types/index";
import { 
  EnvelopeClosedIcon, 
  Cross2Icon, 
  EnvelopeOpenIcon,
  CalendarIcon,
  PersonIcon
} from "@radix-ui/react-icons";

interface InboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tempEmail: string;
  messages: TempMailMessage[];
  onMessageClick: (msg: TempMailMessage) => void;
  selectedMessage: TempMailMessage | null;
}

export function InboxDialog({
  open,
  onOpenChange,
  tempEmail,
  messages,
  onMessageClick,
  selectedMessage,
}: Readonly<InboxDialogProps>) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[95vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 outline-none p-0 overflow-hidden border border-gray-200 dark:border-gray-800">
          <Dialog.Title className="sr-only">Inbox</Dialog.Title>

          {/* Top area */}
          <Flex
            p="4"
            justify="between"
            align="center"
            className="bg-gray-50 dark:bg-gray-950"
            style={{ borderBottom: "1px solid var(--gray-a5)" }}
          >
            <Flex direction="column" gap="1">
              <Heading size="5" className="flex items-center gap-2">
                <EnvelopeClosedIcon width={20} height={20} />
                Inbox
              </Heading>
              {tempEmail && (
                <Text size="2" color="gray" className="flex items-center gap-1">
                  <Badge color="blue" variant="soft" radius="full">
                    {tempEmail}
                  </Badge>
                </Text>
              )}
            </Flex>
            <Flex gap="3" align="center">
              <Badge
                color="green"
                radius="full"
                variant="soft"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                }}
              >
                <Text size="1" weight="medium">Online</Text>
              </Badge>
              <IconButton
                variant="ghost"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                radius="full"
                className="hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Cross2Icon />
              </IconButton>
            </Flex>
          </Flex>

          {/* Main content area */}
          <Flex style={{ height: "calc(90vh - 72px)" }}>
            {/* Message list */}
            <Box
              className="border-r border-[var(--gray-a5)]"
              style={{ width: "320px", maxWidth: "35%" }}
            >
              <ScrollArea
                style={{ height: "100%" }}
                type="hover"
                scrollbars="vertical"
              >
                {messages.length === 0 ? (
                  <Flex
                    align="center"
                    justify="center"
                    direction="column"
                    gap="3"
                    style={{ height: "200px" }}
                    className="text-center p-4"
                  >
                    <EnvelopeOpenIcon width={32} height={32} className="text-gray-400" />
                    <Text color="gray" size="2">No messages yet</Text>
                    <Text color="gray" size="1">New emails will appear here</Text>
                  </Flex>
                ) : (
                  <Flex direction="column">
                    {messages.map((msg) => (
                      <Box
                        key={msg.id}
                        onClick={() => onMessageClick(msg)}
                        style={{
                          cursor: "pointer",
                          borderBottom: "1px solid var(--gray-a3)",
                        }}
                        className={`
                          hover:bg-gray-50 dark:hover:bg-gray-800 p-3
                          ${selectedMessage?.id === msg.id 
                            ? "bg-blue-50 dark:bg-gray-800 border-l-4 border-l-blue-500" 
                            : ""}
                        `}
                      >
                        <Flex direction="column" gap="2">
                          <Flex justify="between" align="center">
                            <Avatar
                              fallback={msg.from.name.charAt(0).toUpperCase()}
                              size="1"
                              radius="full"
                              variant="solid"
                              color="indigo"
                              className="mr-2"
                            />
                            <Text size="1" color="gray" className="flex items-center gap-1">
                              <CalendarIcon width={12} height={12} />
                              {new Date(msg.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </Flex>
                          
                          <Text weight="bold" size="2" className="line-clamp-1">
                            {msg.subject || "No subject"}
                          </Text>
                          
                          <Flex align="center" gap="1">
                            <PersonIcon width={12} height={12} className="text-gray-500" />
                            <Text size="1" color="gray" className="line-clamp-1">
                              {msg.from.name} ({msg.from.address})
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                )}
              </ScrollArea>
            </Box>

            {/* Message content */}
            <Box style={{ flex: 1 }}>
              {selectedMessage ? (
                <Flex direction="column" style={{ height: "100%" }}>
                  <Flex 
                    p="3" 
                    direction="column" 
                    gap="2"
                    className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
                  >
                    <Heading size="4">{selectedMessage.subject || "No subject"}</Heading>
                    <Flex align="center" gap="2">
                      <Avatar 
                        fallback={selectedMessage.from.name.charAt(0).toUpperCase()}
                        size="2"
                        color="indigo"
                        radius="full"
                      />
                      <Box>
                        <Text size="2" weight="medium">{selectedMessage.from.name}</Text>
                        <Text size="1" color="gray">{selectedMessage.from.address}</Text>
                      </Box>
                    </Flex>
                    <Text size="1" color="gray" className="flex items-center gap-1">
                      <CalendarIcon width={12} height={12} />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                  
                  <Tabs.Root defaultValue="html" className="flex flex-col flex-1">
                    <Tabs.List className="px-3 pt-2">
                      {selectedMessage.html?.length > 0 && (
                        <Tabs.Trigger value="html" className="font-medium text-sm">HTML</Tabs.Trigger>
                      )}
                      {selectedMessage.text && (
                        <Tabs.Trigger value="text" className="font-medium text-sm">Text</Tabs.Trigger>
                      )}
                    </Tabs.List>

                    <Box py="3" className="flex-1">
                      {selectedMessage.html?.length > 0 && (
                        <Tabs.Content value="html" className="h-full px-4">
                          <ScrollArea
                            type="hover"
                            scrollbars="vertical"
                            style={{ height: "100%" }}
                            className="pb-6"
                          >
                            <div
                              className="prose dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: selectedMessage.html.join("\n"),
                              }}
                            />
                          </ScrollArea>
                        </Tabs.Content>
                      )}
                      {selectedMessage.text && (
                        <Tabs.Content value="text" className="h-full px-4">
                          <ScrollArea
                            type="hover"
                            scrollbars="vertical"
                            style={{ height: "100%" }}
                            className="pb-6"
                          >
                            <pre
                              style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                margin: 0,
                                fontFamily: "var(--font-mono)",
                                fontSize: "14px",
                              }}
                            >
                              {selectedMessage.text}
                            </pre>
                          </ScrollArea>
                        </Tabs.Content>
                      )}
                    </Box>
                  </Tabs.Root>
                </Flex>
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  direction="column"
                  gap="3"
                  style={{ height: "100%" }}
                  className="text-center p-8"
                >
                  <EnvelopeOpenIcon width={48} height={48} className="text-gray-300" />
                  <Heading size="3" color="gray">Select a message to view content</Heading>
                  <Text size="2" color="gray" className="max-w-md">
                    Click on a message from the list to view its contents here
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
