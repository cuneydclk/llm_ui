import React, { useState } from 'react';
import { render } from 'react-dom';
import Card from 'react-credit-cards';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from './utils';
import 'react-credit-cards/es/styles-compiled.css';

const App = () => {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    issuer: '',
    focused: '',
  });
  const toast = useToast();

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setFormData({ ...formData, issuer });
    }
  };

  const handleInputFocus = ({ target }) => {
    setFormData({ ...formData, focused: target.name });
  };

  const handleInputChange = ({ target }) => {
    let value = target.value;
    if (target.name === 'number') {
      value = formatCreditCardNumber(value);
    } else if (target.name === 'expiry') {
      value = formatExpirationDate(value);
    } else if (target.name === 'cvc') {
      value = formatCVC(value);
    }
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Payment Successful',
      description: 'You have finished payment!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    // Clear form after submission
    setFormData({
      number: '',
      name: '',
      expiry: '',
      cvc: '',
      issuer: '',
      focused: '',
    });
  };

  const { name, number, expiry, cvc, focused, issuer } = formData;

  return (
    <Box padding={6} maxWidth="800px" margin="auto">
      <Heading mb={6}>Enter your payment details</Heading>
      <Text mb={4}>Please input your information below</Text>
      <Card
        number={number}
        name={name}
        expiry={expiry}
        cvc={cvc}
        focused={focused}
        callback={handleCallback}
      />
      <form onSubmit={handleSubmit}>
        <Stack spacing={4} mt={6}>
          <FormControl id="name" isRequired>
            <FormLabel>Name on card</FormLabel>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Name"
              pattern="[a-zA-Z- ]+"
              required
            />
          </FormControl>
          <FormControl id="number" isRequired>
            <FormLabel>Card Number</FormLabel>
            <Input
              type="tel"
              name="number"
              value={number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Card Number"
              pattern="\d{16,19}"
              maxLength="19"
              required
            />
          </FormControl>
          <FormControl id="expiry" isRequired>
            <FormLabel>Expiration Date</FormLabel>
            <Input
              type="tel"
              name="expiry"
              value={expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="MM/YY"
              pattern="\d\d/\d\d"
              required
            />
          </FormControl>
          <FormControl id="cvc" isRequired>
            <FormLabel>CVC</FormLabel>
            <Input
              type="tel"
              name="cvc"
              value={cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="CVC"
              pattern="\d{3}"
              required
            />
          </FormControl>
          <Input type="hidden" name="issuer" value={issuer} />
          <Button type="submit" colorScheme="blue">Submit</Button>
        </Stack>
      </form>
    </Box>
  );
};


export default App;