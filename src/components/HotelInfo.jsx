import React, { useEffect, useState } from "react";
import { Stack, Box, Text, Image, Link, Button } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HotelInfo = ({ hotels }) => {
    const [hotelMetadata, setHotelMetadata] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMetadata = async (hotelId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/hotels/${hotelId}/metadata`);
                setHotelMetadata((prevMetadata) => ({
                    ...prevMetadata,
                    [hotelId]: response.data.metadata
                }));
            } catch (error) {
                console.error(`Failed to fetch metadata for hotel ${hotelId}:`, error);
            }
        };

        hotels.forEach(hotel => {
            if (!hotelMetadata[hotel[0]]) {
                fetchMetadata(hotel[0]);
            }
        });
    }, [hotels]);

    return (
        <Stack spacing={4} mt={4}>
            {hotels.map((hotel, index) => {
                const metadata = hotelMetadata[hotel[0]];
                return (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="lg" display="flex">
                        {metadata && (
                            <Image src={metadata.photo_url} alt={`${hotel[1]} photo`} boxSize="150px" objectFit="cover" mr={4} />
                        )}
                        <Stack>
                            <Text fontWeight="bold">{hotel[1]}</Text>
                            <Text>{hotel[2]}</Text>
                            <Text>{hotel[3]}, {hotel[4]}</Text>
                            <Text>Rating: {hotel[5]}</Text>
                            {metadata && (
                                <Link href={metadata.website_url} color="teal.500" isExternal>Visit Website</Link>
                            )}
                            <Button
                                mt={4}
                                colorScheme="teal"
                                onClick={() => {
                                    // navigate(`/payment`, { state: { hotelId: hotel[0] } });
                                    navigate(`/payment/${hotel[0]}`);

                                }}
                            >
                                Proceed to Payment
                            </Button>
                        </Stack>
                    </Box>
                );
            })}
        </Stack>
    );
};

export default HotelInfo;