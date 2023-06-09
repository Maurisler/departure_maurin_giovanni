import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { useTranslation } from "react-i18next";

function Login() {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const login = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      if(values.email !== '' || values.password !== ''){
        fetch('http://localhost:4242/api/login', { 
          method: 'POST', 
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify({ email: values.email, password: values.password }) 
        } )
        .then(response => {
          response.json().then(data => {
            if(response.ok){
              window.sessionStorage.setItem("token", data.token);
              navigate("/home")
            }else{
              alert(t("incorrect_email_or_password_try_again"))
            }
          })
        })
      }else{
        alert(t("incorrect_email_or_password_try_again"))
      }
    },
  });

  return (
    <div id="login-page">
      <Card style={{padding: "2em", width: "25em", }} id = "login-card" className = "my-auto">
        <Form onSubmit={login.handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("email_adress")}</Form.Label>
            <Form.Control 
              className='field'
              type="email" 
              name="email" 
              data-testid='email'
              placeholder={t("placeholder_email")}
              onChange={login.handleChange}
              value={login.values.email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{t("password")}</Form.Label>
            <Form.Control 
              className='field'
              type="password" 
              name="password" 
              data-testid='password'
              placeholder={t("placeholder_password")}
              onChange={login.handleChange}
              value={login.values.password}
            />
          </Form.Group>

          <Button variant="primary" type="submit" data-testid='submit'>
            {t("login")}
          </Button>

        </Form>
      </Card>
    </div>
  );
}

export default Login;
