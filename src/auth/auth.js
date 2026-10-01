import Cookies from "js-cookie";

export const isLoggedIn = async () => {

    // console.log("IsLoggedIn Called!")
  const verification = localStorage.getItem('isVerified'); // returns undefined if not present
//   console.log("isLoggedIn ? : ", verification);
  return !!verification;

};