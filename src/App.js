import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';
import {sortBy} from 'lodash';
import classNames from 'classnames';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const SORTS = {
  NONE: list => list,
  TITLE:list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'comment'),
  POINTS : list => sortBy(list, 'points'),
};


export default class App extends Component {
  _isMounted = false;
  constructor(sallam){
    super(sallam);
     this.state = {
        searchTerm: DEFAULT_QUERY,
       results:'',
       searchKey:'',
       error:null,
       isLoading:false,
       articles:'defualt'

      }
    }


 delete = (id)=>  {
   const {results, searchKey} = this.state;
   const {hits, page} = results[searchKey];
   var filtered =  hits.filter((item) => item.objectID !== id);
   this.setState({results: {...results, [searchKey]: {hits:filtered}}})
 }

 handleChange = (e)=> {this.setState({searchTerm: e.target.value})}

needsToSearchTopStories = (searchTerm) => !this.state.results[searchTerm]

 setSearchTopStories = (result) => {
 const {hits, page} = result;
 const {results, searchKey} = this.state;

 const old = results && results[searchKey]? results[searchKey].hits : [];
 const neww = [...old, ...hits];

 this.setState({results: {...results, [searchKey]: {hits:neww, page}}, isLoading:false})
 }


 fetchSearchTopStories = (term, page=0) => {
   this.setState({isLoading:true})
   axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${term}&page=${page}&hitsPerPage=100`)
  .then(result => this._isMounted && this.setSearchTopStories(result.data  ))
  .catch(error => this._isMounted &&  this.setState({ error:error }))
}

// setSearchTopStories = (result) => {
// const {hits, page} = result;
// this.setState(this.updateSearchTopStoriesState(hits, page));
// }
//
//
//
//
//
// updateSearchTopStoriesState = (hits, page) => (prevState) =>{
//  const {results, searchKey} = prevState;
// const old = results && results[searchKey]? results[searchKey].hits : [];
// const neww = [...old, ...hits];
// return{results: {...results, [searchKey]: {hits:neww, page}}, isLoading:false}
// }



onSearchSubmit = (event)=>  {
  const { searchTerm } = this.state;
  this.setState({searchKey:searchTerm})
  if(this.needsToSearchTopStories(searchTerm)){this.fetchSearchTopStories(searchTerm);}
  event.preventDefault();
}



 componentDidMount(){
   this._isMounted = true;
   const {searchTerm} = this.state;
   this.fetchSearchTopStories(searchTerm);
   this.setState({searchKey:searchTerm})

 

 }

componentWillMount(){
  this._isMounted = false;
}

render()

{
  const {results, searchTerm, searchKey, error, isLoading, sortKey, isSortReverse} = this.state;
  const page = (
  results &&
  results[searchKey] &&
  results[searchKey].page
  ) || 0;
  const list = (
  results &&
  results[searchKey] &&
  results[searchKey].hits
  ) || [];

const ButtonWithLoading = withLoading(Button);
  return  <div className="page">
    <div className="interactions">
    <Search onChange={this.handleChange} value={this.state.searchTerm} onSubmit={this.onSearchSubmit}>Search noww
    </Search></div>
          {error?   <div className="interactions">
                        <p>{this.state.error.toString()}</p>
                    </div>
                : <Table list={list} onClick={this.delete}/>}

    <div className="interactions">
    <ButtonWithLoading  isLoading={this.state.isLoading} onClick={()=> this.fetchSearchTopStories(this.state.searchKey, page+1)}>See more</ButtonWithLoading>
    </div>

    </div>

   }
}


const withLoading = (Component) => ({isLoading, ...rest}) =>
 isLoading? <div className="loading"><ReactLoading color="gray" type="spinningBubbles"/></div>:<Component {...rest}/>


class  Search extends Component
{
  constructor(props){
    super(props);
  }

  componentDidMount(){
if(this.inputElement){this.inputElement.style.backgroundColor='purple'; this.inputElement.focus();}
  }

render(){
const {onSubmit, children, onChange, value}  = this.props;
  return(
     <form onSubmit={onSubmit} className="soso" >{children}
  <input type="text" onChange={onChange} value={value} className="sallam" ref={(node)=>this.inputElement = node}/>
  <button type='submit'>Searchh</button>
  </form>)}
}



class  Table extends React.Component{
constructor(props){
  super(props);
  this.state = {
    sortKey: 'NONE',
    isSortReverse: false,}}

onSort = (sortKey) => {
const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
  this.setState({ sortKey,  isSortReverse })}

  render(){
const {list, onClick} = this.props;
const {sortKey, isSortReverse} = this.state;

const sortedList = SORTS[sortKey](list);
const reverseSortedList = isSortReverse? sortedList.reverse(): sortedList;
    return   (

    <div className="table">
    <div className="table-header">
    <span style={{ width: '20%' }}> <Sort activeSortKey={sortKey} onSort={this.onSort} sortKey="TITLE" >TITLE</Sort></span>
    <span style={{ width: '20%' }}> <Sort activeSortKey={sortKey} onSort={this.onSort} sortKey="COMMENTS" >COMMENTS</Sort></span>
    <span style={{ width: '20%' }}> <Sort activeSortKey={sortKey}onSort={this.onSort} sortKey="AUTHOR" >AUTHOR</Sort></span>
    <span style={{ width: '20%' }}> <Sort activeSortKey={sortKey} onSort={this.onSort} sortKey="POINTS" >POINTS</Sort></span>
    <span style={{ width: '20%' }}>ARCHIVE</span>
    </div>

    {reverseSortedList.map((f)=><div key={f.objectID} className="table-row">
    <span style={{ width: '40%' }}>
    <h2>Title: {f.title}</h2>
    <span style={{ width: '30%' , color:'blue'}}><h3>{f.author}</h3></span>
    <span style={{ width: '40%' }}><a href={f.url} >Click me</a></span><br/>
    <span style={{ width: '10%' }}>Number of comment: {f.num_comments}</span><br/>
    <span style={{ width: '10%' }}>Number of points: {f.points}</span><br/>
    <span style={{ width: '10%' }}><Button onClick={()=>this.onClick(f.objectID)}>Delete</Button></span>
    </span>  </div>)}
    </div>
  )
  }
}

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onClick:PropTypes.func.isRequired
}

const Sort = ({onSort, sortKey, children, activeSortKey}) =>{

  const sortClass = classNames('button-inline', {'button-active':  sortKey === activeSortKey});



return  <Button onClick={()=> onSort(sortKey)} className={sortClass}>{children}</Button>
}

const Button =({onClick, className, children}) =>

      <button onClick={onClick} type="button" className={className}>
{children}
    </button>


    Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};
    Button.defaultProps={
      className:'soso1'
    }


export {Table, Search, Button};
