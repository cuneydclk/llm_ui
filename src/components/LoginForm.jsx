// components/LoginForm.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import {
    Stack,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Text
} from "@chakra-ui/react";

const LoginForm = ({ handleLogin }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = (data) => {
        const payload = {
            username: data.username,
            password: data.password
        };
        handleLogin(payload.username, payload.password, navigate);
    };

    return (
        <Stack spacing={4}>
            <Heading>Login</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.username}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input id="username" type="text" {...register('username', { required: 'Username is required' })} />
                    <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
                    <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme="teal" isLoading={false} type="submit">
                    Login
                </Button>
            </form>
        </Stack>
    );
};

export default LoginForm;
