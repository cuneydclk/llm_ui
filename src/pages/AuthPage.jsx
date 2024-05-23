// pages/AuthPage.jsx

import React, { useState } from 'react';
import { Stack, Button } from "@chakra-ui/react";
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import axios from 'axios';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async (username, password, navigate) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", {
                username,
                password
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Logged in successfully");
                navigate('/home');
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data);
        }
    };

    return (
        <Stack spacing={8} width="full" maxWidth="md" marginX="auto" padding={8}>
            {isLogin ? <LoginForm handleLogin={handleLogin} /> : <RegisterForm />}
            <Button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </Button>
        </Stack>
    );
};

export default AuthPage;
