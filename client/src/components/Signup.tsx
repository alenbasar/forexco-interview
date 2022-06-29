import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const title = "Sign Up";

// MUI Button Styles
const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#2F49D1"),
  backgroundColor: "#2F49D1",
  "&:hover": {
    backgroundColor: "#2F49D1",
  },
  textTransform: "none",
}));

interface Response {
  res: string;
}

export default function Signup() {
  // States
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [signUpErr, setSignUpErr] = useState(false);

  const navigate = useNavigate();

  console.log(usernameReg, passwordReg);

  const handleSignup = async () => {
    if (passwordReg === confirmPass && usernameReg.length > 0) {
      const body = {
        username: usernameReg,
        password: passwordReg,
      };
      try {
        await axios
          .post<Response[]>("http://localhost:8000/register", body)
          .then((res) => {
            console.log("Signing up: ", res.data);
            navigate("/");
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      setSignUpErr(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section className="c-signup">
        <div className="c-signup__card">
          <FormGroup>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "45ch" },
              }}
              noValidate
              autoComplete="off"
              className="c-signup__card__form"
            >
              {signUpErr && (
                <span className="signup-error-msg">
                  Make sure username field is not empty and passwords match
                </span>
              )}
              {/* Username Input */}
              <label className="c-signup__card__form__input">
                <span className={signUpErr ? "signup-error" : ""}>
                  Username
                </span>

                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="Enter your username"
                  onChange={(e) => {
                    setUsernameReg(e.target.value);
                  }}
                  required
                />
              </label>

              {/* Password Input */}
              <label className="c-signup__card__form__input">
                <span className={signUpErr ? "signup-error" : ""}>
                  Password
                </span>

                <TextField
                  variant="outlined"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPasswordReg(e.target.value);
                  }}
                  type="password"
                  required
                />
              </label>

              {/* Password Confirmation Input */}
              <label className="c-signup__card__form__input">
                <span className={signUpErr ? "signup-error" : ""}>
                  Confirm Password
                </span>

                <TextField
                  variant="outlined"
                  placeholder="Confirm your password"
                  type="password"
                  onChange={(e) => {
                    setConfirmPass(e.target.value);
                  }}
                  required
                />
              </label>

              <Stack direction="column">
                <ColorButton variant="contained" onClick={handleSignup}>
                  Sign Up
                </ColorButton>
              </Stack>
            </Box>
          </FormGroup>
        </div>
        <div className="c-signup__login">
          <span>
            Already have an account? <a href="/">Sign In</a>
          </span>
        </div>
      </section>
    </>
  );
}
