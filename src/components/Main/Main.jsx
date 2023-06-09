import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link,useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";

function Main() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [connections, setConnections] = useState([]);
  const { t } = useTranslation();

  const fromRef = useRef(null);
  const toRef = useRef(null);

  let token = useRef()

  let navigate = useNavigate();

  useEffect(() => {
    token.current = window.sessionStorage.getItem("token");
    if(token.current === null){
      navigate("/");
    }
    getConnections(); 
  },[])

  function setVal(ref, value, response){

  }

  async function deleteConnection(id){
    fetch('http://localhost:4242/api/connections/' + id, { 
        method: 'DELETE', 
        headers: {'x-access-token': token.current}, 
    }).then(() =>{
      getConnections()
    });
  }

  async function getConnections(){
   fetch('http://localhost:4242/api/connections', { 
      method: 'GET', 
      headers: {'x-access-token': token.current}, 
   }).then(response =>{
    if(response.ok){
      response.json().then(d => {
        setConnections(d)
      });
    }else{
      navigate("/");
    }
   });
  }
  
  async function submitConection(){
    fetch('http://localhost:4242/api/connections', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json', 'x-access-token': token.current}, 
      body: JSON.stringify({ from: from, to: to }) 
    });
    getConnections();
  }


  async function swapVal(){
    await fromSearch.handleSubmit();
    await toSearch.handleSubmit();
    let temp = from;
    setFrom(to)
    setTo(temp)
    fromRef.current.value = temp;
    toRef.current.value = to;
  }

  const fromSearch = useFormik({
    initialValues: {
      from: '',
    },
    onSubmit: () => {
      fetch('http://transport.opendata.ch/v1/locations?query=' + from, { 
          method: 'GET', 
        } )
        .then(response => {
          if(response.ok){
            response.json().then(d => {
              try{
                setFrom(fromRef.current.value = d.stations[0].name);
              }catch(error){
                navigate("/");
              }      
            });
          }else{
            navigate("/");
          }
      })
    },
  });
  
  const toSearch = useFormik({
    initialValues: {
      to: '',
    },
    onSubmit: () => {
      fetch('http://transport.opendata.ch/v1/locations?query=' + to, { 
          method: 'GET', 
        } )
        .then(response => {
          response.json().then(d => {
            if(response.ok){
              try{
                setTo(toRef.current.value = d.stations[0].name);
              }catch(error){
                navigate("/");
              }
            }else{
              navigate("/");
            }
          });
        })
    },
  });
  
  //TODO: Insert translation
  return (
    <>
      <div id="main-top">
        <div>
          <Form >
              <Form.Label htmlFor="from">{t("depart")}:</Form.Label> 
              <Form.Control
                onBlur={fromSearch.handleSubmit}
                type="text"
                id="from"
                name="from"
                ref={fromRef}
                onChange={(e) => setFrom(e.target.value)}
              />
          </Form>
        </div>
        <Button variant="secondary" onClick={swapVal}>⇄</Button>
        <div>
          <Form >
            <Form.Label htmlFor="to">{t("arrival")}:</Form.Label>
            <Form.Control
              onBlur={toSearch.handleSubmit}
              type="text"
              id="to"
              name="to"
              ref={toRef}
              onChange={(e) => setTo(e.target.value)}
            />
          </Form>
        </div>
        <Button variant="secondary" onClick={submitConection}>{t("add")}</Button>
      </div>
      <h4>{t("saved_connections")}:</h4>
        {
          connections.map(connection => (
            <Card>
              <p><b>{t("from")}:</b> {connection.from}</p>
              <p><b>{t("to")}:</b> {connection.to}</p>
              <Button className='buttons-main' variant='danger' onClick={() => deleteConnection(connection.id)}>{t("delete")}</Button>
              <Link to={`/connection/` + connection.id}>
                <Button className='buttons-main' variant='info'>{t("view")}</Button>
              </Link>
            </Card>
          ))
        }
    </>
  );
}

export default Main;
