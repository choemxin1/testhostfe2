import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
//import './DetailHandbook.scss';
import { getAllDetailHandBookById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
//import LikeAndShare from '../SocialPlugin/LikeAndShare';
//import Comment from '../SocialPlugin/Comment';
import _ from 'lodash';
class DetailHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandBook: {},
            isLoading:false
        }
    }

    async componentDidMount() {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            console.log('check id handbook', this.props)
            this.setState ({
                isLoading:true
            })
            let res = await getAllDetailHandBookById(id);
            if (res?.errCode === 0) {
                this.setState({
                    dataDetailHandBook: res.data,
                })
            }
            this.setState ({
                isLoading:false
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    render() {
        let { language } = this.props;
        let { dataDetailHandBook } = this.state;


        return (
            <>
                <div className="detail-specialty-container">
                    <HomeHeader />
                    <div className="detail-specialty-body">
                        <div className="description-spcialty">
                            {dataDetailHandBook && !_.isEmpty(dataDetailHandBook)
                                &&
                                <>
                                    <div>{dataDetailHandBook.name}</div>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetailHandBook.descriptionHTML }}>

                                    </div>
                                </>
                            }

                        </div>



                    </div>

                </div>
                {this.state.isLoading && (<div className='container-ring'><div className="ring">Loading...
                        <span></span>
                    </div></div>)}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
