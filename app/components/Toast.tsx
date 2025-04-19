"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Flex, Text, IconButton, Badge, Avatar } from "@radix-ui/themes";
import { EnvelopeClosedIcon, Cross2Icon, BellIcon } from "@radix-ui/react-icons";
import { TempMailMessage } from "../types/index";

interface ToastProps {
  message: TempMailMessage;
  onClose: () => void;
  onClick: () => void;
  duration?: number;
}

export function Toast({
  message,
  onClose,
  onClick,
  duration = 8000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play notification sound when toast appears
  useEffect(() => {
    if (isVisible && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => {
        // Handle autoplay policy restrictions
        console.log("Auto-play prevented:", e);
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for animation to finish before closing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" />
      <Card
        onClick={onClick}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "380px",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid var(--gray-a5)",
          overflow: "hidden",
        }}
        className="toast-card"
      >
        <style jsx global>{`
          @keyframes slideIn {
            from {
              transform: translateX(120%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
            }
          }
          
          .toast-card {
            animation: slideIn 0.5s ease-out forwards, pulse 2s infinite;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .toast-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .blue-glow {
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: linear-gradient(to bottom, #4f46e5, #818cf8);
            animation: pulse 2s infinite;
          }
        `}</style>
        
        <div className="blue-glow"></div>
        
        <Flex direction="column" p="3">
          <Flex justify="between" align="center" mb="2">
            <Flex gap="2" align="center">
              <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <EnvelopeClosedIcon width="16" height="16" className="text-indigo-600 dark:text-indigo-300" />
              </div>
              <Text weight="bold" size="2">New Mail Received</Text>
            </Flex>
            <Badge color="blue" radius="full" variant="soft">
              <BellIcon width="12" height="12" className="mr-1" />
              Now
            </Badge>
          </Flex>
          
          <Flex gap="3" align="start">
            <Avatar
              fallback={message.from.name.charAt(0).toUpperCase()}
              size="2"
              radius="full"
              color="indigo"
              className="mt-1"
            />
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Text weight="medium" size="2" className="line-clamp-1">
                {message.subject || "New Email"}
              </Text>
              <Text size="1" color="gray" className="line-clamp-2">
                {message.intro || `From: ${message.from.name} (${message.from.address})`}
              </Text>
              <Text size="1" color="gray" className="mt-1">
                Click to open
              </Text>
            </Flex>
          </Flex>
        </Flex>
        
        <IconButton
          size="1"
          variant="ghost"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onClose, 500);
          }}
        >
          <Cross2Icon />
        </IconButton>
      </Card>
    </>
  );
}
