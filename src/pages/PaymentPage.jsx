import React, { useState, useEffect } from "react";
import useForm from "./useForm";
import { Button, Form, Row, Col, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/PaymentPage.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from 'react-router-dom';




const PaymentPage = () => {
  const { handleChange, handleFocus, handleSubmit, values, errors } = useForm();
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [show, setShow] = useState(false);



  console.log('Hotel ID:', hotelId);

  const [hotelDetails, setHotelDetails] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    rating: 0,
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/hotels/${hotelId}`);
        console.log(response.data.hotel);
        if (response.data && response.data.hotel) {
          setHotelDetails({
            name: response.data.hotel.name,
            address: response.data.hotel.address,
            city: response.data.hotel.city,
            country: response.data.hotel.country,
            rating: response.data.hotel.rating,
            image: response.data.hotel.photo_url,
            description: response.data.hotel.description
          });
        }
      } catch (error) {
        console.error(`Failed to fetch hotel details for hotel ${hotelId}:`, error);
      }
    };
    fetchHotelDetails();
  }, [hotelId]);


  const handleClose = () => {
    setShow(false);
    navigate("/home");
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Perform payment processing logic here
    setShow(true); // Show popup
  };

  return (
    <div style={{overflow: "hidden", height: "100vh"}}>
      <Button variant="secondary" onClick={() => navigate("/home")} style={{ 
        position: "absolute", 
        top: "10px", 
        left: "10px",
        backgroundColor: "#2e374a",
        border: "none",
        fontSize: "1.2rem",
        width: "80px",
        }}>
        Back
      </Button>


        <script>console.log(hotelDetails)</script>

      <div className="container">

        <Row className="info-and-card">
          <Col md={6} className="hotel-info">
            <h2 style={{ color: "#ffffffd9" 
              , fontSize: "1.2rem"
              , marginBottom: "10px"
              , marginTop: "10px"
              , textAlign: "center"
              , fontWeight: "bold"
              , textTransform: "uppercase"
              , letterSpacing: "1px"
              , textDecorationColor: "#ffffffd9"
            }}>{hotelDetails.name}</h2>
            <Image src={hotelDetails.image} alt="Hotel Image" thumbnail />
            <p className="price"
            style={{
              color: "#ffffffd9",
              fontSize: "1.2rem",
              marginBottom: "10px",
              marginTop: "10px",
            }}
            >Price: ${hotelDetails.price}</p>
            <p className="hotelLocation"
            style={{
              color: "#ffffffd9",
              fontSize: "1.2rem",
              marginBottom: "10px",
            }}
            >Hotel Location: {hotelDetails.address +" "+ hotelDetails.city +" "+ hotelDetails.country}</p>
            <p className="hotelDescription"
            style={{
              color: "#ffffffd9",
              fontSize: "1.2rem",
              marginBottom: "10px",
            }}
            >Hotel Description: {hotelDetails.description}</p>
            <p className="hotelRating"
            style={{
              color: "#ffffffd9",
              fontSize: "1.2rem",
              marginBottom: "10px",
            }}
            >Hotel Rating: {hotelDetails.rating}</p>
          </Col>

          <Col md={6}>
          <div className="box justify-content-center align-items-center">
            <div className="formDiv">
              <div className="creditCard">
                <Cards
                  cvc={values.cardSecurityCode}
                  expiry={values.cardExpiration}
                  focused={values.focus}
                  name={values.cardName}
                  number={values.cardNumber}
                />
              </div>
              <Form onSubmit={handlePayment}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    id="cardName"
                    data-testid="cardName"
                    name="cardName"
                    placeholder="Cardholder Name"
                    value={values.cardName}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    isValid={errors.cname}
                    style={{ marginBottom: "10px" }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="number"
                    id="cardNumber"
                    data-testid="cardNumber"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={values.cardNumber}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    isValid={errors.cnumber}
                    style={{ marginBottom: "10px" }}
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="cardType"
                        id="cardType"
                        data-testid="cardType"
                        placeholder="Card Type"
                        value={values.cardType}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        isValid={errors.ctype}
                        style={{ marginBottom: "10px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        id="cardExpiration"
                        data-testid="cardExpiration"
                        name="cardExpiration"
                        placeholder="Expiration Date"
                        value={values.cardExpiration}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        isValid={errors.cexp}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        id="cardSecurityCode"
                        data-testid="cardSecurityCode"
                        name="cardSecurityCode"
                        placeholder="Security Code"
                        value={values.cardSecurityCode}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        isValid={errors.ccvv}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        id="cardPostalCode"
                        data-testid="cardPostalCode"
                        name="cardPostalCode"
                        placeholder="Postal Code"
                        value={values.cardPostalCode}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        isValid={errors.cpostal}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="justify-center">
                  <Col>
                    <Button
                      size={"block"}
                      data-testid="paymentButton"
                      id="paymentButton"
                      type="submit"
                      style={{ marginLeft: "85px", marginTop: "25px" }}
                    >
                      Complete Payment
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        backgroundColor: "transparent",
        border: "none", boxShadow: "none", borderRadius: "none",
        color: "transparent", backdropFilter: "blur(5px)", padding: "0",
      }}>
        <Modal.Body style={{
          backgroundColor: "rgba(26,32,44,255)", color: "#fff",
          fontFamily: "Arial, sans-serif", fontSize: "1.2rem",
          textAlign: "center", padding: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"
        }}>
          Payment completed successfully!
        </Modal.Body>
        <Button variant="primary" onClick={handleClose} style={{
          backgroundColor: "#007bff", border: "none", borderRadius: "0",
          width: "100%", padding: "5px", fontSize: "1.2rem", fontWeight: "bold", textAlign: "center"
        }}>
          OK
        </Button>
      </Modal>
      </div>
    </div>
  );
};


export default PaymentPage;