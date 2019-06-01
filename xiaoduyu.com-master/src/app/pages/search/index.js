import React from 'react';
import { withRouter } from 'react-router';

import parseUrl from '@utils/parse-url';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import PostsList from '@modules/posts-list';
import PeopleList from '@modules/people-list';

import SingleColumns from '../../layout/single-columns';

// style
import './index.scss';

@Shell
@withRouter
export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      q: '',
      type: ''
    }
    this.search = this.search.bind(this);
    this.switchType = this.switchType.bind(this);
  }

  componentDidMount() {

    const { q = '', type = '' } = this.props.location.params || {};
    const { search } = this.refs;

    this.setState({
      type,
      q: decodeURIComponent(q)
    });

    search.value = decodeURIComponent(q);

    search.focus();
  }

  componentWillReceiveProps(props) {
    const { search } = this.refs;
    // 组件url发生变化
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      let params = props.location.search ? parseUrl(props.location.search) : {};
      const { q = '', type = '' } = params;
      search.value = decodeURIComponent(q);
      this.setState({
        type,
        q: decodeURIComponent(q)
      });
    }
  }

  search(event) {
    event.preventDefault();
    const { search } = this.refs;
    const { type } = this.state;

    if (!search.value) return search.focus();

    this.props.history.push(`/search?q=${search.value}${type && type == 'user' ? '&type=user' : '' }`);
    this.setState({ q: search.value });
  }

  switchType(type) {

    const { q } = this.state;

    if (!type) {
      this.props.history.push(`/search?q=${q}`);
    } else {
      this.props.history.push(`/search?q=${q}&type=${type}`);
    }

  }

  render() {

    const { q, type } = this.state;

    return(<SingleColumns>

      <Meta title="搜索" />

      <form onSubmit={this.search}>
        <div className="input-group">
          <input type="text" styleName="input" className="form-control" ref="search" placeholder="输入关键词搜索" />
          <div className="input-group-append">
            <button type="submit" styleName="search-button" className="btn btn-block btn-primary">搜索</button>
          </div>
        </div>
      </form>

      <div className="card p-2 mt-3 flex-row">
        <a className={`btn btn-sm ${type == '' ? 'btn-primary' : 'btn-link'}`} href="javascript:void(0)" onClick={()=>{ this.switchType(''); }}>帖子</a>
        <a className={`btn btn-sm ${type == 'user' ? 'btn-primary' : 'btn-link'}`}  href="javascript:void(0)" onClick={()=>{ this.switchType('user'); }}>用户</a>
      </div>

      {(()=>{
        if (!q) return

        if (!type) {
          return (<PostsList
            id={q}
            filters={{
              variables: {
                title: q,
                sort_by: "create_at",
                deleted: false,
                weaken: false
              }
            }}
            scrollLoad={true}
            />)
        } else if (type == 'user') {
          return (<PeopleList
            name={q}
            filters={{
              variables: {
                nickname: q
              }
            }}
            />)
        }

      })()}

    </SingleColumns>)
  }

}
