import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { LANGUAGES } from '../../../utils';
import { getExtraInforDoctorById } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';

class DoctorExtraInfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
            isLoading:false
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            this.setState ({
                isLoading:true
            })
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res?.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
            this.setState ({
                isLoading:false
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            this.setState ({
                isLoading:true
            })
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
            this.setState ({
                isLoading:false
            })
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;
        return (
            <>
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address">
                        <FormattedMessage id="patient.extra-infor-doctor.text-address" />
                    </div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className="detail-address">
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                    </div>
                </div>
                <div className="content-down">
                    {isShowDetailInfor === false &&
                        <div className="short-infor">
                            <FormattedMessage id="patient.extra-infor-doctor.price" />
                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI
                                &&
                                <NumberFormat
                                    className="currency"
                                    value={extraInfor.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />
                            }

                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN
                                &&
                                <NumberFormat
                                    className="currency"
                                    value={extraInfor.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'$'}
                                />
                            }

                            <span className="detail" onClick={() => this.showHideDetailInfor(true)}>
                                <FormattedMessage id="patient.extra-infor-doctor.detail" />
                            </span>
                        </div>
                    }

                    {isShowDetailInfor === true &&
                        <>
                            <div className="title-price">
                                <FormattedMessage id="patient.extra-infor-doctor.price" />
                            </div>
                            <div className="detail-infor">
                                <div className="price">
                                    <span className="left">
                                        <FormattedMessage id="patient.extra-infor-doctor.price" />
                                    </span>
                                    <span className="right">
                                        {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI
                                            &&
                                            <NumberFormat
                                                className="currency"
                                                value={extraInfor.priceTypeData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            />
                                        }

                                        {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN
                                            &&
                                            <NumberFormat
                                                className="currency"
                                                value={extraInfor.priceTypeData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'$'}
                                            />
                                        }
                                    </span>
                                </div>
                                <div className="note">
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>

                            </div>
                            <div className="payment">
                                <FormattedMessage id="patient.extra-infor-doctor.payment" />

                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.VI
                                    ? extraInfor.paymentTypeData.valueVi : ''}

                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.EN
                                    ?
                                    extraInfor.paymentTypeData.valueEn : ''}

                            </div>
                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInfor(false)}>
                                    <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                                </span>
                            </div>

                        </>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
