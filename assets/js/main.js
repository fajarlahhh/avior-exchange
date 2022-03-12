// main.js
const aviorPrice = 0.5
var usdtPrice = 0
var usdtNeed = 0
var adminAddress = "0x0248103E69C2d84DE296581035933Db137DA1a38"
var userAddress

const serverUrl = "https://ycgczemrdobt.usemoralis.com:2053/server";
const appId = "vZqW8n6mFszQbzKMRB6iy3lTJMwO743Z7GRLScNd";
Moralis.start({ serverUrl, appId });

btnLogin = document.getElementById("btn-login")
btnLogout = document.getElementById("btn-logout")
btnAddToMetamask = document.getElementById("btn-add-to-metamask")
btnSubmitMetamask = document.getElementById("btn-form-metamask")

txtAviorAmount = document.getElementById("txt-avior-amount")
txtMetamaskAddress = document.getElementById("txt-metamask-address")
formMetamask = document.getElementById("form-metamask")
formManual = document.getElementsByClassName("form-manual")
txtResult = document.getElementById("txt-result")

function checkLogin() {
  if (Moralis.User.current()) {
    btnLogin.classList.add('hidden')
    btnAddToMetamask.classList.remove('hidden')
    btnLogout.classList.remove('hidden')
    for(var i = 0; i < formManual.length; i++)
    {
      formManual[i].classList.add('hidden')
    }
    formMetamask.classList.remove('hidden')
    
    btnSubmitMetamask.onclick = sendUsd
    txtAviorAmount.onkeyup = setUsdt
    btnLogout.onclick = logOut
  } else {
    btnAddToMetamask.classList.add('hidden')
    btnLogout.classList.add('hidden')
    btnLogin.classList.remove('hidden')
    for(var i = 0; i < formManual.length; i++)
    {
      formManual[i].classList.remove('hidden')
    }
    formMetamask.classList.add('hidden')

    btnSubmitMetamask.onclick = null
    txtAviorAmount.onkeyup = null
    btnLogout.onclick = null
  }
}

window.addEventListener('DOMContentLoaded', (e) => {
  let user = Moralis.User.current();
  
  if (user){
    userAddress = user.get("ethAddress")
  }

  checkLogin()
  document.getElementById("txt-admin-address").innerText = adminAddress
  getPrice()
  document.getElementById("txt-welcome").innerText = "AVIOR TOKEN IS AVAILABLE $ " + aviorPrice
})

Moralis.onAccountChanged( async (account) => {
  const confirmed = confirm("Link this address to your account?");
  if (confirmed) {
    await Moralis.link(account);
  }
});

async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        btnLogin.classList.add('hidden')
        btnLogout.classList.remove('hidden')
        btnAddToMetamask.classList.remove('hidden')
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
        userAddress = user.get("ethAddress")
        checkLogin()
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function setUsdt() {
  usdtNeed = (txtAviorAmount.value?txtAviorAmount.value:0) * aviorPrice/usdtPrice
  document.getElementById("txt-usdt").innerText = usdtNeed
  txtResult.innerHTML = ''
}

async function addToMetamask(){
  await ethereum.request({
    method: 'wallet_watchAsset',
    params: {
        type: 'ERC20',
        options: {
            address: '0x4Eb2EC9d95e420bB79e60C33aa2068713F25C636',
            symbol: 'AVR',
            decimals: 18,
            image: 'https://aviortoken.com/assets/logo.png',
        },
    },
  })
}

async function logOut() {
  await Moralis.User.logOut();
  btnLogout.classList.add('hidden')
  btnAddToMetamask.classList.add('hidden')
  btnLogin.classList.remove('hidden')
  userAddress = ''
  checkLogin()
  console.log("logged out");
}

async function getPrice(){
  const options = {
    address: "0x55d398326f99059ff775485246999027b3197955",
    chain: "bsc",
    exchange: "PancakeSwapv2",
  };
  const price = await Moralis.Web3API.token.getTokenPrice(options);
  usdtPrice = price.usdPrice
  document.getElementById("txt-avior-price").innerHTML =  + aviorPrice/usdtPrice + " <small class='text-orange-500'>USD (BEP-20)</small>"
}

async function sendUsd(){
  if (usdtNeed > 0) {
    formMetamask.classList.add('hidden')
    document.getElementById("txt-result").innerText = "Do not leave this tab until the transaction is complete!!!"
    window.onbeforeunload = function() {
        return "Do not leave this tab until the transaction is complete";
    }
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token(usdtNeed, "18"),
      receiver: adminAddress,
      contractAddress: "0x55d398326f99059fF775485246999027B3197955",
    };
    try {
      await Moralis.enableWeb3();
      const transaction = await Moralis.transfer(options);
      const result = await transaction.wait();
      if (result) {
        console.log(result)
        txtResult.innerHTML = result.transactionHash
      }
    }
    catch(e) {
      console.log(e)
      formMetamask.classList.remove('hidden')
      var message = ''
      if (e.code === 4001){
        message = '(User rejected the transaction)'
      }
      txtResult.innerHTML = 'Transaction failed. ' + message
    }
    window.onbeforeunload = null
  }
}

btnLogin.onclick = login;
btnAddToMetamask.onclick = addToMetamask;