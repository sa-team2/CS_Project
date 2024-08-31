import React from 'react'
import './Cards.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faFire, faCrosshairs } from '@fortawesome/free-solid-svg-icons';

function Cards() {
  return (
    <>
      <Card className="card-custom bg-gradient-pink">
        <Card.Body className="cardbody-custom">
          <Card.Title><b>資料數量：</b></Card.Title>
          <Card.Text className="cardtext-custom">
            <FontAwesomeIcon icon={ faDatabase } /> 1000+
          </Card.Text>
        </Card.Body>
      </Card>
      
      <Card className="card-custom bg-gradient-blue">
        <Card.Body className="cardbody-custom">
          <Card.Title><b>熱門詐騙類型：</b></Card.Title>
          <Card.Text className="cardtext-custom">
            <FontAwesomeIcon icon={ faFire } /> 解除分期付款
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="card-custom bg-gradient-green">
        <Card.Body className="cardbody-custom">
          <Card.Title><b>辨識準確度：</b></Card.Title>
          <Card.Text className="cardtext-custom">
            <FontAwesomeIcon icon={ faCrosshairs } /> 90%
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}

export default Cards;
