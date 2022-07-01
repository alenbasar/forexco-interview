import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import axios from "axios";
import converterIcon from "../assets/converter-icon.png";
import swapIcon from "../assets/converter-swap-icon.png";
import loader from "../assets/loader.svg";

type Conversion = {
  symbols: string[];
  from: string;
  to: string;
  amount: number | null | any;
  result: string;
  rate: number | null;
};

// MUI Button Styles
const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#002854"),
  marginBottom: "2rem",
  width: "10rem",
  height: "3.5rem",
  backgroundColor: "#002854",
  "&:hover": {
    backgroundColor: "#002854",
  },
  textTransform: "none",
}));

const Convert = () => {
  const [fetchError, setFetchError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRate, setShowRate] = useState(false);
  const [convertData, setConvertData] = useState<Conversion>({
    symbols: [],
    from: "AUD",
    amount: 1,
    to: "USD",
    result: "",
    rate: null,
  });
  const { symbols, from, amount, to, result, rate } = convertData;

  useEffect(() => {
    setLoading(true);
    try {
      const getResult = async () => {
        const { data } = await axios.get(
          `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
        );
        if (!data) {
          return;
        }
        if (data) {
          const rate = data.info.rate.toPrecision();
          const result = data.result.toFixed(3);

          setConvertData({
            ...convertData,
            result: result,
            rate,
          });
          showRateHandler();
          setTimeout(() => setLoading(false), 550);
        } else {
          setFetchError(true);
        }
      };
      getResult();
    } catch (error) {
      console.log(error);
    }
  }, [amount, from, to, refresh]);

  useEffect(() => {
    try {
      const getSymbol = async () => {
        await axios.get(`https://api.exchangerate.host/symbols`).then((res) => {
          if (res.data) {
            const rawSymbols = res.data.symbols;
            for (let key in rawSymbols) {
              symbols.push(key);
            }
            setConvertData({
              ...convertData,
              symbols,
            });
          } else {
            console.log("Error while fetching symbols");
          }
        });
      };
      getSymbol();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const location = useLocation();
  var myHeaders = new Headers();
  myHeaders.append("apikey", "dU1ta3aOck49UQP9EYU0vjvOOO5MPy1q");

  const showRateHandler = () => {
    if (rate !== null && amount > 0) {
      setShowRate(true);
    }
  };

  const handleInput = (e: any) => {
    setConvertData({
      ...convertData,
      amount: e.target.value,
    });
  };

  const handleSelection = (e: any) => {
    setConvertData({
      ...convertData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwap = () => {
    let from = convertData.from;
    let to = convertData.to;

    setConvertData({
      ...convertData,
      from: to,
      to: from,
    });
  };

  let username = location.state;

  return (
    <>
      <Helmet>
        <title>{`Log In`}</title>
      </Helmet>
      {username ? (
        <section className="c-convert">
          <p className="c-convert__welcome">
            Welcome back <span>{`${username}`}</span>
          </p>
          <div className="c-convert__card">
            <div className="c-convert__card__logo">
              <img
                src={converterIcon}
                alt=""
                className="o-logo"
                draggable="false"
              />
              <div className="c-convert__card__logo__text">
                <p>Currency</p>
                <p>Transfer</p>
              </div>
            </div>
            <div className="c-convert__card__input-fields">
              <fieldset className="c-convert__card__input-fields__fieldset">
                <legend>From</legend>
                <select onChange={handleSelection} name="from" value={from}>
                  {symbols.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="c-convert__card__input-fields__fieldset__divider"></div>
                <div>
                  <input
                    type="text"
                    onChange={handleInput}
                    defaultValue={amount}
                  ></input>
                </div>
              </fieldset>
              {!loading ? (
                <img
                  src={swapIcon}
                  alt=""
                  className="c-convert__card__input-fields__swap-icon"
                  draggable="false"
                  onClick={() => {
                    handleSwap();
                  }}
                />
              ) : (
                <img
                  src={loader}
                  alt=""
                  className="c-convert__card__input-fields__loader"
                  draggable="false"
                />
              )}
              <fieldset className="c-convert__card__input-fields__fieldset">
                <legend>To</legend>
                <select onChange={handleSelection} name="to" value={to}>
                  {symbols.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="c-convert__card__input-fields__fieldset__divider"></div>
                <div>
                  <input type="text" disabled value={result}></input>
                </div>
              </fieldset>
            </div>
            <div className="c-convert__card__market-rate">
              {showRate && <span>Market Rate {`${rate}`}</span>}
              {fetchError && <span>Error Fetching Data</span>}
            </div>
            <Stack direction="column">
              <ColorButton
                variant="contained"
                onClick={() => {
                  setRefresh(true);
                }}
              >
                Refresh
              </ColorButton>
            </Stack>
          </div>
          <div className="c-convert__sign-out">
            <a href="/">Sign Out</a>
          </div>
        </section>
      ) : (
        <section className="c-not-logged">
          <p>You are not logged in</p>
          <p>
            Please <a href="/">log in</a>
          </p>
        </section>
      )}
    </>
  );
};

export default Convert;
