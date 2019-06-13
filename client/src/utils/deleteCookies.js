const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  console.log(document.cookie);
  console.log("Cookie deleted");
};

export default deleteAllCookies;
