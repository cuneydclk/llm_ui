// components/RegisterForm.jsx

import React from 'react';
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

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const mutation = useMutation(async (data) => {
        const response = await axios.post('http://127.0.0.1:5000/register', data);
        return response.data;
    });

    const onSubmit = (data) => {
        // Prepare the data to match the API's expected structure
        const payload = {
            username: data.username,
            email: data.email,
            password: data.password
        };
        mutation.mutate(payload);
    };

    return (
        <Stack spacing={4}>
            <Heading>Register</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.username}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input id="username" type="text" {...register('username', { required: 'Username is required' })} />
                    <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
                    <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
                    <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme="teal" isLoading={mutation.isLoading} type="submit">
                    Register
                </Button>
            </form>
            {mutation.isError && <Text color="red.500">{mutation.error.response.data.message}</Text>}
        </Stack>
    );
};

export default RegisterForm;
