export const westernRegion = [
  "obalende",
  "ikeja",
  "osogbo",
  "akure",
  "tejuoso",
  "ikorodu",
  "ibadan",
  "abeokuta",
  "aswani",
  "ado-ekiti",
  "ilorin",
];

export const northernRegion = [
  "abuja main",
  "kano",
  "sokoto",
  "lokoja",
  "yola",
  "abuja 2",
  "bauchi",
  "lafia",
  "kaduna",
  "minna",
  "jos",
  "makurdi",
  "maiduguri",
  "abuja 3",
];

export const easternRegion = [
  "port harcourt 1",
  "benin",
  "onitsha",
  "enugu",
  "oji",
  "asaba",
  "port harcourt 2",
  "calabar",
  "awka",
  "aba",
  "uyo",
  "owerri",
];

export const limit = 8;

export const generatePassword = async (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const fetchAllComments = async (currentPage, getDataApi) => {
  const response = await getDataApi(currentPage, limit);
  return response.data.data;
};

export const handlePagination = async (data, setComments, getDataApi) => {
  let currentPage = data.selected + 1;
  const dataFromServer = await fetchAllComments(currentPage, getDataApi);
  setComments(dataFromServer);
};
