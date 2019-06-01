import React from 'react'
// import PropTypes from 'prop-types'
import Qiniu from './qiniu.js'

// import './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getQiNiuToken } from '@actions/qiniu'

// import Loading from '../../components/loading'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  })
)
export default class QiniuUploadImage extends React.Component {

  static defaultProps = {
    displayLoading: true,
    text: "上传图片",
    multiple: true,
    beforeUpload: (s)=>{},
    upload: (s)=>{},
    onDrop: (files)=>{},
    onUpload: (file)=>{}
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      files: [],
      token: '',
      url: '',
      uploadKey: '',
      isMount: true
    }

    this.onDrop = this._onDrop.bind(this)
    this.onUpload = this.onUpload.bind(this)
  }

  async componentDidMount() {

    const { getQiNiuToken } = this.props;

    let [err, result] = await getQiNiuToken();

    if (!this.state.isMount) return;

    if (result) {
      this.setState({ token: result.token, url: result.url })
    }

  }

  componentWillUnmount() {
    this.state.isMount = false;
  }

  onUpload(files) {

    const self = this
    const { beforeUpload, upload } = this.props
    const { url } = this.state

    self.setState({ loading: true })

    let count = 0;

    // console.log(files);

    // console.log(files);

    beforeUpload(files);

    files.map(item=>{

      item.upload().then((res)=>{


        res.text().then(res=>{

          res = JSON.parse(res);

          upload(url+'/'+res.key, item);

          count = count + 1;

          if (count >= files.length) {
            self.setState({ loading: false })
          }

        });
      });
    });

    /*
    return

    const self = this
    const { upload, onUpload } = this.props
    const { url } = this.state

    self.setState({ loading: true })

    let count = 0

    files.map(function (f) {

      if (f.type == '') {
        alert('上传图片格式错误')
        self.setState({ loading: false, progress: '' })
        return
      }

      f.onprogress = function(e) {

        onUpload(e)

        if (e.percent == 100 && e.currentTarget.status && e.currentTarget.status == 200) {

          // 上传完成

          upload(url+'/'+JSON.parse(e.currentTarget.response).key)

          count = count + 1

          if (count >= files.length) {
            self.setState({ loading: false })
          }

        }
      }

    })
    */
  }

  _onDrop(files) {
    const { onDrop } = this.props
    onDrop(files)
  }

  render() {

    // console.log(this.state.token);

    if (!this.state.token) {
      return (<span></span>)
    }

    const { loading, token } = this.state
    const { multiple, name, displayLoading, text } = this.props

    return (
        <Qiniu
          text={text}
          // onDrop={this.onDrop}
          // size={100}
          multiple={multiple}
          accept="image/*"
          token={this.state.token}
          // uploadKey={this.state.uploadKey}
          // maxSize="1Mb"
          onUpload={this.onUpload} />
    );
  }
}
