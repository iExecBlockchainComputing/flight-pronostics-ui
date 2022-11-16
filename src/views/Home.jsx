import React, { useState } from "react";
import { useContractLoader } from "../hooks";
import HorizontalDivider from "../assets/HorizontalDivider.png";
import TakeOffIcon from "../assets/TakeOffIcon.png";
import { Button, InputNumber, notification } from "antd";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader } from "../hooks";

export default function Home({
  address,
  readProvider,
  writeProvider,
  contracts,
  tx,
}) {
  const contractsw = useContractLoader(writeProvider);
  const [BetValue, setBetValue] = useState("");
  const NumOfPlayers = useContractReader(
    contracts,
    "FlightBetting",
    "getNumberOfPlayers"
  );
  const AmountForAsPlanned = useContractReader(
    contracts,
    "FlightBetting",
    "getAmountBetsOnAsPlanned"
  );
  const AmountForCanceled = useContractReader(
    contracts,
    "FlightBetting",
    "getAmountBetsOnCanceled"
  );
  const Status = useContractReader(contracts, "FlightBetting", "getStatus");

  const handleBetAsPlanned = async () => {
    if (BetValue) {
      const val = parseEther(BetValue.toString());
      tx(
        contractsw.FlightBetting.bet(1, {
          gasPrice: 0,
          gasLimit: 737679,
          value: val,
        })
      );
    } else {
      notification.info({
        message: "Put in some xRLC",
        description: "Enter a valid input",
        placement: "bottomRight",
      });
    }
  };
  const handleBetCanceled = async () => {
    if (BetValue) {
      const val = parseEther(BetValue.toString());
      tx(
        contractsw.FlightBetting.bet(2, {
          gasPrice: 0,
          gasLimit: 737679,
          value: val,
        })
      );
    } else {
      notification.info({
        message: "Put in some xRLC",
        description: "Enter a valid input",
        placement: "bottomRight",
      });
    }
  };
  const handleClaimPrize = async () => {
    if (Status !== "scheduled") {
      tx(
        contractsw.FlightBetting.distributePrizes({
          gasPrice: 0,
          gasLimit: 737679,
        })
      );
    } else {
      notification.info({
        message: "Flight Still Scheduled",
        description: "wait until the flight has departed or canceled",
        placement: "bottomRight",
      });
    }
  };
  const handleUpdateStatus = async () => {
    tx(
      contractsw.FlightBetting.getOracleData({ gasPrice: 0, gasLimit: 737679 })
    );
  };

  return (
    <div
      className="container"
      style={{
        width: "70%",
      }}
    >
      <div className="container-table row-fluid">
        <div className="span4 flight-column animated fadeInDown">
          <div className="banner">
            <h3 className="firsttitle">Flight Pronostics</h3>
            <div className="status">
              Status: {Status ? Status.toString() : <p></p>}
            </div>
            <div className="status">
              <Button
                className="statusbutton"
                style={{ width: "180px", height: "30px" }}
                onClick={handleUpdateStatus}
              >
                Update Status
              </Button>
            </div>
          </div>
          <div className="flightResults-wrapper">
            <div className="card shadow-none flight-card-lg">
              <div className="row border-bottom pb-1">
                <div className="col-12 d-flex inline justify-content-between">
                  <div className="d-flex flex-column">
                    <span className="trip-locations"> Amsterdam to Paris</span>
                  </div>
                  <div className="price text-primary d-flex  align-items-center">
                    <Button
                      className="button-ps"
                      style={{ width: "250px" }}
                      onClick={handleClaimPrize}
                    >
                      Claim Prize
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row border-bottom mt-3 pb-3">
                <div className="col-3 d-flex flex-column">
                  <div className="d-flex justify-content-start">
                    <span className="time">Departure</span>
                  </div>
                  <span className="time">16:30</span>
                  <div className="date">08/10/2021</div>
                  <div className="location-details">AMS</div>
                </div>
                <div className="col-6 middle-col">
                  <img src={TakeOffIcon} className="height-45" alt="plane" />
                  <div className="detail-text mt-1">Duration: 1h15 </div>
                  <img
                    src={HorizontalDivider}
                    className="horizontal-divider height-45"
                    alt="divider"
                  />

                  <div className="detail-text">KLM Royal Dutch Airlines</div>
                </div>
                <div className="col-3 d-flex flex-column">
                  <div className="d-flex justify-content-start">
                    <span className="time">Arrival</span>
                  </div>
                  <span className="time">17:45</span>
                  <div className="date">08/10/2021</div>
                  <div className="location-details">CDG</div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex justify-content-center">
                  <InputNumber
                    className="inputbet"
                    style={{
                      outline: "none",
                      boxshadow: "2px 0px 5px #FFD90F",
                    }}
                    onChange={(e) => {
                      setBetValue(e);
                    }}
                    value={BetValue}
                    type="number"
                    min="0.001"
                    placeholder="Minimum: 0.001 xRLC"
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: 20 }}>
                <div className="col-12 d-flex justify-content-center">
                  <Button
                    className="action bet"
                    style={{ width: "300px" }}
                    onClick={handleBetAsPlanned}
                  >
                    I believe the flight will take-off as planned
                  </Button>
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <Button
                    className="action bet"
                    style={{ width: "300px" }}
                    onClick={handleBetCanceled}
                  >
                    I believe the flight will be cancelled or diverted!
                  </Button>
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <span className="trip-locations">
                    {" "}
                    Number of Players:{" "}
                    {NumOfPlayers ? NumOfPlayers.toNumber() : 0}
                  </span>
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <span className="trip-locations">
                    Amount for Takeoff as planned:
                    {AmountForAsPlanned
                      ? formatEther(AmountForAsPlanned)
                      : 0}{" "}
                    xRLC{" "}
                  </span>
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <span className="trip-locations">
                    Amount for canceled or diverted:
                    {AmountForCanceled
                      ? formatEther(AmountForCanceled)
                      : 0}{" "}
                    xRLC{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
