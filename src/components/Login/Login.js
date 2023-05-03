import './Login.test';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';

function Login() {

  const login = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      fetch('http://localhost:4242/api/login', { 
          method: 'POST', 
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify({ email: values.email, password: values.password }) 
        } )
        .then(response => {
          let data = response.json();
          if(response.ok){
            sessionStorage.setItem("token", data.token);
            alert("Sucess!") //TODO: Delete this
          }else{
            alert("The email or password is incorrect! Try again.")
          }
        })
    },
  });

  return (
    <div id="login-page">
      <Card style={{padding: "2em", width: "25em", }} id = "login-card" className = "my-auto">
        <Form onSubmit={login.handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              placeholder="Enter email"
              onChange={login.handleChange}
              value={login.values.email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              placeholder="Password"
              onChange={login.handleChange}
              value={login.values.password}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
