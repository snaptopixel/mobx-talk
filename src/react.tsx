import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { AppState } from './state';

@observer
export class App extends React.Component<{state: AppState}> {
  public render() {
    const {state} = this.props;
    const tabItems = state.categories.map(cat => {
      return (
        <a className={cat === state.selectedCategory ? 'is-active': ''}
        onClick={() => state.selectedCategory = cat}>{cat}</a>
      )
    })
    const menuItems = state.visibleItems.map(item => {
      return (
        <a className="panel-block">
          <span className="panel-icon">
            <i className="fas fa-book" aria-hidden="true"></i>
          </span>
          {item.label}
        </a>
      )
    })
    return (
      <nav className="panel">
        <p className="panel-heading">
          repositories
        </p>
        <div className="panel-block">
          <p className="control has-icons-left">
            <input className="input is-small" type="text" placeholder="search"
              onInput={(event) => {
                state.query = (event.target as HTMLInputElement).value
              }}
              value={state.query}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        <p className="panel-tabs">{tabItems}</p>
        {menuItems}
      </nav>
    );
  }
}

export function init(el: HTMLElement, state: AppState) {
  ReactDOM.render(<App state={state}/>, el);
}