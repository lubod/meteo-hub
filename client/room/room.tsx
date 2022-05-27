import { observer } from "mobx-react";
import React from "react";
import { Row, Col } from "react-bootstrap";
import AuthData from "../auth/authData";
import Data from "../data/data";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import Text from "../text/text";

type RoomProps = {
  air: number;
  floor: number;
  required: number;
  heat: number;
  summer: number;
  low: number;
  room: string;
  airTrend: Array<number>;
  floorTrend: Array<number>;
  measurementAir: string;
  measurementFloor: string;
  authData: AuthData;
};

const Room = observer(
  ({
    air,
    floor,
    required,
    heat,
    summer,
    low,
    room,
    airTrend,
    floorTrend,
    measurementAir,
    measurementFloor,
    authData,
  }: RoomProps) => (
    <div className="text-left small text-info font-weight-bold">
      {room}
      <Row className="text-light">
        <Col xs={3}>
          <DataWithTrend
            name=""
            value={air}
            unit="°C"
            fix={1}
            data={airTrend}
            range={1.6}
            couldBeNegative
            measurement={measurementAir}
            authData={authData}
          />
        </Col>
        <Col xs={3}>
          <DataWithTrend
            name=""
            value={floor}
            unit="°C"
            fix={1}
            data={floorTrend}
            range={1.6}
            couldBeNegative
            measurement={measurementFloor}
            authData={authData}
          />
        </Col>
        <Col xs={3}>
          <Data name="" value={required} unit="°C" fix={1} />
        </Col>
        <Col xs={2}>
          <Text
            name=""
            value={`${heat != null ? heat.toFixed(0) : ""}${
              summer != null ? summer.toFixed(0) : ""
            }${low != null ? low.toFixed(0) : ""}`}
          />
        </Col>
      </Row>
    </div>
  )
);

export default Room;
