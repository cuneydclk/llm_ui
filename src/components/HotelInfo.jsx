// components/HotelInfo.jsx

import React from "react";
import { Stack, Box, Text } from "@chakra-ui/react";

export const HotelInfo = ({ hotels }) => {
    return (
        <Stack spacing={4} mt={4}>
            {hotels.map((hotel, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{hotel[1]}</Text>
                    <Text>{hotel[2]}</Text>
                    <Text>{hotel[3]}, {hotel[4]}</Text>
                    <Text>Rating: {hotel[5]}</Text>
                </Box>
            ))}
        </Stack>
    );
};
