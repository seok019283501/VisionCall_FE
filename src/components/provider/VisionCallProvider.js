import {  useRef, useState } from "react";
import VisionCallContext from "./VisionCallContext";
import axios from "axios";
const VisionCallProvider = (props) =>{
  

  return (
    <VisionCallContext.Provider value={{}}>
        {props.children}
    </VisionCallContext.Provider>
  );
};

export default VisionCallProvider;