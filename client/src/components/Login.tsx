import { useState } from "react";
import { Helmet } from "react-helmet";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios, { HeadersDefaults } from "axios";

interface CommonHeaderProperties extends HeadersDefaults {
  "x-auth-token": string | null;
  auth: boolean;
}

// MUI Button Styles
const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#2F49D1"),
  backgroundColor: "#2F49D1",
  "&:hover": {
    backgroundColor: "#2F49D1",
  },
  textTransform: "none",
}));

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const userAuth = async () => {
    let tokenFromStorage = localStorage.getItem("token");
    if (!tokenFromStorage) {
      throw new Error("No token supplied");
    }
    try {
      await axios
        .get<CommonHeaderProperties>("http://localhost:8000/userAuth", {
          headers: {
            "x-auth-token": tokenFromStorage,
          },
        })
        .then((res) => {
          console.log(res);
          setAuthenticated(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignin = async () => {
    const body = {
      username: username,
      password: password,
    };
    try {
      await axios.post("http://localhost:8000/login", body).then((res) => {
        console.log("Sign in:", res.data);
        if (res.data.auth) {
          localStorage.setItem("token", res.data.token);

          userAuth();
          navigate("/convert", { state: username });
        } else {
          setLoginErr(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Log In`}</title>
      </Helmet>
      <section className="c-login">
        <div className="c-login__card">
          <FormGroup>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "45ch" },
              }}
              noValidate
              autoComplete="off"
              className="c-login__card__form"
            >
              {loginErr && (
                <span className="login-error-msg">
                  Wrong username or password
                </span>
              )}
              {authenticated && (
                <span className="login-error-msg">Something went wrong</span>
              )}
              {/* Username input */}
              <label className="c-login__card__form__input">
                <span className={loginErr ? "login-error" : ""}>Username</span>

                <TextField
                  variant="outlined"
                  placeholder="Enter your username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </label>
              {/* Password input */}
              <label className="c-login__card__form__input">
                <span className={loginErr ? "login-error" : ""}>Password</span>

                <TextField
                  variant="outlined"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                />
              </label>

              <div className="c-login__card__form__forgot">
                <span>Forgot your password?</span>
              </div>
              <label className="c-login__card__form__checkbox">
                <input type="checkbox" />
                <span className="c-login__card__form__checkbox__label">
                  Remember me
                </span>
              </label>
              <Stack direction="column">
                <ColorButton variant="contained" onClick={handleSignin}>
                  Sign In
                </ColorButton>
              </Stack>
            </Box>
          </FormGroup>
        </div>
        <div className="c-login__sign-up">
          <span>
            New to currency transfer? <a href="/sign-up">Sign Up</a>
          </span>
        </div>
      </section>
    </>
  );
}
