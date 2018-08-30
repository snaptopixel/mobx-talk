import { observable, computed } from "mobx";

export class AppState {
  @observable public items = [
    {label: 'react', categories: ['public', 'front-end', 'javascript']},
    {label: 'angular', categories: ['public', 'front-end', 'javascript']},
    {label: 'mobx', categories: ['public', 'front-end', 'javascript', 'typescript']},
    {label: 'vue', categories: ['public', 'front-end', 'javascript']},
    {label: 'metroid', categories: ['private', 'back-end', 'go']},
    {label: 'uservoice', categories: ['private', 'back-end', 'ruby']},
    {label: 'admin', categories: ['private', 'front-end', 'javascript', 'typescript']},
  ]

  @observable public query!: string;
  @observable public selectedCategory!: string;

  @computed get categories() {
    return this.items.reduce((cats, item) => {
      item.categories.map(cat => {
        if (cats.indexOf(cat) === -1) {
          cats.push(cat);
        }
      })
      return cats;
    }, [] as string[])
  }

  @computed get visibleItems() {
    return this.items.filter(item => {
      const categoryMatch = this.selectedCategory
        ? item.categories.indexOf(this.selectedCategory) > -1
        : true
      const queryMatch = this.query
        ? item.label.indexOf(this.query) > -1
        : true
      return categoryMatch && queryMatch
    })
  }
}