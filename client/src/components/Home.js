import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import headerImage from './img/farmer.jpeg'
import "../App.css";

class Home extends Component {
    render() {
        return (
            <div>
                <div className='header-img'>
                    <Card fluid>
                        <div className="header-img">
                        <Image
                            src={headerImage}
                            size="large"
                        />
                        </div>
                    </Card>
                </div>
                <h1>Hello User</h1>
            </div>
        );
    }
}

export default Home;