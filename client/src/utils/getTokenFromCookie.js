const getCookie = () => {
  console.log("Retrieving token from cookie...");
  const name = "devToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      console.log("Token found");
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export default getCookie;
