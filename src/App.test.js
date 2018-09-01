import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';
import {Search, Table, Button} from './App.js';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

const props ={
koko:[1,1],
list: [
  { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
  { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
]
}


describe('This is the first test: App', ()=>{
  // it('it11 ', ()=>{
  //   var div = document.createElement('div');
  //   ReactDOM.render(<App/>, div);
  //   ReactDOM.unmountComponentAtNode(div);
  // });
  it('it11', ()=>{
    const render = shallow(<App/>);
    expect(render.find('.page').length).toBe(1);
  })
  test('test11', ()=> {
    const renderr = renderer.create(<App/>);
    let tree = renderr.toJSON();
    expect(tree).toMatchSnapshot();
  })
})


describe('This is the second test: Search', ()=>{
  // it('it22', ()=> {
  //   const d = document.createElement('div');
  //   ReactDOM.render(<Search/>, d);
  //   ReactDOM.unmountComponentAtNode(d);
  // })
it('it22', ()=>{
  const render = shallow(<Search/>);
  expect(render.find('.sallam').length).toBe(1)
})
  test('test22', ()=>{
    const render1 = renderer.create(<Search/>);
    let tree = render1.toJSON();
    expect(tree).toMatchSnapshot();
  })
})


describe('This is the third test: Button', ()=>{
  // it("it33", ()=>{
  //   const d = document.createElement('div');
  //   ReactDOM.render(<Button/> , d);
  //   ReactDOM.unmountComponentAtNode(d);
  // })
  it("it33", ()=>{
    const data = shallow(<Button onClick={()=>console.log('dd')} />);
    expect(data.find('.soso1').length).toBe(1)

  })

  test('test33', ()=>{
    const renderr = renderer.create(<Button onClick={()=>console.log('dd')} />);
    let tree = renderr.toJSON();
    expect(tree).toMatchSnapshot();
  })
})



describe('This is the fourth test: Table', ()=>{
  // it('it44', ()=>{
  //   const d = document.createElement('div');
  //   ReactDOM.render(<Table list={{...props}.list}/>, d);
  //   ReactDOM.unmountComponentAtNode(d);
  // })

 it('it44', ()=>{
   const render = shallow(<Table list={{...props}.list} onClick={()=>console.log('Click')} /> );
   expect(render.find('.table-row').length).toBe(2);
 })

  test('test44', ()=>{
    const r = renderer.create(<Table {...props} onClick={()=>console.log('Click')}/>);
    let tree = r.toJSON();
    expect(tree).toMatchSnapshot()
  })
})
