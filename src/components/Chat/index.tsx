// components/Chat/index.tsx

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation } from "react-query";
import axios from "axios";
import {
    Avatar,
    IconButton,
    Spinner,
    Stack,
    Text
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { FiSend } from "react-icons/fi";

import gptAvatar from "@/assets/gpt-avatar.svg";
import warning from "@/assets/warning.svg";
import user from "@/assets/user.png";
import { Input } from "@/components/Input";
import { Instructions } from "../Layout/Instructions";
import { useChat } from "@/store/chat";
import { useAPI } from "@/store/api";
import { HotelInfo } from "@/components/HotelInfo";

export const Chat = ({ ...props }) => {
    const { api } = useAPI();
    const {
        selectedChat,
        addMessage,
        addChat,
        editChat
    } = useChat();
    const selectedId = selectedChat?.id,
        selectedRole = selectedChat?.role;

    const hasSelectedChat = selectedChat && selectedChat?.content.length > 0;

    const {
        register,
        setValue,
        handleSubmit
    } = useForm();

    const overflowRef = useRef(null);
    const updateScroll = () => {
        overflowRef.current?.scrollTo(0, overflowRef.current.scrollHeight);
    };

    const [parentRef] = useAutoAnimate();

    const { mutate, isLoading } = useMutation({
        mutationKey: "prompt",
        mutationFn: async (prompt) => {
            const response = await axios.post("http://127.0.0.1:5000/chat", 
                { message: prompt },
                { withCredentials: true } // Include this line
            );
            return response.data;
        }
    });
    

    const handleAsk = async ({ input: prompt }) => {
        updateScroll();
        const sendRequest = (selectedId) => {
            setValue("input", "");

            addMessage(selectedId, {
                emitter: "user",
                message: prompt
            });

            mutate(prompt, {
                onSuccess(data) {
                    const message = data.response;
                    addMessage(selectedId, {
                        emitter: "gpt",
                        message: "Here are the hotel details:",
                        results: message
                    });

                    if (selectedRole === "New chat" || selectedRole === undefined) {
                        editChat(selectedId, { role: prompt });
                    }
                    updateScroll();
                },
                onError(error) {
                    const message = error.response.data.error.message;
                    addMessage(selectedId, {
                        emitter: "error",
                        message
                    });
                    updateScroll();
                }
            });
        };

        if (selectedId) {
            if (prompt && !isLoading) {
                sendRequest(selectedId);
            }
        } else {
            addChat(sendRequest);
        }
    };

    return (
        <Stack width="full" height="full">
            <Stack maxWidth="768px" width="full" marginX="auto" height="85%" overflow="auto" ref={overflowRef}>
                <Stack spacing={2} padding={2} ref={parentRef} height="full">
                    {hasSelectedChat ? (
                        selectedChat.content.map(({ emitter, message, results }, key) => {
                            const getAvatar = () => {
                                switch (emitter) {
                                    case "gpt":
                                        return gptAvatar;
                                    case "error":
                                        return warning;
                                    default:
                                        return user;
                                }
                            };

                            const getMessage = () => {
                                if (typeof message === "string") {
                                    return message;
                                }
                                return "";
                            };

                            return (
                                <Stack key={key} direction="row" padding={4} rounded={8} backgroundColor={emitter === 'gpt' ? "blackAlpha.200" : "transparent"} spacing={4}>
                                    <Avatar name={emitter} src={getAvatar()} />
                                    <Stack whiteSpace="pre-wrap" marginTop=".75em !important" overflow="hidden">
                                        <ReactMarkdown>
                                            {getMessage()}
                                        </ReactMarkdown>
                                        {results && emitter === 'gpt' && (
                                            <HotelInfo hotels={results} />
                                        )}
                                    </Stack>
                                </Stack>
                            );
                        })
                    ) : (
                        <Instructions onClick={(text) => setValue("input", text)} />
                    )}
                </Stack>
            </Stack>
            <Stack height="20%" padding={4} backgroundColor="blackAlpha.400" justifyContent="center" alignItems="center" overflow="hidden">
                <Stack maxWidth="768px">
                    <Input
                        autoFocus={true}
                        variant="filled"
                        inputRightAddon={
                            <IconButton
                                aria-label="send_button"
                                icon={!isLoading ? <FiSend /> : <Spinner />}
                                backgroundColor="transparent"
                                onClick={handleSubmit(handleAsk)}
                            />
                        }
                        {...register("input")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAsk({ input: e.currentTarget.value });
                            }
                        }}
                    />
                    <Text textAlign="center" fontSize="sm" opacity={.5}>
                        Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.
                    </Text>
                </Stack>
            </Stack>
        </Stack>
    );
};
