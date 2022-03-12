// main.js
const aviorPrice = 0.5
var usdtPrice = 0
var usdtNeed = 0
var adminAddress = "0x0248103E69C2d84DE296581035933Db137DA1a38"
var userAddress
var txtAviorAmount

const serverUrl = "https://ycgczemrdobt.usemoralis.com:2053/server";
const appId = "vZqW8n6mFszQbzKMRB6iy3lTJMwO743Z7GRLScNd";
Moralis.start({ serverUrl, appId });

const btnLogin = document.getElementById("btn-login")
const btnLogout = document.getElementById("btn-logout")
const btnAddToMetamask = document.getElementById("btn-add-to-metamask")
const btnSubmitMetamask = document.getElementById("btn-form-metamask")

const txtMetamaskAddress = document.getElementById("txt-metamask-address")
const formMetamask = document.getElementsByClassName("form-metamask")
const formManual = document.getElementsByClassName("form-manual")
const lblResult = document.getElementById("lbl-result")
const lblAdminAddress = document.getElementById("lbl-admin-address")

const lblUsdt = document.getElementsByClassName("lbl-usdt")

async function copy(elmnt) {
  await navigator.clipboard.writeText(adminAddress);
  alert("Copied the text: " + adminAddress);
}

function checkLogin() {
  if (Moralis.User.current()) {
    btnLogin.classList.add('hidden')
    btnAddToMetamask.classList.remove('hidden')
    btnLogout.classList.remove('hidden')
    for(var i = 0; i < formManual.length; i++)
    {
      formManual[i].classList.add('hidden')
    }
    for(var i = 0; i < formMetamask.length; i++)
    {
      formMetamask[i].classList.remove('hidden')
    }
    
    btnSubmitMetamask.onclick = sendUsd
    txtAviorAmount = document.getElementById("txt-avior-amount-metamask")
    btnLogout.onclick = logOut
  } else {
    btnAddToMetamask.classList.add('hidden')
    btnLogout.classList.add('hidden')
    btnLogin.classList.remove('hidden')
    for(var i = 0; i < formManual.length; i++)
    {
      formManual[i].classList.remove('hidden')
    }
    for(var i = 0; i < formMetamask.length; i++)
    {
      formMetamask[i].classList.add('hidden')
    }

    btnSubmitMetamask.onclick = null
    txtAviorAmount = document.getElementById("txt-avior-amount-manual")
    btnLogout.onclick = null
  }
  txtAviorAmount.onkeyup = setUsdt
}

window.addEventListener('DOMContentLoaded', (e) => {
  let user = Moralis.User.current();
  
  if (user){
    userAddress = user.get("ethAddress")
  }

  checkLogin()
  lblAdminAddress.innerText = adminAddress
  getPrice()
  document.getElementById("txt-welcome").innerText = "AVIOR = $ " + aviorPrice
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
  usdtNeed = ((txtAviorAmount.value?txtAviorAmount.value:0) * aviorPrice/usdtPrice).toFixed(5)

  for(var i = 0; i < lblUsdt.length; i++)
  {
    lblUsdt[i].innerText = usdtNeed
  }
  
  lblResult.innerHTML = ''
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
  document.getElementById("txt-avior-price").innerHTML =  (aviorPrice/usdtPrice).toFixed(5  )
}

async function sendUsd(){
  if (usdtNeed > 0) {
    txtAviorAmount.classList.add('hidden')
    btnSubmitMetamask.classList.add('hidden')
    lblResult.innerText = "Do not leave this tab until the transaction is complete!!!"
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
        lblResult.innerHTML = result.transactionHash
      }
    }
    catch(e) {
      console.log(e)
      var message = ''
      if (e.code === 4001){
        message = '(User rejected the transaction)'
      }
      lblResult.innerHTML = 'Transaction failed. ' + message
    }
    txtAviorAmount.classList.remove('hidden')
    btnSubmitMetamask.classList.remove('hidden')
    window.onbeforeunload = null
  }
}

btnLogin.onclick = login;
btnAddToMetamask.onclick = addToMetamask;