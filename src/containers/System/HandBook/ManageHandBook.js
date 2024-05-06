import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageHandBook.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { createNewHandBook } from '../../../services/userService';
import { toast } from "react-toastify";



const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            isLoading: false,
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() {


    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }


    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewHandBook = async () => {
        this.setState({
            isLoading: true
        })
        let res = await createNewHandBook(this.state)
        if (res?.errCode === 0) {
            toast.success('Add new HandBook succeeds!')
            this.setState({
                name: '',
                imageBase64: '',

                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error('Something wrongs....')
            console.log('>>  check res: ', res)
        }
        this.setState({
            isLoading: false
        })
    }

    render() {

        return (<>
            <div className="manage-specialty-container">
                <div className="ms-title">
                <FormattedMessage id="manage-handbook.title" />
                </div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="manage-handbook.name" />
                        </label>
                        <input className="form-control" type="text" value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />

                    </div>
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="manage-handbook.image" />
                        </label>
                        <input className="form-control-file" type="file"
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>

                    <div className="col-12">
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn-save-specialty"
                            onClick={() => this.handleSaveNewHandBook()}
                        >
                            <FormattedMessage id="manage-handbook.add" />
                        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandBook);
