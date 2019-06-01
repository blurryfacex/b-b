
// import { loadReportTypes } from '@actions/report';
import { loadTopicList } from '@actions/topic';
import { loadUserInfo } from '@actions/user';

// 初始化数据
// redux 中的数据清理、以及准备一些经常不变的数据
export default (store, accessToken) => {
  return new Promise (async resolve => {
    
    // 再其他地方已经处理，这里暂时保留逻辑 
    // =======================================================
    // store的数据，如果不清空，store的数据会一直存在
    // store.dispatch({ type: 'CLEAN' });

    // =======================================================
    // 一些经常通用数据，不会经常更新的数据，在服务器获取并储存在store中
    
    // await loadReportTypes()(store.dispatch, store.getState);
    
    await loadTopicList({
      id: 'recommend-topics',
      filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
    })(store.dispatch, store.getState);

    if (accessToken) {
      let res = await loadUserInfo({ accessToken })(store.dispatch, store.getState);
      resolve(res);
    } else {
      resolve([]);
    }

  });
}
