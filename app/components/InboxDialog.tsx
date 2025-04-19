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
  TextField,
  Button,
} from "@radix-ui/themes";
import { TempMailMessage } from "../types/index";
import { 
  EnvelopeClosedIcon, 
  Cross2Icon, 
  EnvelopeOpenIcon,
  CalendarIcon,
  PersonIcon,
  CopyIcon,
  CheckIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  ReloadIcon
} from "@radix-ui/react-icons";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyEmail = () => {
    if (tempEmail) {
      navigator.clipboard.writeText(tempEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[92vh] w-[98vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] rounded-xl shadow-2xl z-50 outline-none p-0 overflow-hidden border border-slate-800">
          <Dialog.Title className="sr-only">Inbox</Dialog.Title>

          {/* Top area */}
          <Flex direction="column" className="relative">
            {/* Main header with logo */}
            <Flex 
              p="4" 
              justify="between" 
              align="center"
              className="bg-[#1e293b] border-b border-slate-700"
            >
              <Flex align="center" gap="2">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-md p-1.5">
                  <EnvelopeClosedIcon width={18} height={18} className="text-white" />
                </div>
                <Heading size="5" className="text-slate-50">Inbox</Heading>
              </Flex>
              
              <Flex align="center" gap="3">
                <Badge
                  color="green"
                  radius="full"
                  variant="soft"
                  className="px-3 py-1 flex items-center gap-1.5"
                >
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <Text size="1" weight="medium">Online</Text>
                </Badge>
                
                <IconButton
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                  radius="full"
                  className="text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  <Cross2Icon />
                </IconButton>
              </Flex>
            </Flex>
            
            {/* Email address row */}
            {tempEmail && (
              <Flex 
                justify="center" 
                align="center" 
                py="3" 
                className="bg-[#1e293b] border-b border-slate-700 px-4"
              >
                <Flex 
                  className="bg-[#0f172a] rounded-full px-5 py-1.5 max-w-[450px] border border-slate-700 shadow-md"
                  align="center"
                  gap="2"
                >
                  <Text size="2" color="gray" className="font-mono text-slate-300">
                    {tempEmail}
                  </Text>
                  <IconButton 
                    size="1" 
                    variant="ghost" 
                    color={copied ? "green" : "gray"} 
                    onClick={handleCopyEmail}
                    className="hover:bg-slate-800 ml-1"
                  >
                    {copied ? <CheckIcon className="text-green-500" /> : <CopyIcon className="text-slate-400" />}
                  </IconButton>
                </Flex>
              </Flex>
            )}
          </Flex>

          {/* Main content area */}
          <Flex style={{ height: "calc(92vh - 130px)" }}>
            {/* Message list */}
            <Box
              className="border-r border-slate-700"
              style={{ width: "350px", maxWidth: "35%" }}
            >
              {/* Search input in sidebar */}
              <Box className="p-3 border-b border-slate-700">
                <Flex gap="2" align="center" className="relative">
                  <TextField.Root 
                    placeholder="Search messages" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1e293b] border-slate-700 rounded-lg text-slate-200"
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon className="text-slate-400" />
                    </TextField.Slot>
                  </TextField.Root>
                  <IconButton 
                    size="1"
                    variant="ghost" 
                    className="hover:bg-slate-700"
                  >
                    <ReloadIcon className="text-slate-400" />
                  </IconButton>
                </Flex>
              </Box>

              <ScrollArea
                style={{ height: "calc(100% - 60px)" }}
                type="hover"
                scrollbars="vertical"
                className="custom-scrollbar"
              >
                {filteredMessages.length === 0 ? (
                  <Flex
                    align="center"
                    justify="center"
                    direction="column"
                    gap="3"
                    style={{ height: "200px" }}
                    className="text-center p-4"
                  >
                    <Box className="bg-slate-800 p-4 rounded-full">
                      <EnvelopeOpenIcon width={28} height={28} className="text-slate-400" />
                    </Box>
                    <Text color="gray" size="2" className="text-slate-400 font-medium">No messages yet</Text>
                    <Text color="gray" size="1" className="text-slate-500">
                      {searchQuery 
                        ? "No results match your search" 
                        : "New emails will appear here"}
                    </Text>
                  </Flex>
                ) : (
                  <Flex direction="column">
                    {filteredMessages.map((msg) => (
                      <Box
                        key={msg.id}
                        onClick={() => onMessageClick(msg)}
                        style={{
                          cursor: "pointer",
                        }}
                        className={`
                          hover:bg-[#1e293b] p-3 border-b border-slate-700/50 transition-all
                          ${selectedMessage?.id === msg.id 
                            ? "bg-[#1e293b] border-l-4 border-l-indigo-500" 
                            : "border-l-4 border-l-transparent"}
                        `}
                      >
                        <Flex direction="column" gap="2">
                          <Flex justify="between" align="center">
                            <Avatar
                              fallback={msg.from.name.charAt(0).toUpperCase()}
                              size="2"
                              radius="full"
                              variant="solid"
                              color="indigo"
                              className="mr-2"
                            />
                            <Text size="1" color="gray" className="flex items-center gap-1 text-slate-400">
                              <CalendarIcon width={12} height={12} />
                              {new Date(msg.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </Flex>
                          
                          <Text weight="bold" size="2" className="line-clamp-1 text-slate-200">
                            {msg.subject || "No subject"}
                          </Text>
                          
                          <Flex align="center" gap="1">
                            <PersonIcon width={12} height={12} className="text-slate-500" />
                            <Text size="1" color="gray" className="line-clamp-1 text-slate-400">
                              {msg.from.name} ({msg.from.address})
                            </Text>
                          </Flex>

                          <Text size="1" className="line-clamp-1 text-slate-500">
                            {msg.intro || "No preview available"}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                )}
              </ScrollArea>
            </Box>

            {/* Message content */}
            <Box style={{ flex: 1 }} className="bg-[#0f172a]">
              {selectedMessage ? (
                <Flex direction="column" style={{ height: "100%" }}>
                  <Flex 
                    p="3" 
                    direction="column" 
                    gap="2"
                    className="bg-[#1e293b] border-b border-slate-700"
                  >
                    <Heading size="4" className="text-slate-100">{selectedMessage.subject || "No subject"}</Heading>
                    <Flex align="center" gap="2">
                      <Avatar 
                        fallback={selectedMessage.from.name.charAt(0).toUpperCase()}
                        size="2"
                        color="indigo"
                        radius="full"
                      />
                      <Box>
                        <Text size="2" weight="medium" className="text-slate-200">{selectedMessage.from.name}</Text>
                        <Text size="1" color="gray" className="text-slate-400">{selectedMessage.from.address}</Text>
                      </Box>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray" className="flex items-center gap-1 text-slate-400">
                        <CalendarIcon width={12} height={12} />
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </Text>
                      <Flex gap="1">
                        <IconButton 
                          size="1" 
                          variant="ghost" 
                          className="text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        >
                          <DotsHorizontalIcon />
                        </IconButton>
                      </Flex>
                    </Flex>
                  </Flex>
                  
                  <Tabs.Root defaultValue="html" className="flex flex-col flex-1">
                    <Tabs.List className="px-3 pt-2 border-b border-slate-800">
                      {selectedMessage.html?.length > 0 && (
                        <Tabs.Trigger 
                          value="html" 
                          className="font-medium text-sm text-slate-200 data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                        >
                          HTML
                        </Tabs.Trigger>
                      )}
                      {selectedMessage.text && (
                        <Tabs.Trigger 
                          value="text" 
                          className="font-medium text-sm text-slate-200 data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                        >
                          Text
                        </Tabs.Trigger>
                      )}
                    </Tabs.List>

                    <Box py="3" className="flex-1">
                      {selectedMessage.html?.length > 0 && (
                        <Tabs.Content value="html" className="h-full px-4">
                          <ScrollArea
                            type="hover"
                            scrollbars="vertical"
                            style={{ height: "100%" }}
                            className="pb-6 custom-scrollbar"
                          >
                            <div
                              className="prose dark:prose-invert max-w-none prose-a:text-indigo-400 prose-headings:text-slate-200 prose-p:text-slate-300"
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
                            className="pb-6 custom-scrollbar"
                          >
                            <pre
                              className="text-slate-300"
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
                  gap="4"
                  style={{ height: "100%" }}
                  className="text-center p-8"
                >
                  <div className="bg-[#1e293b] p-6 rounded-full">
                    <EnvelopeOpenIcon width={48} height={48} className="text-slate-400" />
                  </div>
                  <Heading size="3" className="text-slate-200">Select a message to view</Heading>
                  <Text size="2" color="gray" className="max-w-md text-slate-400">
                    Click on a message from the list to view its contents here
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>

          {/* Custom scrollbar styles */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #1e293b;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #334155;
              border-radius: 4px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #475569;
            }
          `}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
