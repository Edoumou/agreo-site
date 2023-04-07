import React, { Component } from "react";
import SChain from "./contracts/SChain.json";
//import SChainData from "./contracts/SChainData.json";
import getWeb3 from "./getWeb3";
import 'semantic-ui-css/semantic.min.css';
import { Input, Button, Grid, GridRow, GridColumn, Header, Table, TableRow, TableCell, TableBody } from "semantic-ui-react";
import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    account: null,
    formatedAccount: null,
    contract: null,
    partner: '',
    dataContract: null,
    registered: false,
    inputUsername: '',
    username: '',
    userCategory: '',
    amount: '',
    recipient: '',
    category: '',
    name: '',
    location: '',
    url: '',
    email: '',
    phone: '',
    chainId: '',
    productId: '',
    productName: '',
    productType: '',
    productCategory: '',
    harvestingTime: '',
    packagingTime: '',
    departureTime: '',
    receivingTime: '',
    cookedTime: '',
    transporter: '',
    receiver: '',
    listOfChains: []
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      let account = accounts[0];

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = SChain.networks[networkId];
      const contract = new web3.eth.Contract(
        SChain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account, contract }, this.runExample);

      await this.getAccount();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { account, contract } = this.state;

    await this.getAccount();

    let partner = await contract.methods.partners(account)
      .call({ from: account });

    let front = account.substr(0, 6);
    let end = account.substr(account.length - 4, account.length - 1);

    if(partner.isPartner === false) {
      this.setState({
        partner,
        username: partner.name,
        formatedAccount: `${front}...${end}`
      });
    } else {
      this.setState({
        userCategory: partner.category,
        partner,
        username: partner.name,
        formatedAccount: `${front}...${end}`
      });
    }

    let chainIds = await contract.methods.getChainIds().call({ friom: account });
    console.log("chain ids:", chainIds);

    let product = await contract.methods.getProduct(
      "CHAIN-01", "PROD-01"
    ).call({ friom: account });

    console.log("product:", product);

    
    let chain = await contract.methods.getChain(
      "CHAIN-01"
    ).call({ from: account });

    console.log("chain:", chain);
  };

  getAccount = async () => {
    if (this.state.web3 !== null || this.state.web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        if (this.state.contract !== null) {
          let front = accounts[0].substr(0, 6);
          let end = accounts[0].substr(accounts[0].length - 4, accounts[0].length - 1);
          let partner = await this.state.contract.methods.partners(accounts[0])
            .call({ from: accounts[0] });

          this.setState({
            partner,
            userCategory: partner.category,
            username: partner.name,
            formatedAccount: `${front}...${end}`
          });
        }

        this.setState({
          account: accounts[0]
        });
      });
    }
  }

  register = async () => {
    const { account, contract, category, name, location, url, email, phone } = this.state;
    
    await contract.methods.partnerRegistration(
      category, name, location, url, email, phone
    ).send({ from: account });

    let partner = await contract.methods.partners(account).call({ from: account });
    console.log('partner:', partner);

    let front = account.substr(0, 6);
    let end = account.substr(account.length - 4, account.length - 1);

    //let farmerIds = await contract.methods.

    this.setState({
      partner,
      category: '',
      formatedAccount: `${front}...${end}`,
      name: '',
      location: '',
      url: '',
      email: '',
      phone: ''
    })
  }

  registerProduct = async () => {
    const {
      account,
      contract,
      chainId,
      productId,
      productName,
      productType,
      productCategory,
      userCategory,
      harvestingTime,
      packagingTime,
      departureTime,
      receivingTime,
      cookedTime,
      transporter,
      receiver
    } = this.state;

    let product;

    if (userCategory === 'Farmer') {
      product = {
        productName: productName,
        productType: productType,
        productCategory: productCategory,
        harvestingTime: harvestingTime,
        packagingTime: packagingTime,
        departureTime: departureTime,
        receivingTime: '0',
        cookedTime: '0',
        stakeholderAddress: account,
        transporterAddress: transporter,
        receiverAddress: receiver
      }

      await contract.methods.productRegistration(chainId, productId, product)
      .send({ from: account });
    }

    if (userCategory === 'Transporter') {
      product = {
        productName: productName,
        productType: productType,
        productCategory: productCategory,
        harvestingTime: '0',
        packagingTime: '0',
        departureTime: departureTime,
        receivingTime: receivingTime,
        cookedTime: '0',
        stakeholderAddress: account,
        transporterAddress: account,
        receiverAddress: receiver
      }

      await contract.methods.ProductTransportation(chainId, productId, product)
      .send({ from: account });
    }

    if (userCategory === 'Distributor') {
      product = {
        productName: productName,
        productType: productType,
        productCategory: productCategory,
        harvestingTime: '0',
        packagingTime: '0',
        departureTime: departureTime,
        receivingTime: receivingTime,
        cookedTime: '0',
        stakeholderAddress: account,
        transporterAddress: transporter,
        receiverAddress: receiver
      }

      await contract.methods.productDistribution(chainId, productId, product)
      .send({ from: account });
    }

    if (userCategory === 'Retailer') {
      product = {
        productName: productName,
        productType: productType,
        productCategory: productCategory,
        harvestingTime: '0',
        packagingTime: '0',
        departureTime: departureTime,
        receivingTime: receivingTime,
        cookedTime: cookedTime,
        stakeholderAddress: account,
        transporterAddress: "0x0000000000000000000000000000000000000000",
        receiverAddress: "0x0000000000000000000000000000000000000000"
      }

      await contract.methods.ReailerProduct(chainId, productId, product)
      .send({ from: account });
    }

    let partner = await contract.methods.partners(account)
      .call({ from: account });

    this.setState({
      userCategory: partner.category,
      category: '',
      name: '',
      location: '',
      url: '',
      email: '',
      phone: '',
      chainId: '',
      productId: '',
      productName: '',
      productType: '',
      productCategory: '',
      harvestingTime: '',
      packagingTime: '',
      departureTime: '',
      receivingTime: '',
      cookedTime: '',
      transporter: '',
      receiver: '',
    })
  }

  render() {
    const { formatedAccount, userCategory, partner } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {
          userCategory === 'Farmer' ?
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{userCategory}</GridColumn>
                  <GridColumn textAlign="right">{formatedAccount}</GridColumn>
                </GridRow>
              </Grid>
              <div style={{marginTop: 120, marginLeft: 50, marginRight: 50}}>
                <Grid>
                  <GridRow columns={2}>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Register a product</Header>
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='chain id'
                        value={this.state.chainId}
                        onChange={e => this.setState({ chainId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product id'
                        value={this.state.productId}
                        onChange={e => this.setState({ productId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product name'
                        value={this.state.productName}
                        onChange={e => this.setState({ productName: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product type'
                        value={this.state.productType}
                        onChange={e => this.setState({ productType: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='harvesting time'
                        value={this.state.harvestingTime}
                        onChange={e => this.setState({ harvestingTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='packaging time'
                        value={this.state.packagingTime}
                        onChange={e => this.setState({ packagingTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='departure Time'
                        value={this.state.departureTime}
                        onChange={e => this.setState({ departureTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='transporter address'
                        value={this.state.transporter}
                        onChange={e => this.setState({ transporter: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='receiver address'
                        value={this.state.receiver}
                        onChange={e => this.setState({ receiver: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <div style={{ width: 290 }}>
                        <Button
                          fluid
                          size='large'
                          color='vk'
                          content="Register"
                          onClick={this.registerProduct}
                        />
                      </div>
                    </GridColumn>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Farmer identity</Header>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{partner.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>{partner.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>site</TableCell>
                            <TableCell>{partner.url}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{partner.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Phone</TableCell>
                            <TableCell>{partner.phoneNumber}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </div>
          : userCategory === 'Transporter' ?
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{userCategory}</GridColumn>
                  <GridColumn textAlign="right">{formatedAccount}</GridColumn>
                </GridRow>
              </Grid>
              <div style={{marginTop: 120, marginLeft: 50, marginRight: 50}}>
                <Grid>
                <GridRow columns={2}>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Register a product</Header>
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='chain id'
                        value={this.state.chainId}
                        onChange={e => this.setState({ chainId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product id'
                        value={this.state.productId}
                        onChange={e => this.setState({ productId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product name'
                        value={this.state.productName}
                        onChange={e => this.setState({ productName: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product type'
                        value={this.state.productType}
                        onChange={e => this.setState({ productType: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='receiving time'
                        value={this.state.receivingTime}
                        onChange={e => this.setState({ receivingTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='departure Time'
                        value={this.state.departureTime}
                        onChange={e => this.setState({ departureTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='receiver address'
                        value={this.state.receiver}
                        onChange={e => this.setState({ receiver: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <div style={{ width: 290 }}>
                        <Button
                          fluid
                          size='large'
                          color='vk'
                          content="Register"
                          onClick={this.registerProduct}
                        />
                      </div>
                    </GridColumn>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Transporter identity</Header>
                      <br></br>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{partner.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>{partner.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>site</TableCell>
                            <TableCell>{partner.url}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{partner.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Phone</TableCell>
                            <TableCell>{partner.phoneNumber}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </div>
          : userCategory === 'Distributor' ?
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{userCategory}</GridColumn>
                  <GridColumn textAlign="right">{formatedAccount}</GridColumn>
                </GridRow>
              </Grid>
              <div style={{marginTop: 120, marginLeft: 50, marginRight: 50}}>
                <Grid>
                <GridRow columns={2}>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Register a product</Header>
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='chain id'
                        value={this.state.chainId}
                        onChange={e => this.setState({ chainId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product id'
                        value={this.state.productId}
                        onChange={e => this.setState({ productId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product name'
                        value={this.state.productName}
                        onChange={e => this.setState({ productName: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product type'
                        value={this.state.productType}
                        onChange={e => this.setState({ productType: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='receiving time'
                        value={this.state.receivingTime}
                        onChange={e => this.setState({ receivingTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='departure Time'
                        value={this.state.departureTime}
                        onChange={e => this.setState({ departureTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='transporter address'
                        value={this.state.transporter}
                        onChange={e => this.setState({ transporter: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='receiver address'
                        value={this.state.receiver}
                        onChange={e => this.setState({ receiver: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <div style={{ width: 290 }}>
                        <Button
                          fluid
                          size='large'
                          color='vk'
                          content="Register"
                          onClick={this.registerProduct}
                        />
                      </div>
                    </GridColumn>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Distributor identity</Header>
                      <br></br>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{partner.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>{partner.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>site</TableCell>
                            <TableCell>{partner.url}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{partner.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Phone</TableCell>
                            <TableCell>{partner.phoneNumber}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </div>
          : userCategory === 'Retailer' ?
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{userCategory}</GridColumn>
                  <GridColumn textAlign="right">{formatedAccount}</GridColumn>
                </GridRow>
              </Grid>
              <div style={{marginTop: 120, marginLeft: 50, marginRight: 50}}>
                <Grid>
                <GridRow columns={2}>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Register a product</Header>
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='chain id'
                        value={this.state.chainId}
                        onChange={e => this.setState({ chainId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product id'
                        value={this.state.productId}
                        onChange={e => this.setState({ productId: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product name'
                        value={this.state.productName}
                        onChange={e => this.setState({ productName: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product type'
                        value={this.state.productType}
                        onChange={e => this.setState({ productType: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='receiving time'
                        value={this.state.receivingTime}
                        onChange={e => this.setState({ receivingTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='cooked Time'
                        value={this.state.cookedTime}
                        onChange={e => this.setState({ cookedTime: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <div style={{ width: 290 }}>
                        <Button
                          fluid
                          size='large'
                          color='vk'
                          content="Register"
                          onClick={this.registerProduct}
                        />
                      </div>
                    </GridColumn>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Retailer identity</Header>
                      <br></br>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{partner.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>{partner.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>site</TableCell>
                            <TableCell>{partner.url}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{partner.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Phone</TableCell>
                            <TableCell>{partner.phoneNumber}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </div>
          :
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{userCategory}</GridColumn>
                  <GridColumn textAlign="right">{formatedAccount}</GridColumn>
                </GridRow>
              </Grid>
              <div style={{marginTop: 120, marginLeft: 50, marginRight: 50}}>
                <Grid>
                  <GridRow columns={2}>
                    <GridColumn textAlign="left">
                      <Header as='h1'>Sign Up</Header>
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='category id'
                        value={this.state.category}
                        onChange={e => this.setState({ category: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='name'
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='location'
                        value={this.state.location}
                        onChange={e => this.setState({ location: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='site url'
                        value={this.state.url}
                        onChange={e => this.setState({ url: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='email'
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <Input
                        placeholder='phone'
                        value={this.state.phone}
                        onChange={e => this.setState({ phone: e.target.value })}
                      />
                      <br></br>
                      <br></br>
                      <div style={{ width: 290 }}>
                        <Button
                          fluid
                          size='large'
                          color='vk'
                          content="Register"
                          onClick={this.register}
                        />
                      </div>
                    </GridColumn>
                    <GridColumn textAlign="right">2</GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default App;
