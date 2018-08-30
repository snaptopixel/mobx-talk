import angular from 'angular';
import mobxAngular from 'mobx-angularjs';
import { AppState } from './state';

let appState: AppState;

const app = angular.module('app', [mobxAngular]);
app.component('app', {
    template: /* html */`
      <nav class="panel" mobx-autorun>
        <p class="panel-heading">
          repositories
        </p>
        <div class="panel-block">
          <p class="control has-icons-left">
            <input class="input is-small" type="text" placeholder="search" ng-model="$ctrl.state.query">
            <span class="icon is-small is-left">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        <p class="panel-tabs">
          <a ng-class="{'is-active': $ctrl.state.selectedCategory === cat}" ng-repeat="cat in $ctrl.state.categories" ng-click="$ctrl.state.selectedCategory = cat">{{cat}}</a>
          <a>public</a>
        </p>
        <a class="panel-block" ng-repeat="item in $ctrl.state.visibleItems">
          <span class="panel-icon">
            <i class="fas fa-book" aria-hidden="true"></i>
          </span>
          {{item.label}}
        </a>
      </nav>
    `,
    controller: class AngularApp {
      public state!: AppState;
      $onInit() {
        this.state = appState;
      }
    }
  })

export function init(el: HTMLElement, state: AppState) {
  el.innerHTML = '<app></app>';
  appState = state;
  angular.bootstrap(el, ['app']);
}