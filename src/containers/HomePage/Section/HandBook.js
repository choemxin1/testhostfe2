import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';;

class HandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrHandBook: [],
            isLoading:true
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.handBooks !== this.props.handBooks) {
            this.setState({
                arrHandBook: this.props.handBooks
            })
        }
    }
    componentDidMount() {
        this.setState({
            isLoading: true
        })
        this.props.loadHandBook();
        this.setState({
            isLoading: false
        })
    }
    handleViewDetailHandBook = (handbook) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${handbook.id}`)
        }
    }
    render() {
let {arrHandBook} = this.state;
        return (<>
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="homepage.handbook" /></span>
                        <button className="btn-section"><FormattedMessage id="homepage.more-infor" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            
                            {arrHandBook?.length > 0 &&
                                arrHandBook.map((item, index) => {
                                    return (
                                        <div className="section-customize handbook-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailHandBook(item)}

                                        >
                                            <div className="bg-image section-medical-facility "

                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className="handbook-name">{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
            {this.state.isLoading && (<div className='container-ring'><div className="ring">Loading...
            <span></span>
        </div>
        </div>)}</>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        handBooks: state.admin.handBooks

    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadHandBook: () => dispatch(actions.fetchHandBooks())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
