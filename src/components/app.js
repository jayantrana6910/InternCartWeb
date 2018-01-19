import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Carousel from 'react-bootstrap/lib/Carousel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Image from 'react-bootstrap/lib/Image';
import axios from 'axios';

// import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
// import tough from 'tough-cookie';

// axiosCookieJarSupport(axios);
// const cookieJar = new tough.CookieJar();

// for session user/getOne/5d5d8264-3ea1-4802-ba3e-e1e6f6dd7b83

const LINK_HEAD = 'http://';
const ANSH_IP = '10.177.7.121';
const ANSH_PORT = 8080;
const YASH_IP = '10.177.7.117';
const YASH_PORT = 8080;
const SADD_IP = '10.177.7.123';
const SADD_PORT = 8081;
const AUTH_END = '/authenticate/login';
const USER_END = '/user/getOne?uid=';
import '../style/main.css';
const UID = localStorage.getItem('uid');

// <p>
//     {alreadyInCart ?
//         <Button onClick={this.removeFromCart} value={indiProduct.productId} bsStyle='primary'>Remove from Cart</Button>
//         :
//         <Button onClick={this.addToCart} value={indiProduct.productId} bsStyle='primary'>Add to Cart</Button>
//     }
// </p>

class App extends Component {

    state = {
        isLoggedIn: false,
        isSearchOn: false,
        showProducts: true,
        fullDetails: false,
        showLoginMod: false,
        showCartMod: false,
        email: '',
        password: '',
        name: '',
        uid: null,
        search: '',
        itemsInCart: 0,
        alreadyInCart: false,
        cartLimitExceed: false,
        orderPlaced: false,
        loginFirst: false,
        items: [
            {
                productId: '',
                pName: '',
                pPrice: 0,
                pBrand: '',
                pCategory: '',
                pimage: '',
                pUnit: 0
            }
        ],
        carts: [
            {
                pBrand: '',
                pCategory: '',
                pName: '',
                pPrice: 0,
                pUnit: 0,
                pimage: '',
                productId: ''
            }
        ],
        indiProduct: {
            pBrand: '',
            pCategory: '',
            pName: '',
            pPrice: 0,
            pUnit: 0,
            pimage: '',
            productId: ''
        },
        inCart: [
            {
                userId: '',
                productId: '',
                purchaseUnit: 0
            }
        ],
        placeOrder: [
            {
                productId: '',
                units: 0,
                price: 0
            }
        ]
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSearch = (event) => {
        this.setState({isSearchOn: true})
        axios({
            method: 'get',
            url: 'http://10.177.7.117:8080/search/get/' + event.target.value
        })
            .then(function (response) {

                let data = response.data
                console.log(this.state.items)
                let tempitems = this.state.items.slice()
                tempitems.splice(0, 100)
                for (var i=0; i<data.length; i++) {
                    tempitems.push({
                        productId: data[i].productId,
                        pName: data[i].pName,
                        pPrice: data[i].pPrice,
                        pBrand: data[i].pBrand,
                        pCategory: data[i].pCategory,
                        pimage: data[i].pimage,
                        pUnit: data[i].pUnit
                    })
                }
                this.setState({items: tempitems})
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
        this.setState({
            [event.target.id]: event.target.value
        })


    }

    doAuthentication (url) {

    }

    toHome = (event) => {
        this.setState({fullDetails: !this.state.fullDetails})
        this.setState({showProducts: !this.state.showProducts})
        this.setState({alreadyInCart: false})
    }

    dataInfo = (event) => {
        console.log('Clicked')
        this.setState({fullDetails: true})
        this.setState({isSearchOn: true})
        this.setState({showProducts: false})
        this.setState({showCartMod: false})
        let pid = event.target.id
        console.log(pid)
        let finalpid = pid


        if (UID != null) {
            let uid = UID.replace(/\"/g, "");
            axios({
                method: 'get',
                url: 'http://10.177.7.121:8080/cart/getByUid/' + uid
            })
                .then(function (response) {
                    console.log(response)
                    let data = response.data.productDTOList
                    let tempcarts = this.state.carts.slice();
                    tempcarts.splice(0, 100)
                    for (var i=0; i<data.length; i++) {
                        tempcarts.push({
                            pBrand: data[i].pBrand,
                            pCategory: data[i].pCategory,
                            pName: data[i].pName,
                            pPrice: data[i].pPrice,
                            pUnit: data[i].pUnit,
                            pimage: data[i].pimage,
                            productId: data[i].productId
                        })
                    }
                    this.setState({carts: tempcarts})
                }.bind(this))
                .catch(function (error) {
                    console.log(error)
                })
        }


        if (pid == '') {
            let lpid = event.target.parentNode.id
            finalpid = lpid
            if (lpid == '') {
                let llpid = event.target.parentNode.parentNode.id
                finalpid = llpid
                if(llpid == '') {
                    let lllpid = event.target.parentNode.parentNode.parentNode.id
                    finalpid = lllpid
                }
            }
        }

        for (var i=0; i<this.state.carts.length; i++) {
            let temppid = this.state.carts[i].productId
            console.log(temppid + ' : ' + finalpid)
            if (temppid == finalpid) {
                this.setState({alreadyInCart: true})
            }
        }

        console.log(finalpid)

        axios({
            method: 'get',
            url: 'http://10.177.7.117:8080/search/getOne/' + finalpid
        })
            .then(function (response) {
                console.log(response)
                let data = response.data
                console.log(data)
                this.setState({
                    indiProduct: data
                })
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.isLoggedIn);

        /*
        headers: {
                'content-type': "application/json",
                'cache-control': "no-cache",
                'postman-token': "f0c19477-d800-c1eb-448d-233954198da3"
            },
         */

        if (UID == null) {
            axios({
                method: 'post',
                url: 'http://' + SADD_IP + ':' + SADD_PORT + AUTH_END,
                data: {
                    'username': this.state.email,
                    'password': this.state.password
                }
            })
                .then(function (response) {
                    this.setState({isLoggedIn: true})
                    this.close()
                    console.log(response)
                    localStorage.setItem('uid', JSON.stringify(response.data.uid));
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                })
        }
        else {
            console.log(UID);
            this.setState({isLoggedIn: true})
            this.close()
        }


        /*axios.post('http://' + SADD_IP + ':' + SADD_PORT + AUTH_END, {
            data: {
                'userName': 'saddam@coviam.com',
                'password': '2345'
            }
        })*/


        /* axios.get('https://google.com', {
            jar: cookieJar,
            withCredentials: true
        })
            .then(() => {
                console.log(cookieJar);
            }); */
    }

    openCart = (event) => {
        this.setState({showCartMod: true})

        console.log(UID)
        if (UID != null) {
            let uid = UID.replace(/\"/g, "");
            axios({
                method: 'get',
                url: 'http://10.177.7.121:8080/cart/getByUid/' + uid
            })
                .then(function (response) {
                    console.log(response)
                    let data = response.data.productDTOList
                    let tempcarts = this.state.carts.slice();
                    tempcarts.splice(0, 100)
                    for (var i=0; i<data.length; i++) {
                        tempcarts.push({
                            pBrand: data[i].pBrand,
                            pCategory: data[i].pCategory,
                            pName: data[i].pName,
                            pPrice: data[i].pPrice,
                            pUnit: data[i].pUnit,
                            pimage: data[i].pimage,
                            productId: data[i].productId
                        })
                    }
                    this.setState({carts: tempcarts})
                }.bind(this))
                .catch(function (error) {
                    console.log(error)
                }.bind(this))
        }

    }

    addToCart = (event) => {

        console.log(event.target.value)
        console.log(UID)
        if (UID != null) {
            let uid = UID.replace(/\"/g, "");
            axios({
                method: 'post',
                url: 'http://10.177.7.121:8080/cart/addToCart',
                data: {
                    'userId': uid,
                    'productId': event.target.value,
                    'purchaseUnit': 1
                }
            })
                .then(function (response) {
                    console.log(response)
                    this.setState({cartLimitExceed: false})
                }.bind(this))
                .catch(function (error) {
                    console.log(error)
                    this.setState({cartLimitExceed: true})
                }.bind(this))


        }
        else {
            this.setState({loginFirst: true})
            this.setState({fullDetails: !this.state.fullDetails})
            this.setState({showProducts: !this.state.showProducts})
        }


    }

    removeFromCart = (event) => {

        let pid = event.target.id
        let uid = UID.replace(/\"/g, "");
        axios({
            method: 'post',
            url: 'http://10.177.7.121:8080/cart/remove',
            data: {
                'userId': uid,
                'productId': pid,
                'purchaseUnit': 1
            }
        })
            .then(function (response) {
                console.log(response)
                // let tempcarts = this.state.carts.slice()
                // for (var i=0; i<tempcarts.length; i++) {
                //     console.log(pid);
                //     console.log(tempcarts[i].productId);
                //     if (tempcarts[i].productId == pid) {
                //         tempcarts.splice(i, 1)
                //         console.log('deleted element: ' + tempcarts[i])
                //     }
                // }
                axios({
                    method: 'get',
                    url: 'http://10.177.7.121:8080/cart/getByUid/' + uid
                })
                    .then(function (response) {
                        console.log(response)
                        let data = response.data.productDTOList
                        let tempcarts = this.state.carts.slice();
                        tempcarts.splice(0, 100)
                        for (var i=0; i<data.length; i++) {
                            tempcarts.push({
                                pBrand: data[i].pBrand,
                                pCategory: data[i].pCategory,
                                pName: data[i].pName,
                                pPrice: data[i].pPrice,
                                pUnit: data[i].pUnit,
                                pimage: data[i].pimage,
                                productId: data[i].productId
                            })
                        }
                        this.setState({carts: tempcarts})
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error)
                    })
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })

    }

    placeOrder = (event) => {

        let uid = UID.replace(/\"/g, "");

        let temporder = this.state.placeOrder.slice()
        temporder.splice(0, 10)

        for (var i=0; i<this.state.carts.length; i++) {
            let propname = this.state.carts[i].productId
            let units = this.state.carts[i].pUnit
            let price = this.state.carts[i].pPrice
            temporder.push({productId: propname, units: units, price: price})
            this.setState({placeOrder: temporder})
        }

        var productInfos = {

        }

        for (var i=0; i<temporder.length; i++) {
            productInfos[temporder[i].productId] = {'units': temporder[i].units, 'price': temporder[i].price}
        }
        console.log(uid)

        axios({
            method: 'post',
            url: 'http://10.177.7.115:8080/order/add',
            data: {
                uId: uid,
                productInfos: productInfos
            }
        })
            .then(function (response) {
                console.log(response)
                this.setState({orderPlaced : true})
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
        //console.log(this.state.placeOrder)
        // this.setState({
        //     placeOrder: {uid: 1, productInfos: {'1' : 3, '3': 4, '12': 3}}
        // })

    }

    logout = () => {
        localStorage.removeItem('uid');
        this.setState({isLoggedIn: false})
        console.log('reaching')
    }

    open = (state) => {
        this.setState({[state]: true})
    }

    close = () => {
        if (this.state.showLoginMod) {
            this.setState({showLoginMod: false})
        }
        if (this.state.showCartMod) {
            this.setState({showCartMod: false})
        }
        if (this.state.cartLimitExceed) {
            this.setState({cartLimitExceed: false})
        }
        if (this.state.orderPlaced) {
            this.setState({orderPlaced: false})
        }
        if (this.state.loginFirst) {
            this.setState({loginFirst: false})
        }
    }

    componentDidMount() {

        if(this.state.items[0].pPrice == 0){
            this.state.items.splice(0, 1);
        }
        if(this.state.carts[0].pPrice == 0){
            this.state.carts.splice(0, 1);
        }
        if(this.state.placeOrder[0].price == 0){
            this.state.carts.splice(0, 1);
        }
        axios({
            method: 'get',
            url: 'http://10.177.7.117:8080/search/latest'
        })
            .then(function (response) {
                let data = response.data

                console.log(data[0].productId)
                let tempitems = this.state.items.slice()
                for (var i=0; i<data.length; i++) {
                    tempitems.push({
                        productId: data[i].productId,
                        pName: data[i].pName,
                        pPrice: data[i].pPrice,
                        pBrand: data[i].pBrand,
                        pCategory: data[i].pCategory,
                        pimage: data[i].pimage,
                        pUnit: data[i].pUnit
                    })
                }

                this.setState({items: tempitems})
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })

        if (UID != null) {
            this.setState({isLoggedIn: true})
            //let uid = UID.replace(/\"/g, "");
            //let url = USER_END + uid
            //console.log(encodeURI(test))
            let uid = UID.replace(/\"/g, "");
            axios({
                method: 'get',
                url: 'http://' + SADD_IP + ':' + SADD_PORT + USER_END + uid,

            })
           /* axios({
                method: 'post',
                url: 'http://' + SADD_IP + ':' + SADD_PORT + AUTH_END,
                data: {
                    'username': this.state.email,
                    'password': this.state.password
                }
            })*/
                .then(function (response) {

                    let fname = response.data.firstName
                    let lname = response.data.lastName
                    this.setState({name: fname + ' ' + lname})
                    console.log(this.state.name)
                }.bind(this))
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    render() {
        const { isLoggedIn, isSearchOn, showProducts, fullDetails, items, name, carts, indiProduct } = this.state

        return (
            <div className='App'>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href='localhost:8080'>InternCart</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Form pullRight>
                        <FormGroup controlId='search'>
                            <FormControl
                                value={this.state.search}
                                onChange={this.handleSearch}
                                type="text"
                                placeholder="Search"
                            />
                        </FormGroup>
                    </Navbar.Form>
                    {isLoggedIn ?
                        <Nav pullRight>
                            <NavItem>
                                <a onClick={this.logout}>Logout</a>
                            </NavItem>
                            <NavItem>
                                <a href='#' onClick={this.openCart}>Cart</a>
                            </NavItem>
                            <NavItem>
                                <a href='#'>{name}</a>
                            </NavItem>
                        </Nav> :
                        <Nav pullRight>
                            <NavItem>
                                <a href='#' onClick={(event) => this.open('showLoginMod')}>Login</a>
                            </NavItem>
                        </Nav>}
                </Navbar>
                {isSearchOn ?
                <br /> :
                    <Row>
                        <Carousel>
                            <Carousel.Item>
                                <Col xs={12} lg={12} md={12} className='CenterMain'>
                                    <span className='MainText'>Welcome to InternCart</span>
                                    <span className='SubText'>We give you happiness</span>
                                </Col>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Col xs={12} lg={12} md={12} className='CenterMain'>
                                    <Image className='CarouselImage' responsive src='../img/mobile1.jpg'/>
                                </Col>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Col xs={12} lg={12} md={12} className='CenterMain'>
                                    <Image className='CarouselImage' responsive src='../img/mobile2.jpg'/>
                                </Col>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Col xs={12} lg={12} md={12} className='CenterMain'>
                                    <Image className='CarouselImage' responsive src='../img/shoe1.jpg'/>
                                </Col>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Col xs={12} lg={12} md={12} className='CenterMain'>
                                    <Image className='CarouselImage' responsive src='../img/shoe2.jpg'/>
                                </Col>
                            </Carousel.Item>
                        </Carousel>
                    </Row>
                }
                {showProducts ?
                    <Row>
                        <Col xs={12} md={12} lg={12}>
                            <h3 className='CategoryHeading'>Latest Items</h3>
                            <Row>
                                {items.map((row, index) => (
                                    <Col id={row.productId} key={index} xs={12} md={12} lg={3}>
                                        <Thumbnail className='ProdThumb' alt='160x100' src={row.pimage} onClick={this.dataInfo}>
                                            <h3>{row.pName}</h3>
                                            <p>Rs. {row.pPrice}</p>
                                        </Thumbnail>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row> :
                    <br />
                }


                <Modal show={this.state.showLoginMod} onHide={this.close}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>

                            <Modal.Title>Login</Modal.Title>
                            <Modal.Body>
                                <FormGroup controlId="email" bsSize="large">
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl
                                        autoFocus
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup controlId="password" bsSize="large">
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        type="password"
                                    />
                                </FormGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    block
                                    bsSize="large"
                                    disabled={!this.validateForm()}
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </Modal.Footer>
                    </Modal.Header>
                    </form>
                </Modal>

                <Modal show={this.state.showCartMod} onHide={this.close}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>

                            <Modal.Title>My Cart</Modal.Title>
                            <Modal.Body>
                                <Row>
                                    {carts.map((row, index) => (
                                        <Col id={row.productId} key={index} xs={12} md={3} lg={6}>
                                            <Thumbnail className='ProdThumb' onClick={this.dataInfo} alt='160x100' src={row.pimage}>
                                                <h3>{row.pName}</h3>
                                                <p>Price: {row.pPrice}</p>
                                                <p>Qty: {row.pUnit}</p>
                                            </Thumbnail>
                                            <p>
                                                <a className='RemoveButton' id={row.productId} onClick={this.removeFromCart}>Remove from cart</a>
                                            </p>
                                        </Col>
                                    ))}
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    block
                                    bsSize="large"
                                    type="submit"
                                    onClick={this.placeOrder}
                                >
                                    Place Order
                                </Button>
                            </Modal.Footer>
                        </Modal.Header>
                    </form>
                </Modal>

                <Modal show={this.state.cartLimitExceed} onHide={this.close}>
                        <Modal.Header closeButton>

                            <Modal.Title>Error!!!</Modal.Title>
                            <Modal.Body>
                                <h3>Your Cart is FULL!!!</h3>
                                <p>Cart Limit: 4</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    block
                                    bsSize="large"
                                    type="submit"
                                    onClick={this.close}
                                >
                                    OK
                                </Button>
                            </Modal.Footer>
                        </Modal.Header>
                </Modal>

                <Modal show={this.state.orderPlaced} onHide={this.close}>
                    <Modal.Header closeButton>

                        <Modal.Title>Congratulations</Modal.Title>
                        <Modal.Body>
                            <h3>ORDER PLACED</h3>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                block
                                bsSize="large"
                                type="submit"
                                onClick={this.close}
                            >
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal.Header>
                </Modal>

                <Modal show={this.state.loginFirst} onHide={this.close}>
                    <Modal.Header closeButton>

                        <Modal.Title>Error!!!</Modal.Title>
                        <Modal.Body>
                            <h3>Login First !!!</h3>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                block
                                bsSize="large"
                                type="submit"
                                onClick={this.close}
                            >
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal.Header>
                </Modal>

                {fullDetails ?
                    <Row>
                        <Col xs={12} md={12} lg={4}>
                            <Image responsive className='AllDetail' src={indiProduct.pimage} />
                        </Col>
                        <Col xs={12} md={12} lg={8}>
                            <h3>Item Name: {indiProduct.pName}</h3>
                            <p>Brand: {indiProduct.pBrand}</p>
                            <p>Category: {indiProduct.pCategory}</p>
                            <p>Price: {indiProduct.pPrice}</p>
                            <p>
                                <Button onClick={this.addToCart} value={indiProduct.productId} bsStyle='primary'>Add to Cart</Button>
                            </p>
                            <a onClick={this.toHome}>back</a>
                        </Col>
                    </Row> :
                    <br />
                }
            </div>
        )
    }
}

export default App