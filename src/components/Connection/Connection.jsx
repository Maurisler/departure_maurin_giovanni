import './Connection.test';
import Card from 'react-bootstrap/Card';
import { useNavigate ,useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';



function Connection() {
  const [spinner, setSpinner] = useState(false); 
  let navigate = useNavigate();
  const connectionId = useParams().connectionId;
  let from;
  let to;
  const [connections, setConnections] = useState([]);

  let token = useRef()

  useEffect(() => {
    token.current = window.sessionStorage.getItem("token");
    if(token.current === null){
      navigate("/");
    }

    getUserConnection(connectionId)

    const interval = setInterval(() => {
      getUserConnection(connectionId);
    }, 60000);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])


  async function getUserConnection(connectionId){
   fetch('http://localhost:4242/api/connections', { 
      method: 'GET', 
      headers: {'x-access-token': token.current}, 
   }).then(response =>{
    if(response.ok){
      return response.json();
      
    }else{
      //TODO:ERROR
    }
   }).then(d => {
    console.log(d)
    d.forEach(e => {
      if(parseInt(e.id) === parseInt(connectionId)){
        from = e.from;
        to = e.to;
        return;
      }
    })
    getConnections();
    });
  }

  async function getConnections(){
    if(from === undefined || to === undefined){
      navigate("/errorpage")
    }
    fetch('http://transport.opendata.ch/v1/connections?from="' + from + '"&to="' + to + '"&limit=5', { 
        method: 'GET'
    }).then(response =>{
      if(response.ok){
        setSpinner(true)
        response.json().then(d => {
          setConnections(d.connections)
        });
      }else{
        //TODO:ERROR
      }
    });
  }

  function getTimeDifference(timestamp) {
    const currentTime = new Date();
    const targetTime = new Date(timestamp);
    const timeDifference = Math.abs(targetTime - currentTime);
  
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
  
    let timeDiffString = '';
  
    if (currentTime < targetTime) {
      timeDiffString = getTimeDescGerman(timeDifference, minute, hour, day)

    } else {
      timeDiffString = 'Der Zug ist abgefahren';
    }
  
    return timeDiffString;
  }
  
  function getTimeDescGerman(time,minute, hour, day){
    let timeString = ""
    const days = Math.floor(time / day);
    const hours = Math.floor((time % day) / hour);
    const minutes = Math.floor((time % hour) / minute);

    if (days> 0) {
      timeString += `${days} Tag${days > 1 ? 'e' : ''}, `;
    }
    if (hours > 0) {
      timeString += `${hours} Stunde${hours > 1 ? 'n' : ''}, `;
    }
    if (minutes === 1) {
      timeString += `1 Minute`;
    } else if (minutes > 1 || time === '') {
      timeString += `${minutes} Minuten`;
    }

    return timeString
  }
  
  //TODO: Insert translation
  return (
    <div id='connection-page'>
      {
        spinner ?
        (
        //TODO: if first connection is tommorow, mark as next day only
        connections.map(connection => (
            <Card>
              <p><b>Von:</b> {connection.from.station.name}</p>
              <p><b>Zu:</b> {connection.to.station.name}</p>
              <p><b>Abfahrt in:</b> {getTimeDifference(connection.from.departure)}</p>
              <p><b>Verspätung:</b> {connection.from.delay == null ? "Nicht bekannt" : (connection.from.delay + 'Minuten')}</p>
              <p><b>Status:</b> {getTimeDifference(connection.from.departure) === "Der Zug ist abgefahren" ? "Abgefahren" : "Verfügbar"}</p>
              <p><b>Dauer:</b> {connection.to.platform}</p>
            </Card>
        ))
        )
        :
        <Spinner animation="border" variant="primary" id='loading-element'/>
      }
    </div>
  );
}

export default Connection;
