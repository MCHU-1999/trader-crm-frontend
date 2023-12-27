import axios from "axios";

export async function get(url, header) { //GET請求
  try{
    let config = {
      headers: header,
    }
    let resData = await axios.get(url, config);
    return resData;
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

export async function post(url, header, data) { //POST請求
  try{
    let config = {
      headers: header,
    }
    let resData = await axios.post(url, data, config);
    return resData;
  }catch(errorMsg){
    console.log(errorMsg);
  }
}


