import React, { Component } from "react";
import SChain from "./contracts/SChain.json";
//import SChainData from "./contracts/SChainData.json";
import getWeb3 from "./getWeb3";
import 'semantic-ui-css/semantic.min.css';
import {
  Input,
  Button,
  Grid,
  GridRow,
  GridColumn,
  Header,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
  TableHeaderCell,
  Dropdown,
  Card,
  Icon,
  Image
} from "semantic-ui-react";
import "./App.css";

class App extends Component {
  state = {
    clicked: false,
    storageValue: 0,
    web3: null,
    accounts: null,
    account: null,
    farmer1: null,
    farmer2: null,
    farmer3: null,
    transporter: null,
    distributor: null,
    retailer: null,
    chain: [],
    chains: [],
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
    productVariety: '',
    productType: '',
    productCategory: '',
    harvestingTime: '',
    packagingTime: '',
    departureTime: '',
    receivingTime: '',
    cookedTime: '',
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

    let chains = [];

    let chainIds = await contract.methods.getChainIds().call({ friom: account });
    console.log("chain ids:", chainIds);

    let product = await contract.methods.getProduct(
      "CHAIN-01", "PROD-01"
    ).call({ friom: account });

    console.log("product:", product);

    // CHGAIN-01
    let chain = await contract.methods.getChain(
      "CHAIN-01"
    ).call({ from: account });

    this.setState({ chain });

    chains.push(chain);

    // CHGAIN-02
    chain = await contract.methods.getChain(
      "CHAIN-02"
    ).call({ from: account });

    chains.push(chain);

    // CHGAIN-03
    chain = await contract.methods.getChain(
      "CHAIN-03"
    ).call({ from: account });

    chains.push(chain);

    console.log('category:', chains);

    let farmer1 = await contract.methods.partners('0x5A723E8E764Ffc31c345671a02FE30f480F744c0').call({ from: account });
    let farmer2 = await contract.methods.partners('0xCFF53C362B144131f2290Aa8fC61Dc4f809A1211').call({ from: account });
    let farmer3 = await contract.methods.partners('0xE6967996e99eD3B5c974311E923031325e4E554F').call({ from: account });
    let transporter = await contract.methods.partners('0xA69B7f886b32fd019F18bd8318C36E2fc73b9544').call({ from: account });
    let distributor = await contract.methods.partners('0x2882fC6F59bC22E51D53ea1169754D9305812b89').call({ from: account });
    let retailer = await contract.methods.partners('0x57C9eb1E2B1d262676F4212079C47979073339B1').call({ from: account });

    this.setState({ chains, farmer1, farmer2, farmer3, transporter, distributor, retailer });
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
      productVariety,
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
        productVariety: productVariety,
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
        productCategory: productCategory,
        productType: productType,
        productVariety: productVariety,
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
        productCategory: productCategory,
        productType: productType,
        productVariety: productVariety,
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
        productCategory: productCategory,
        productType: productType,
        productVariety: productVariety,
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
      productVariety: '',
      harvestingTime: '',
      packagingTime: '',
      departureTime: '',
      receivingTime: '',
      cookedTime: '',
      transporter: '',
      receiver: '',
    })
  }

  checkHistory = async () => {
    const { chains } = this.state;

    this.setState({clicked: !this.state.clicked});
    
    console.log(chains);
  }

  render() {
    const {
      clicked,
      chain,
      chains,
      formatedAccount,
      username, 
      userCategory,
      partner
    } = this.state;
    const nb = chain.length;
    const partners = ["Farmer", "Transporter", "Distributor", "Retailer"];

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
                  <GridColumn textAlign="left">{username}</GridColumn>
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
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
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
                        placeholder='product variety'
                        value={this.state.productVariety}
                        onChange={e => this.setState({ productVariety: e.target.value })}
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
                      <div style={{marginTop: 70}}>
                        {
                          nb !== 0 ?
                            <div>
                              <Header as='h1'>Product</Header>
                              <Table definition>
                                <TableHeader>
                                  <TableRow>
                                    <TableHeaderCell />
                                    <TableHeaderCell>Category</TableHeaderCell>
                                    <TableHeaderCell>Type</TableHeaderCell>
                                    <TableHeaderCell>Variety</TableHeaderCell>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {
                                    chain.map((res, index, arr) =>
                                      <TableRow key={index}>
                                        <TableCell>{partners[index]}</TableCell>
                                        <TableCell>{chain[index].productCategory}</TableCell>
                                        <TableCell>{chain[index].productType}</TableCell>
                                        <TableCell>{chain[index].productVariety}</TableCell>
                                      </TableRow>
                                    )
                                  }
                                </TableBody>
                              </Table>
                            </div>
                          :
                            console.log("")
                        }
                        <Table definition>

                        </Table>
                      </div>
                    </GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </div>
          : userCategory === 'Transporter' ?
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{username}</GridColumn>
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
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
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
                        placeholder='product variety'
                        value={this.state.productVariety}
                        onChange={e => this.setState({ productVariety: e.target.value })}
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
                  <GridColumn textAlign="left">{username}</GridColumn>
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
                        placeholder='product category'
                        value={this.state.productCategory}
                        onChange={e => this.setState({ productCategory: e.target.value })}
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
                        placeholder='product variety'
                        value={this.state.productVariety}
                        onChange={e => this.setState({ productVariety: e.target.value })}
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
                  <GridColumn textAlign="left">{username}</GridColumn>
                  <GridColumn textAlign="right">{formatedAccount}</GridColumn>
                </GridRow>
              </Grid>
              <div style={{ marginTop: 80 }}>
                <h1>Vous voulez connaître l'origine de nos produits</h1>
                <br></br>
                <hr />
                <br></br>
                <br></br>
                <div>
                  <Dropdown text='Selectionner un produit' pointing className='link item'>
                    <Dropdown.Menu>
                      <Dropdown.Header>Categories</Dropdown.Header>
                      <Dropdown.Item>
                        <Dropdown text='Fruit'>
                          <Dropdown.Menu>
                            <Dropdown.Header>Type</Dropdown.Header>
                            <Dropdown.Item>
                              <Dropdown text="Poire">
                                <Dropdown.Menu>
                                  <Dropdown.Header>Variété</Dropdown.Header>
                                  <Dropdown.Item>Williams</Dropdown.Item>
                                  <Dropdown.Item>Conférence</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown text="Pomme">
                                <Dropdown.Menu>
                                  <Dropdown.Header>Variété</Dropdown.Header>
                                  <Dropdown.Item>Golden</Dropdown.Item>
                                  <Dropdown.Item>Fuji</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>

                      <Dropdown.Item>
                        <Dropdown text='Légume'>
                          <Dropdown.Menu>
                            <Dropdown.Header>Type</Dropdown.Header>
                            <Dropdown.Item>Epinard</Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown text="Chou">
                                <Dropdown.Menu>
                                  <Dropdown.Header>Variété</Dropdown.Header>
                                  <Dropdown.Item>Chinois</Dropdown.Item>
                                  <Dropdown.Item>Blanc</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>

                      <Dropdown.Item>
                        <Dropdown text='Poisson'>
                          <Dropdown.Menu>
                            <Dropdown.Header>Type</Dropdown.Header>
                            <Dropdown.Item>Cabillaud</Dropdown.Item>
                            <Dropdown.Item>Dorade</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
                {
                  clicked === true ?
                    <Grid>
                    <GridRow columns={4}>
                      <GridColumn>
                        <div style={{ marginTop: 100, paddingBottom: 100}}>
                          <Card onClick={this.checkHistory}>
                            <Image src='https://couteaux-et-tirebouchons.com/wp-content/uploads/2016/09/Cabillaud-chou-fleur-r%C3%B4ti-sarrasin-kasha-mayonnaise-aux-herbes.jpg' wrapped ui={false} />
                            <Card.Content>
                              <Card.Header>Pavé de cabillaud, chou, poire</Card.Header>
                              <Card.Meta></Card.Meta>
                              <br></br>
                              <strong>19€</strong>
                              <Card.Description>
                                  <br></br>
                                  <br></br>
                                Cliquer pour l'historique
                              </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                              <Icon name='like' color="red" />
                              100
                            </Card.Content>
                          </Card>
                        </div>
                      </GridColumn>
                      <GridColumn textAlign="left">
                        <div style={{ marginTop: 100, paddingBottom: 100}}>
                          <Header>{chains[0][0].productType}</Header>
                          <br></br>
                          <br></br>
                          <strong>Agriculteur:</strong> {this.state.farmer1.name}
                          <hr></hr>
                          <strong>Récolte:</strong>
                          <br></br>
                          {(new Date(chains[0][0].harvestingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Date de l'assemblage:</strong>
                          <br></br>
                          {(new Date(chains[0][0].packagingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Remis au transporteur:</strong>
                          <br></br>
                          {(new Date(chains[0][0].departureTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <br></br>

                          <strong>Transporteur:</strong> {this.state.transporter.name}
                          <hr></hr>
                          <strong>Réccupéré:</strong>
                          <br></br>
                          {(new Date(chains[0][0].departureTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Livré au distributeur:</strong>
                          <br></br>
                          {(new Date(chains[0][1].receivingTime * 1000)).toLocaleString()}

                          <br></br>
                          <br></br>
                          <br></br>
                          <strong>Distributor:</strong> {this.state.distributor.name}
                          <hr></hr>
                          <strong>Reçu:</strong>
                          <br></br>
                          {(new Date(chains[0][1].receivingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Livré à:</strong> {this.state.retailer.name}
                          <br></br>
                        </div>
                      </GridColumn>
                      <GridColumn textAlign="left">
                        <div style={{ marginTop: 100, paddingBottom: 100}}>
                          <Header>{chains[1][0].productType}</Header>
                          <br></br>
                          <br></br>
                          <strong>Pisciculteur:</strong> {this.state.farmer2.name}
                          <hr></hr>
                          <strong>Pêché:</strong>
                          <br></br>
                          {(new Date(chains[1][0].harvestingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Date de l'assemblage:</strong>
                          <br></br>
                          {(new Date(chains[1][0].packagingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Remis au transporteur:</strong>
                          <br></br>
                          {(new Date(chains[1][0].departureTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <br></br>

                          <strong>Transporteur:</strong> {this.state.transporter.name}
                          <hr></hr>
                          <strong>Réccupéré:</strong>
                          <br></br>
                          {(new Date(chains[1][0].departureTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Livré au distributeur:</strong>
                          <br></br>
                          {(new Date(chains[1][1].receivingTime * 1000)).toLocaleString()}

                          <br></br>
                          <br></br>
                          <br></br>
                          <strong>Distributor:</strong> {this.state.distributor.name}
                          <hr></hr>
                          <strong>Reçu:</strong>
                          <br></br>
                          {(new Date(chains[1][1].receivingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Livré à:</strong> {this.state.retailer.name}
                          <br></br>
                        </div>
                      </GridColumn>
                      <GridColumn textAlign="left">
                        <div style={{ marginTop: 100, paddingBottom: 100}}>
                          <Header>{chains[2][0].productType}</Header>
                          <br></br>
                          <br></br>
                          <strong>Agriculteur:</strong> {this.state.farmer3.name}
                          <hr></hr>
                          <strong>Récolté:</strong>
                          <br></br>
                          {(new Date(chains[2][0].harvestingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Date de l'assemblage:</strong>
                          <br></br>
                          {(new Date(chains[2][0].packagingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Remis au transporteur:</strong>
                          <br></br>
                          {(new Date(chains[2][0].departureTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <br></br>

                          <strong>Transporteur:</strong> {this.state.transporter.name}
                          <hr></hr>
                          <strong>Réccupéré:</strong>
                          <br></br>
                          {(new Date(chains[2][0].departureTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Livré au distributeur:</strong>
                          <br></br>
                          {(new Date(chains[2][1].receivingTime * 1000)).toLocaleString()}

                          <br></br>
                          <br></br>
                          <br></br>
                          <strong>Distributor:</strong> {this.state.distributor.name}
                          <hr></hr>
                          <strong>Reçu:</strong>
                          <br></br>
                          {(new Date(chains[2][1].receivingTime * 1000)).toLocaleString()}
                          <br></br>
                          <br></br>
                          <strong>Livré à:</strong> {this.state.retailer.name}
                          <br></br>
                        </div>
                      </GridColumn>
                    </GridRow>
                    </Grid>
                  :
                  <div style={{ marginTop: 100, paddingBottom: 100, paddingLeft: 550}}>
                    <Card onClick={this.checkHistory}>
                      <Image src='https://couteaux-et-tirebouchons.com/wp-content/uploads/2016/09/Cabillaud-chou-fleur-r%C3%B4ti-sarrasin-kasha-mayonnaise-aux-herbes.jpg' wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>Pavé de cabillaud, chou, poire</Card.Header>
                        <Card.Meta></Card.Meta>
                        <br></br>
                        <strong>19€</strong>
                        <Card.Description>
                            <br></br>
                            <br></br>
                          Cliquer pour l'historique
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Icon name='like' color="red" />
                        100
                      </Card.Content>
                    </Card>
                  </div>
                }
            </div>
          :
            <div>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn textAlign="left">{username}</GridColumn>
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
                    <GridColumn textAlign="right"></GridColumn>
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
