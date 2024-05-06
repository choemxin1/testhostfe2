import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isLoading: false
        }
    }

    async componentDidMount() {
        this.setState ({
            isLoading:true
        })
        this.getDataPatient()
        this.setState ({
            isLoading:false
        })
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            this.setState ({
                isLoading:true
            })
            await this.getDataPatient()
            this.setState ({
                isLoading:false
            })
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isLoading: true
        })

        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });


        if (res && res.errCode === 0) {
            
            this.closeRemedyModal();
            await this.getDataPatient();
            this.setState({
                isLoading: false
            })
            toast.success('Send Remedy succeeds:');
        } else {
            this.setState({
                isLoading: false
            })
            toast.error('Something wrongs....');
            console.log('error send remedy: ', res)
        }
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;
        return (
            <>
                
                    <div className="manage-patient-container">
                        <div className="m-p-title">
                        <FormattedMessage id="manage-patient.title" />
                        </div>
                        <div className="manage-patient-body row">
                            <div className="col-4 form-group">
                                <label>
                                <FormattedMessage id="manage-patient.choose-date" />

                                </label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}

                                />
                            </div>
                            <div className="col-12 table-manange-patient">
                                <table style={{ width: '100%' }} >
                                    <tbody>
                                        <tr>
                                            <th>
                                                <FormattedMessage id="manage-patient.numerical-order" />
                                                </th>
                                            <th><FormattedMessage id="manage-patient.Time" /></th>
                                            <th><FormattedMessage id="manage-patient.Name" /></th>
                                            <th><FormattedMessage id="manage-patient.Address" /></th>
                                            <th><FormattedMessage id="manage-patient.Gender" /></th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let time = language === LANGUAGES.VI ?
                                                    item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                let gender = language === LANGUAGES.VI ?
                                                    item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.firstName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>
                                                            <button className="mp-btn-confirm"
                                                                onClick={() => this.handleBtnConfirm(item)}>
                                                                Xác nhận
                                                            </button>

                                                        </td>
                                                    </tr>
                                                )
                                            })

                                            :

                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center" }}>no data</td>
                                            </tr>
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
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
        user: state.user.userInfo,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
