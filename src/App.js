import React, { useState } from 'react';

import './App.css';

function App() {
  const [smartWalletAddress, setSmartWalletAddress] = useState(null);
  const [signerWalletAddress, setSignerWalletAddress] = useState(null);

  return (
    <>

      <header>
        <div id="logo-container">
          <h1 id="logo-text" class="text-center">
            Smart Wallet PoC
          </h1>
        </div>
      </header>

      <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
          <p class="info-text alert alert-primary">
            Network: <span id="network">Polygon Mumbai</span>
          </p>
        </div>

        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
          <p class="info-text alert alert-secondary">
            ChainId: <span id="chainId">80001</span>
          </p>
        </div>
      </div>

      <section class="address-data">
        <h3 class="card-title">
          <span> <strong> Smart Wallet Address : </strong> </span> {smartWalletAddress}
        </h3>
        <h3 class="card-title">
          <span> <strong> Signer Address : </strong> </span> {signerWalletAddress}
        </h3>
      </section>

      <hr class="solid"></hr>

      <section class="generate-addresses">
        <div class="row">
          <div class="col">
            <button
              class="btn btn-primary generate-buttons"
              id="generateSigner"
              disabled={false}
              onClick={() => { }}
            >
              Generate Signer
            </button>
          </div>

          <div class="col">
            <button
              class="btn btn-primary generate-buttons"
              id="getSmartWalletAddress"
              disabled={false}
              onClick={() => { }}
            >
              Get Smart Wallet Address
            </button>
          </div>
        </div>
      </section>

      <hr class="solid"></hr>

      <section>
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">
                  Title 1
                </h4>

                <hr class="solid"></hr>

                <button
                  class="btn btn-primary btn-lg btn-block mb-3"
                  id="connectButton"
                  disabled={false}
                >
                  Button 1
                </button>


                <p class="info-text alert alert-secondary">
                  Response 1: <span id="getAccountsResult"></span>
                </p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">
                  Title 2
                </h4>

                <hr class="solid"></hr>

                <button
                  class="btn btn-primary btn-lg btn-block mb-3"
                  id="connectButton"
                  disabled={false}
                >
                  Button 2
                </button>

                <p class="info-text alert alert-secondary">
                  Response 2: <span id="getAccountsResult"></span>
                </p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">
                  Title 3
                </h4>

                <hr class="solid"></hr>

                <div class="form-group">
                  <label> <strong> Recipient Address </strong></label>
                  <input
                    class="form-control"
                    type="text"
                    placeholder="0xabcd...xyz"
                    id="batchMintTokenIds"
                  />
                </div>

                <button
                  class="btn btn-primary btn-lg btn-block mb-3"
                  id="connectButton"
                  disabled={false}
                >
                  Button 3
                </button>

                <p class="info-text alert alert-secondary">
                  Response 3: <span id="getAccountsResult"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;