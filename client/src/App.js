import React, { useState, useEffect } from "react";
import CryptoCoder from "./contracts/CryptoCoders.json";
import getWeb3 from "./getWeb3";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [testAccounts, setTestAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [coders, setCoders] = useState([]);
  const [mintText, setMintText] = useState("");

  const loadNFTS = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();

    let nfts = [];
    for (let i = 0; i < totalSupply; i++) {
      let coder = await contract.methods.coders(i).call();
      nfts.push(coder);
    }
    setCoders(nfts);
  };

  const loadWeb3Account = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setTestAccounts(accounts);
    if (accounts) {
      setAccount(accounts[0]);
    }
  };

  const loadWebContract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const networkData = CryptoCoder.networks[networkId];
    console.log(networkId);
    console.log(networkData);
    if (networkData) {
      const abi = CryptoCoder.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      console.log(contract);
      return contract;
    }
  };

  // load WEB3 account from Metmask
  // load the contract
  // load all the NFTs

  useEffect(async () => {
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    let contract = await loadWebContract(web3);
    await loadNFTS(contract);
  }, []);

  const mint = async () => {
    console.log(mintText);
    await contract.methods
      .mint(mintText)
      .send({ from: account, gas: 5500000 }, (error) => {
        if (!error) {
          console.log("worked");
          // setCoders([...coders, mintText]);
          setMintText("");
        } else {
          console.log(error);
        }
      })
      .then(async () => {
        await loadNFTS(contract);
      });
  };
  async function testfunc() {
    console.log(coders);
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light px-4">
        <a className="navbar-brand" href="#">
          ???20??? ???????????????
        </a>
        <span>
          <select
            id="accounts"
            onChange={(e) => {
              setAccount(e.target.value);
            }}
          >
            {testAccounts.map((account, key) => (
              <option value={account} key={key}>
                {account}
              </option>
            ))}
          </select>
        </span>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              className="mb-4"
              src="https://avatars.dicebear.com/api/bottts/ssdrv.svg"
              alt=""
              width="72"
            />
            <h1 className="display-5 fw-bold">
              ????????? ??????????????? ?????? ???????????????.
            </h1>
            <div className="col-6 text-center mb-3">
              <p className="lead text-center">
                2022.03.09.(???) ??????????????? ?????? 6??? ~ ?????? 6???
                <br />
                (??? ?????????19?????????????? ?????????: ?????? 6??? ~ ?????? 7??? 30???)
              </p>
              <div>
                <input
                  type="text"
                  value={mintText}
                  onChange={(e) => setMintText(e.target.value)}
                  className="form-control mb-2"
                  placeholder="????????? ????????? ??????????????????."
                />
                <button onClick={mint} className="btn btn-primary">
                  ??????
                </button>
                <button
                  onClick={async () => {
                    const result = await contract.methods.totalSupply().call();
                    console.log(result);
                  }}
                >
                  ?????????
                </button>
              </div>
            </div>
            <div className="col-8 d-flex justify-content-center flex-wrap">
              {coders.map((coder, key) => (
                <div
                  className="d-flex flex-column align-items-center"
                  key={key}
                >
                  <img
                    width="150"
                    src={`https://avatars.dicebear.com/api/pixel-art/${coder.name.replace(
                      "#",
                      ""
                    )}.svg`}
                    value={coder.id}
                    onClick={async (e) => {
                      const coderid = e.target.getAttribute("value");
                      const voter = await contract.methods
                        .voters(account)
                        .call();
                      const totalSupply = await contract.methods
                        .totalSupply()
                        .call();
                      const ElectionResult = await contract.methods
                        .ElectionResult()
                        .call();
                      if (!ElectionResult) {
                        if (parseInt(totalSupply) === 5) {
                          if (!voter) {
                            await contract.methods
                              .vote(coderid)
                              .send(
                                { from: account, gas: 3000000 },
                                (error) => {
                                  if (!error) {
                                    console.log("worked");
                                  }
                                }
                              )
                              .then(async () => {
                                await loadNFTS(contract);
                              });
                          } else {
                            alert("?????????????????? ?????????????????????.");
                          }
                        } else {
                          alert("???????????? ?????? ???????????? ???????????????.");
                        }
                      } else {
                        alert("????????? ?????????????????????.");
                      }
                    }}
                  />

                  <span>
                    {coder.name} {coder.result ? "??????" : ""}
                  </span>
                  <span>????????? : {coder.voteCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
