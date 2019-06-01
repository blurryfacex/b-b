import React from 'react';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import SessionList from '@modules/session-list';

// layout
import SingleColumns from '../../layout/single-columns';

@Shell
export default class Sessions extends React.PureComponent {

  render() {

    return(
      <SingleColumns>
        <Meta />

        <SessionList
          id="all"
          filters={{
            query: {
              sort_by:'last_message:-1'
            }
          }}
          />
      </SingleColumns>
    )
  }

}
